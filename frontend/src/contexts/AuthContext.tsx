import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  getCurrentUser, 
  signIn, 
  signOut, 
  signUp,
  confirmSignUp,
  fetchAuthSession,
  resetPassword,
  confirmResetPassword,
  signInWithRedirect,
  AuthUser
} from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ isSignUpComplete: boolean; nextStep: unknown }>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
  getAccessToken: () => Promise<string | undefined>;
  // パスワードリセット機能
  resetPassword: (email: string) => Promise<void>;
  confirmResetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  // SSO機能
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();

    // Amplify Hubでの認証イベントリスナー
    const hubListener = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          checkUser();
          break;
        case 'signedOut':
          setUser(null);
          break;
      }
    });

    return () => hubListener();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignIn(email: string, password: string) {
    const result = await signIn({ username: email, password });
    if (result.isSignedIn) {
      await checkUser();
    }
  }

  async function handleSignUp(email: string, password: string, displayName: string) {
    const result = await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          name: displayName,
        },
      },
    });
    return result;
  }

  async function handleConfirmSignUp(email: string, code: string) {
    await confirmSignUp({ username: email, confirmationCode: code });
  }

  async function handleSignOut() {
    await signOut();
    setUser(null);
  }

  async function getAccessToken() {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.accessToken?.toString();
    } catch {
      return undefined;
    }
  }

  // パスワードリセットをリクエスト
  async function handleResetPassword(email: string) {
    await resetPassword({ username: email });
  }

  // パスワードリセットを確認
  async function handleConfirmResetPassword(email: string, code: string, newPassword: string) {
    await confirmResetPassword({
      username: email,
      confirmationCode: code,
      newPassword,
    });
  }

  // Google SSOでサインイン
  async function handleSignInWithGoogle() {
    await signInWithRedirect({ provider: 'Google' });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn: handleSignIn,
        signUp: handleSignUp,
        confirmSignUp: handleConfirmSignUp,
        signOut: handleSignOut,
        getAccessToken,
        resetPassword: handleResetPassword,
        confirmResetPassword: handleConfirmResetPassword,
        signInWithGoogle: handleSignInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
