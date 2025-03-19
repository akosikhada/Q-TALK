import { ref, set, get, update, remove, push, child, onValue, off, serverTimestamp } from 'firebase/database';
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

// User status functions
export const setUserOnline = async (userId: string) => {
  try {
    const userRef = ref(db, `users/${userId}`);
    await update(userRef, {
      status: "Online",
      lastActive: serverTimestamp()
    });
    return { success: true, error: null };
  } catch (error:any) {
    console.error("Error setting user online:", error);
    return { success: false, error: error.message };
  }
};

export const setUserOffline = async (userId: string) => {
  try {
    const userRef = ref(db, `users/${userId}`);
    await update(userRef, {
      status: "Offline",
      lastActive: serverTimestamp()
    });
    return { success: true, error: null };
  } catch (error:any) {
    console.error("Error setting user offline:", error);
    return { success: false, error: error.message };
  }
};

export const setUserStatus = async (userId: string, status: string) => {
  try {
    const userRef = ref(db, `users/${userId}`);
    await update(userRef, {
      status: status,
      lastActive: serverTimestamp()
    });
    return { success: true, error: null };
  } catch (error:any) {
    console.error(`Error setting user status to ${status}:`, error);
    return { success: false, error: error.message };
  }
};

// Setup presence system
export const setupPresenceSystem = (userId: string) => {
  if (!userId) return () => {};
  
  // Create a reference to the user's status
  const userStatusRef = ref(db, `users/${userId}`);
  
  // Initial status setup
  setUserOnline(userId);
  
  // Create a function to update status on app state change
  const updateStatusOnAppStateChange = (appState: string) => {
    if (appState === 'active') {
      setUserOnline(userId);
    } else if (appState === 'background' || appState === 'inactive') {
      setUserOffline(userId);
    }
  };
  
  // Return cleanup function
  return () => {
    setUserOffline(userId);
  };
};

export const fetchMessages = (conversationId: string, callback: (messages: any[]) => void) => {
  const messagesRef = ref(db, `conversations/${conversationId}/messages`);

  const handleData = (snapshot: any) => {
    const messagesData = snapshot.val();
    if (messagesData) {
      const messagesArray = Object.keys(messagesData).map((key) => ({
        id: key,
        ...messagesData[key],
      }));

      // ✅ Sort messages by timestamp (oldest to newest)
      messagesArray.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

      callback(messagesArray);
    } else {
      callback([]); // No messages
    }
  };

  const unsubscribe = onValue(messagesRef, handleData);

  return () => {
    off(messagesRef, "value", handleData);
  };
};

export const saveMessage = (conversationId: string, message: any) => {
  const messagesRef = ref(db, `conversations/${conversationId}/messages`);
  const conversationRef = ref(db, `conversations/${conversationId}`);

  const newMessageRef = push(messagesRef);
  const timestamp = Date.now();

  const messageData = {
    ...message,
    timestamp,
  };

  return set(newMessageRef, messageData)
    .then(() => {
      console.log("Message saved successfully");

      return update(conversationRef, {
        lastMessage: message.text, 
        timestamp: timestamp, 
      });
    })
    .then(() => {
      console.log("Last message updated successfully");
      return true;
    })
    .catch((error) => {
      console.error("Error saving message or updating last message:", error);
      return false;
    });
};
