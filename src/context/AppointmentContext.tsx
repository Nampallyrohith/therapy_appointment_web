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

interface BaseUpcoming {
  typeOfTherapy: string;
  doctorName: string;
  bookedBy: string;
  bookedOn: string;
  timingOfMeeting: string;
  description: string;
}

interface Cancelled extends BaseUpcoming {
  cancelledOn: string;
}

interface Previous extends BaseUpcoming {
  attended: boolean;
}

export type Appointment = BaseUpcoming | Cancelled | Previous;

interface FilterProps {
  filterId: string;
  filterButtonText: string;
}

export const filterDetails: FilterProps[] = [
  {
    filterId: "upcoming",
    filterButtonText: "Upcoming Appointments",
  },
  {
    filterId: "cancelled",
    filterButtonText: "Cancelled Appointments",
  },
  {
    filterId: "previous",
    filterButtonText: "Previous Appointments",
  },
];

// TODO: Replace dummy data with actual data from db
// TODO: Add meetingLink field inside every appointment
export const dummyData: Record<string, Appointment[]> = {
  upcoming: [
    {
      typeOfTherapy: "Humanistic Therapy",
      doctorName: "Dr. Emily Carter",
      bookedBy: "John Doe",
      bookedOn: "2025-01-01",
      timingOfMeeting: "2025-01-10T10:00:00Z",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
    },
    {
      typeOfTherapy: "Psychodynamic Therapy",
      doctorName: "Dr. Michael Thompson",
      bookedBy: "Jane Smith",
      bookedOn: "2025-01-02",
      timingOfMeeting: "2025-01-11T14:30:00Z",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
    },
    {
      typeOfTherapy: "Behavioral Therapy",
      doctorName: "Dr. Olivia Johnson",
      bookedBy: "Alice Brown",
      bookedOn: "2025-01-03",
      timingOfMeeting: "2025-01-12T16:00:00Z",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
    },
    {
      typeOfTherapy: "Cognitive Behavioral Therapy",
      doctorName: "Dr. William Lee",
      bookedBy: "Charlie Davis",
      bookedOn: "2025-01-04",
      timingOfMeeting: "2025-01-13T09:00:00Z",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
    },
    {
      typeOfTherapy: "Humanistic Therapy",
      doctorName: "Dr. Sophia Martinez",
      bookedBy: "Emma Wilson",
      bookedOn: "2025-01-05",
      timingOfMeeting: "2025-01-14T13:30:00Z",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
    },
  ],
  cancelled: [
    {
      typeOfTherapy: "Humanistic Therapy",
      doctorName: "Dr. Emily Carter",
      bookedBy: "John Doe",
      bookedOn: "2025-01-01",
      timingOfMeeting: "2025-01-10T10:00:00Z",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      cancelledOn: "2025-01-08",
    },
    {
      typeOfTherapy: "Psychodynamic Therapy",
      doctorName: "Dr. Michael Thompson",
      bookedBy: "Jane Smith",
      bookedOn: "2025-01-02",
      timingOfMeeting: "2025-01-11T14:30:00Z",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      cancelledOn: "2025-01-07",
    },
    {
      typeOfTherapy: "Behavioral Therapy",
      doctorName: "Dr. Olivia Johnson",
      bookedBy: "Alice Brown",
      bookedOn: "2025-01-03",
      timingOfMeeting: "2025-01-12T16:00:00Z",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      cancelledOn: "2025-01-09",
    },
    {
      typeOfTherapy: "Cognitive Behavioral Therapy",
      doctorName: "Dr. William Lee",
      bookedBy: "Charlie Davis",
      bookedOn: "2025-01-04",
      timingOfMeeting: "2025-01-13T09:00:00Z",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      cancelledOn: "2025-01-10",
    },
    {
      typeOfTherapy: "Humanistic Therapy",
      doctorName: "Dr. Sophia Martinez",
      bookedBy: "Emma Wilson",
      bookedOn: "2025-01-05",
      timingOfMeeting: "2025-01-14T13:30:00Z",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      cancelledOn: "2025-01-11",
    },
  ],
  previous: [
    {
      typeOfTherapy: "Humanistic Therapy",
      doctorName: "Dr. Emily Carter",
      bookedBy: "John Doe",
      bookedOn: "2025-01-01",
      timingOfMeeting: "2025-01-10T10:00:00Z",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      attended: true,
    },
    {
      typeOfTherapy: "Psychodynamic Therapy",
      doctorName: "Dr. Michael Thompson",
      bookedBy: "Jane Smith",
      bookedOn: "2025-01-02",
      timingOfMeeting: "2025-01-11T14:30:00Z",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      attended: false,
    },
    {
      typeOfTherapy: "Behavioral Therapy",
      doctorName: "Dr. Olivia Johnson",
      bookedBy: "Alice Brown",
      bookedOn: "2025-01-03",
      timingOfMeeting: "2025-01-12T16:00:00Z",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      attended: true,
    },
    {
      typeOfTherapy: "Cognitive Behavioral Therapy",
      doctorName: "Dr. William Lee",
      bookedBy: "Charlie Davis",
      bookedOn: "2025-01-04",
      timingOfMeeting: "2025-01-13T09:00:00Z",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      attended: true,
    },
    {
      typeOfTherapy: "Humanistic Therapy",
      doctorName: "Dr. Sophia Martinez",
      bookedBy: "Emma Wilson",
      bookedOn: "2025-01-05",
      timingOfMeeting: "2025-01-14T13:30:00Z",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      attended: false,
    },
  ],
};

type AppointmentContextType = {
  user: User | null;
  authFailed: boolean;
  selectedTherapy: string;
  selectedDoctor: string;
  handleUpdateUserDetailsState: (data: User) => void;
  handleUserSignOut: () => void;
  setSelectedTherapy: (therapy: string) => void;
  setSelectedDoctor: (doctor: string) => void;
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
  const [authFailed, setAuthFailed] = useState<boolean>(true);
  const [selectedTherapy, setSelectedTherapy] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    getUserSession();
  }, []);

  const getUserSession = async () => {
    setAuthFailed(false);
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) {
      console.error("Error fetching session:", error.message);
      setUser(null);
      setAuthFailed(true);
    }
    console.log(data);

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
        selectedTherapy,
        selectedDoctor,
        setSelectedTherapy,
        setSelectedDoctor,
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
