import { createContext} from 'react';

type User = {
  id: string;
  name: string;
};

export interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
