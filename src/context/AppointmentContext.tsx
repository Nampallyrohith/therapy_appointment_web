import { useFetchData } from "@/hooks/apiCall";
import { User, UserMeta } from "@/models/typeDefinitions";
import { supabaseClient } from "@/supabase/connection";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";

// This type should be here, no need to shift it to typeDefinitions file!
type AppointmentContextType = {
  user: User | null;
  userMeta: UserMeta | null;
  isAuthToken: boolean;
  selectedTherapy: string;
  selectedDoctor: string;
  handleUpdateUserDetailsState: (data: User) => void;
  handleUserSignOut: () => void;
  isLoading: boolean;
  setSelectedTherapy: (therapy: string) => void;
  setSelectedDoctor: (doctor: string) => void;
  getUserDetailsFromDB: () => void;
};

const AppointmentContext = createContext<AppointmentContextType | undefined>(
  undefined
);

interface AppointmentProviderProps {
  children: ReactNode;
}

export const AppointmentProvider: React.FC<AppointmentProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userMeta, setUserMeta] = useState<UserMeta | null>(null);
  const [isAuthToken, setIsAuthToken] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTherapy, setSelectedTherapy] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const navigate = useNavigate();

  // API's Call
  const {
    data: userResult,
    loading,
    call,
  } = useFetchData<{
    userDetails: User;
    userMeta: UserMeta;
  }>();

  useEffect(() => {
    getUserSession();
  }, []);

  useEffect(() => {
    if (!user?.gender && !user?.dob && !user?.phone && user?.googleUserId) {
      getUserDetailsFromDB();
    }
  }, [user]);

  const getUserDetailsFromDB = async () => {
    await call(`user/profile-info/${user?.googleUserId}`);
  };

  useEffect(() => {
    if (!loading && userResult) {
      setUser(userResult.userDetails);
      setUserMeta(userResult.userMeta);
    }
  }, [loading, userResult]);

  useEffect(() => {
    setIsAuthToken(!!user);
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    const refreshTokenInterval = setInterval(async () => {
      const { data, error } = await supabaseClient.auth.refreshSession();
      if (error) {
        console.error("Error refreshing session:", error.message);
        handleUserSignOut();
        return;
      }
      console.log("Session refreshed:", data);
      if (data?.session?.user) {
        setUser({
          googleUserId: data.session.user.id,
          name: data.session.user?.user_metadata?.full_name,
          email: data.session.user.email,
          avatarUrl: data.session.user.user_metadata?.avatar_url,
          phone: null,
          gender: null,
          dob: null,
        });
        setUserMeta({
          providerToken: data.session.provider_token,
          createdAt: data.session.user.created_at,
          lastSignInAt: data.session.user.last_sign_in_at,
          expiresAt: data.session.expires_at,
          refreshToken: data.session.refresh_token,
          accessToken: data.session.access_token,
        });
      }
    }, 1000 * 60 * 14);

    return () => clearInterval(refreshTokenInterval);
  }, []);

  const getUserSession = async () => {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) {
      console.error("Error fetching session:", error.message);
      setUser(null);
      return;
    }

    if (data?.session?.user) {
      const userName = data.session.user?.user_metadata?.full_name;
      const userDetails = data.session.user;
      setUser({
        googleUserId: userDetails?.id,
        name: userName,
        email: userDetails?.email,
        avatarUrl: data.session.user.user_metadata?.avatar_url,
        phone: null,
        gender: null,
        dob: null,
      });
      setUserMeta({
        providerToken: data.session?.provider_token,
        createdAt: userDetails.created_at,
        lastSignInAt: userDetails.last_sign_in_at,
        expiresAt: data.session.expires_at,
        refreshToken: data.session.refresh_token,
        accessToken: data.session.access_token,
      });
    }
  };

  const handleUserSignOut = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      return;
    }
    setUser(null);
    setUserMeta(null);
    setIsAuthToken(false);
    sessionStorage.removeItem("intendedRoute"); // Clear on logout!
    navigate("/login");
  };

  const handleUpdateUserDetailsState = (data: User) => {
    setUser({ ...data });
  };

  return (
    <AppointmentContext.Provider
      value={{
        user,
        isAuthToken,
        isLoading,
        userMeta,
        handleUpdateUserDetailsState,
        handleUserSignOut,
        selectedTherapy,
        selectedDoctor,
        setSelectedTherapy,
        setSelectedDoctor,
        getUserDetailsFromDB,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointmentContext = (): AppointmentContextType => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error(
      "useAppointmentContext must be used within an AppointmentProvider"
    );
  }
  return context;
};
