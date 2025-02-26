export interface therapyType {
  id: string;
  image: string;
  name: string;
  about: string;
}

export interface Doctor {
  id: number;
  therapyId: string;
  name: string;
  email: string;
  avatarUrl: string;
  experience: number;
  specialistIn: string;
  about: string;
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

// TODO: Temporary typedefs for appointment list
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

export interface AppointmentFilterProps {
  filterId: string;
  filterButtonText: string;
}

export interface DateType {
  id: number;
  doctorId: number;
  leaveDates: string[];
}
export interface TimeType {
  id: number;
  doctorId: number;
  availableTimeSlots: string[];
}
