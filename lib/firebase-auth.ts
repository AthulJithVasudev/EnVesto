import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth';
import {
  ref,
  set,
  get,
  update
} from 'firebase/database';
import { auth, db } from './firebase';

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  createdAt: string;
  lastLogin: string;
  phone?: string;
  job?: string;
  state?: string;
  avgMonthlyIncome?: number;
  age?: number;
  name?: string;
}

// -------------------- REGISTER --------------------
export const registerUser = async (email: string, password: string, displayName?: string): Promise<UserData> => {
  try {
    if (!email || !password) throw new Error('Email and password are required');
    if (password.length < 6) throw new Error('Password must be at least 6 characters long');

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userData: UserData = {
      uid: user.uid,
      email: user.email!,
      displayName: displayName || user.email!.split('@')[0],
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    // Fire-and-forget save
    set(ref(db, `users/${user.uid}`), userData).catch((err) => {
      console.error('Failed to save user profile to Realtime Database:', err)
    });

    return userData;
  } catch (error: any) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        throw new Error('An account with this email already exists. Please log in instead.');
      case 'auth/invalid-email':
        throw new Error('Invalid email format. Please enter a valid email address.');
      case 'auth/operation-not-allowed':
        throw new Error('Email/password accounts are not enabled. Please contact support.');
      case 'auth/weak-password':
        throw new Error('Password is too weak. Please choose a stronger password.');
      case 'auth/network-request-failed':
        throw new Error('Network error. Please check your internet connection.');
      default:
        console.error('Registration error:', error);
        throw new Error('An error occurred during registration. Please try again.');
    }
  }
};

// -------------------- GET USER DATA --------------------
export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const snapshot = await get(ref(db, `users/${uid}`));
    return snapshot.exists() ? (snapshot.val() as UserData) : null;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// -------------------- UPDATE USER PROFILE --------------------
export const updateUserProfile = async (uid: string, data: Partial<UserData>) => {
  try {
    const userRef = ref(db, `users/${uid}`);
    await update(userRef, data);
  } catch (error: any) {
    console.error("Failed to update user profile:", error);
    throw new Error(error.message || "Failed to update user profile");
  }
};

// -------------------- SIGN IN --------------------
export const signInUser = async (email: string, password: string): Promise<UserData> => {
  try {
    if (!email || !password) throw new Error('Email and password are required');

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update last login
    await update(ref(db), { [`/users/${user.uid}/lastLogin`]: new Date().toISOString() });

    const userData = await getUserData(user.uid);
    if (!userData) throw new Error('User data not found');

    return userData;
  } catch (error: any) {
    switch (error.code) {
      case 'auth/invalid-credential':
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      case 'auth/user-not-found':
        throw new Error('No account exists with this email. Please sign up first.');
      case 'auth/wrong-password':
        throw new Error('Incorrect password. Please try again.');
      case 'auth/invalid-email':
        throw new Error('Invalid email format. Please enter a valid email address.');
      case 'auth/user-disabled':
        throw new Error('This account has been disabled. Please contact support.');
      case 'auth/too-many-requests':
        throw new Error('Too many failed login attempts. Please try again later.');
      default:
        console.error('Login error:', error);
        throw new Error('An error occurred during login. Please try again.');
    }
  }
};

// -------------------- SIGN OUT --------------------
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// -------------------- GET CURRENT USER --------------------
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};
