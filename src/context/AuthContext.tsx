import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

import { getToken, removeToken, saveToken } from "../services/authStorage";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user?: User) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token;

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const savedToken = await getToken();

      if (savedToken) {
        setToken(savedToken);
      }
    } catch (error) {
      console.error("AUTH CHECK ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (newToken: string, newUser?: User) => {
    await saveToken(newToken);

    setToken(newToken);

    if (newUser) {
      setUser(newUser);
    }
  };

  const logout = async () => {
    await removeToken();

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
