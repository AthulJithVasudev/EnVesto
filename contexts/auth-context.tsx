"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { User } from 'firebase/auth'
import { registerUser, signInUser, signOutUser, getCurrentUser, getUserData, UserData } from '@/lib/firebase-auth'
import { ref, update } from 'firebase/database'
import { db } from '@/lib/firebase'

interface AuthContextType {
  user: User | null
  userData: UserData | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, displayName?: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (profileData: Partial<UserData>) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
          const userInfo = await getUserData(currentUser.uid);
          setUserData(userInfo);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const userData = await signInUser(email, password)
      setUserData(userData)
      setUser(await getCurrentUser())
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, displayName?: string) => {
    setIsLoading(true)
    try {
      const userData = await registerUser(email, password, displayName)
      setUserData(userData)
      setUser(await getCurrentUser())
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await signOutUser()
      setUser(null)
      setUserData(null)
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  const updateProfile = async (profileData: Partial<UserData>) => {
    if (user && userData) {
      try {
        const updates = {
          [`/users/${user.uid}`]: {
            ...userData,
            ...profileData
          }
        };
        await update(ref(db), updates);
        setUserData({ ...userData, ...profileData });
      } catch (error) {
        console.error('Profile update error:', error);
        throw error;
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        isAuthenticated,
        login,
        signup,
        logout,
        updateProfile,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
