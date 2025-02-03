// src/types/index.ts

export interface UserCredentials {
  userIdentifier: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
  };
}

export interface Profile {
  username: string;
  documents: Array<{ name: string }>;
}
