/**
 * LernDeutsch AI - Auth Context Definition
 */

import { createContext } from "react";
import type { AuthState } from "../types";

export interface AuthContextType extends AuthState {
    signIn: (
        email: string,
        password: string,
    ) => Promise<{ success: boolean; error?: string }>;
    signUp: (
        email: string,
        password: string,
        displayName?: string,
    ) => Promise<{ success: boolean; error?: string }>;
    signOut: () => Promise<void>;
    resetPassword: (
        email: string,
    ) => Promise<{ success: boolean; error?: string }>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
