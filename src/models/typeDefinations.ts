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
export type Status = "upcoming" | "cancelled" | "previous";

export interface BaseUpcoming {
  id: number;
  userId: string;
  doctorId: number;
  eventId: string;
  summary: string;
  description: string;
  startTime: string;
  endTime: string;
  timeZone: string;
  hangoutLink: string;
  status: Status;
  createdAt: string;
  typeOfTherapy: string;
  doctorName: string;
}

export interface Cancelled extends BaseUpcoming {
  cancelledOn: string;
}

export interface Previous extends BaseUpcoming {
  attended: boolean;
}

export type Appointment = BaseUpcoming | Cancelled | Previous;

export interface AppointmentFilterProps {
  filterId: string;
  filterButtonText: string;
}

export interface DateTimeType {
  id: number;
  doctorId: number;
  leaveDates: string[];
  availableTime: null;
}
