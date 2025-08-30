
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "firebase/auth";
import { ref, update } from "firebase/database";
import { db } from "@/lib/firebase";
import {
  registerUser,
  signInUser,
  signOutUser,
  getCurrentUser,
  getUserData,
  UserData,
} from "@/lib/firebase-auth";

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<UserData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Load current user and userData on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        if (currentUser) {
          const data = await getUserData(currentUser.uid);
          setUserData(data);
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  // LOGIN
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signInUser(email, password);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        const data = await getUserData(currentUser.uid);
        setUserData(data);
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // SIGNUP
  const signup = async (email: string, password: string, displayName?: string) => {
    setIsLoading(true);
    try {
      await registerUser(email, password, displayName);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        const newUserData: UserData = {
          uid: currentUser.uid,
          email: currentUser.email || email,
          displayName: displayName || email.split("@")[0],
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };
        await update(ref(db), { [`/users/${currentUser.uid}`]: newUserData });
        setUserData(newUserData);
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await signOutUser();
      setUser(null);
      setUserData(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  // UPDATE PROFILE
  const updateProfile = async (profileData: Partial<UserData>) => {
    let currentUser = user;
    if (!currentUser) {
      currentUser = await getCurrentUser();
      if (!currentUser) throw new Error("No user");
      setUser(currentUser);
    }
    try {
      const baseData = userData || {
        uid: currentUser.uid,
        email: currentUser.email || "",
        displayName: currentUser.displayName || currentUser.email?.split("@") [0] || "",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      const updatedUser = { ...baseData, ...profileData };
      await update(ref(db), { [`/users/${currentUser.uid}`]: updatedUser });
      setUserData(updatedUser);
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
