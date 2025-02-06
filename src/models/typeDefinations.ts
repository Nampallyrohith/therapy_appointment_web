export interface therapyType {
  id: string;
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
  id: string | undefined;
  name: string;
  email: string | undefined;
  providerToken: string | undefined | null;
  avatarUrl: string | null;
  phone: string | null;
  gender: string | null;
  dob: string | null;
  createdAt: string;
  lastSignInAt: string | undefined;
}
