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
  authFailed: boolean;
  handleUpdateUserDetailsState: (data: User) => void;
  handleUserSignOut: () => void;
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
  const [authFailed, setAuthFailed] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    getUserSession();
  }, []);

  const getUserSession = async () => {
    setAuthFailed(false);
    const { data, error } = await supabaseClient.auth.getSession();
    console.log(data);
    if (error) {
      console.error("Error fetching session:", error.message);
      setUser(null);
      setAuthFailed(true);
    }

    if (data.session) {
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
      });
    }
  };

  const handleUserSignOut = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.error("Error:", error);
    }
    navigate("/login");
    setUser(null);
    setAuthFailed(false);
    // window.location.reload();
  };

  const handleUpdateUserDetailsState = (data: User) => {
    setUser({ ...data });
  };

  return (
    <AppointmentContext.Provider
      value={{
        user,
        handleUpdateUserDetailsState,
        handleUserSignOut,
        authFailed,
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
