export interface therapyType {
  id: string;
  image: string;
  name: string;
  about: string;
}

export interface TherapistType {
  id: string;
  name: string;
  experience: string;
  specialist: string;
  specialisationId: string
  about: string;
  image: string;
}
export interface Doctor {
  id: number;
  therapyId: string;
  name: string;
  email: string;
  avatarUrl: string;
  experience: number;
  specialistIn: string;
  about: string
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
