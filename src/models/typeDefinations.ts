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
  id: string | undefined;
  name: string;
  email: string | undefined;
  providerToken: string | undefined | null;
}
