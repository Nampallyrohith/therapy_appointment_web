export interface therapyType {
  id: number;
  image: string;
  name: string;
  about: string;
}

export interface TherapistType {
  id: number;
  therapyId: number;
  name: string;
  experience: string;
  specialist: string;
  about: string;
}

export interface User {
  id: string;
  name: string;
  email: string | undefined;
  providerToken: string | undefined | null;
  avatarUrl: string | null;
  phone: string | null;
  gender: string | null;
  dob: string | null;
  createdAt: string;
  lastSignInAt: string | undefined;
  expiresAt: number | undefined;
  refreshToken: string | undefined;
  accessToken: string | undefined;
}


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

export interface FilterProps {
  filterId: string;
  filterButtonText: string;
}
