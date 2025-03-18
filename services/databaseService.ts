import { ref, set, get, update, remove, push, child, onValue, off } from 'firebase/database';
import { db } from './config';

// Create data
export const createData = async (path: string, data: any) => {
  try {
    const reference = ref(db, path);
    await set(reference, data);
    return { success: true, error: null };
  } catch (error:any) {
    return { success: false, error: error.message };
  }
};

// Create data with auto-generated key
export const createDataWithId = async (path: string, data: any) => {
  try {
    const reference = ref(db, path);
    const newRef = push(reference);
    await set(newRef, data);
    return { id: newRef.key, success: true, error: null };
  } catch (error:any) {
    return { id: null, success: false, error: error.message };
  }
};

// Read data once
export const getData = async (path: string) => {
  try {
    const reference = ref(db, path);
    const snapshot = await get(reference);
    
    if (snapshot.exists()) {
      return { data: snapshot.val(), exists: true, error: null };
    } else {
      return { data: null, exists: false, error: null };
    }
  } catch (error:any) {
    return { data: null, exists: false, error: error.message };
  }
};

// Update data
export const updateData = async (path: string, data: any) => {
  try {
    const reference = ref(db, path);
    await update(reference, data);
    return { success: true, error: null };
  } catch (error:any) {
    return { success: false, error: error.message };
  }
};

// Delete data
export const deleteData = async (path: string) => {
  try {
    const reference = ref(db, path);
    await remove(reference);
    return { success: true, error: null };
  } catch (error:any) {
    return { success: false, error: error.message };
  }
};

// Listen to real-time updates
export const subscribeToData = (path: string, callback: (data: any) => void) => {
  const reference = ref(db, path);
  onValue(reference, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
  
  // Return function to unsubscribe
  return () => off(reference);
};