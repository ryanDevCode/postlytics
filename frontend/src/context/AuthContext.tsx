import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../api/axios';

interface User {
    id: number;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (data: any) => Promise<void>;
    signup: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (data: any) => {
        try {
            const response = await api.post('/users/sign_in', { user: data });
            const { user: userData } = response.data;
            const authToken = response.headers['authorization']?.split(' ')[1]; // Extract token from Bearer string

            if (authToken) {
                setToken(authToken);
                setUser(userData);
                localStorage.setItem('token', authToken);
                localStorage.setItem('user', JSON.stringify(userData));
            } else {
                // Fallback if token is not in header (depends on devise-jwt config, usually in Authorization header)
                console.error("Token not found in response headers");
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const signup = async (data: any) => {
        try {
            const response = await api.post('/users', { user: data });
            const { user: userData } = response.data;
            // Depending on Devise configuration, signup might sign the user in automatically.
            // If it sends a token, we should store it.
            const authToken = response.headers['authorization']?.split(' ')[1];

            if (authToken) {
                setToken(authToken);
                setUser(userData);
                localStorage.setItem('token', authToken);
                localStorage.setItem('user', JSON.stringify(userData));
            }
        } catch (error) {
            console.error('Signup failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.delete('/users/sign_out');
        } catch (error) {
            console.error('Logout failed:', error);
            // We logout client-side anyway
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    };

    const value = {
        user,
        token,
        login,
        signup,
        logout,
        isAuthenticated: !!token,
        loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
