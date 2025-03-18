import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup, 
    signInWithCredential,
    User
  } from 'firebase/auth';
  import { ref, set, get } from 'firebase/database';
  import { auth, db } from './config';
  
  // Sign in with email and password
  export const signInWithEmail = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error:any) {
      return { user: null, error: error.message };
    }
  };
  
  // Sign up with email and password
  export const signUpWithEmail = async (email: string, password: string, userData: any) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      
      // Save user data in Realtime Database
      await set(ref(db, `users/${userId}`), {
        email,
        ...userData,
        createdAt: new Date().toISOString()
      });
      
      return { user: userCredential.user, error: null };
    } catch (error:any) {
      return { user: null, error: error.message };
    }
  };
  
  // Google sign-in method
  export const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if this is a new user
      const userId = result.user.uid;
      const userRef = ref(db, `users/${userId}`);
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) {
        // New user, save to database
        await set(userRef, {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          createdAt: new Date().toISOString()
        });
      }
      
      return { user: result.user, error: null };
    } catch (error:any) {
      return { user: null, error: error.message };
    }
  };
  
  // Sign out
  export const logOut = async () => {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error:any) {
      return { error: error.message };
    }
  };
  
  // Get current user
  export const getCurrentUser = (): User | null => {
    return auth.currentUser;
  };