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
  image: string;
}

export interface User {
  googleUserId: string;
  name: string;
  email: string | undefined;
  avatarUrl: string | undefined;
  phone: string | null;
  gender: string | null;
  dob: string | null;
}

export interface UserMeta {
  providerToken: string | undefined | null;
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
