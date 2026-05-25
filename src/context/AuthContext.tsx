import React, { createContext, useContext } from 'react';

// Hardcoded test IDs — replace this whole block with Firebase Auth when ready.
// To test: create a user doc at users/test-user-1 and a wedding doc at weddings/wedding-1
// in the Firebase Console (see below for the document shapes).
const TEST_USER_ID = 'test-user-1';
const TEST_WEDDING_ID = 'wedding-1';

interface AuthContextValue {
  userId: string;
  weddingId: string;
}

const AuthContext = createContext<AuthContextValue>({
  userId: TEST_USER_ID,
  weddingId: TEST_WEDDING_ID,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider value={{ userId: TEST_USER_ID, weddingId: TEST_WEDDING_ID }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
