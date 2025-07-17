import { createContext} from 'react';

export type User = {
  id: string;
  name: string;
  email:string;
  authToken:string;
};

export interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
