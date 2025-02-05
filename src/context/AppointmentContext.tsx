import { User } from "@/models/typeDefinations";
import { supabaseClient } from "@/supabase/connection";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";

type AppointmentContextType = {
  user: User | null;
  isAuthToken: boolean;
  handleUpdateUserDetailsState: (data: User) => void;
  handleUserSignOut: () => void;
  isLoading: boolean;
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
  const [isAuthToken, setIsAuthToken] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getUserSession();
  }, []);

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
          id: data.session.user.id,
          name: data.session.user?.user_metadata?.full_name,
          email: data.session.user.email,
          providerToken: data.session.provider_token,
          avatarUrl: data.session.user.user_metadata?.avatar_url,
          phone: null,
          gender: null,
          dob: null,
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
        id: userDetails?.id,
        name: userName,
        email: userDetails?.email,
        providerToken: data.session?.provider_token,
        avatarUrl: data.session.user.user_metadata?.avatar_url,
        phone: null,
        gender: null,
        dob: null,
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
      console.error("Error:", error);
    }
    setUser(null);
    setIsAuthToken(false);
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
        handleUpdateUserDetailsState,
        handleUserSignOut,
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
