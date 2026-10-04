import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { jwtDecode } from "jwt-decode";

import {
  getToken,
  getUserId,
  removeToken,
  removeUserId,
  saveToken,
  saveUserId,
} from "../services/authStorage";

interface JwtPayload {
  userId: number;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  userId: number | null;
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

  const [userId, setUserId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token;

  // =========================
  // RESTORE AUTH
  // =========================

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const savedToken = await getToken();
      const savedUserId = await getUserId();

      console.log("=================================");

      console.log("RESTORED TOKEN:", !!savedToken);

      console.log("RESTORED USER ID:", savedUserId);

      console.log("=================================");

      if (savedToken) {
        setToken(savedToken);
      }

      if (savedUserId) {
        setUserId(savedUserId);
      }
    } catch (error) {
      console.error("AUTH CHECK ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGIN
  // =========================

  const login = async (newToken: string, newUser?: User) => {
    try {
      console.log("=================================");

      console.log("LOGIN START");

      await saveToken(newToken);

      // Decode JWT
      const decoded = jwtDecode<JwtPayload>(newToken);

      console.log("DECODED JWT:", decoded);

      const extractedUserId = Number(decoded.userId);

      if (!Number.isInteger(extractedUserId) || extractedUserId <= 0) {
        throw new Error("Invalid userId inside JWT");
      }

      // Save userId
      await saveUserId(extractedUserId);

      // Update state
      setToken(newToken);

      setUserId(extractedUserId);

      if (newUser) {
        setUser(newUser);
      } else {
        setUser({
          id: extractedUserId,
          name: "",
          email: decoded.email ?? "",
          role: decoded.role,
        });
      }

      console.log("LOGIN SUCCESS");

      console.log("USER ID:", extractedUserId);

      console.log("=================================");
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      throw error;
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = async () => {
    try {
      await removeToken();
      await removeUserId();

      setToken(null);
      setUser(null);
      setUserId(null);

      console.log("LOGOUT SUCCESS");
    } catch (error) {
      console.error("LOGOUT ERROR:", error);

      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        userId,
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
