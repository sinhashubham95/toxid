import firebase from 'firebase';
import { AuthInfo, AuthState } from '../types/auth';

class Auth {
  private readonly auth = firebase.auth();

  onAuthStateChange = (handler: (info: AuthInfo) => void) => this.auth.onAuthStateChanged((user) => {
    if (user) {
      // signed in
      handler({
        state: AuthState.SignedIn,
        details: {
          userId: user.uid,
          displayName: user.displayName,
          email: user.email,
        },
      });
    } else {
      // signed out
      handler({
        state: AuthState.SignedOut,
      });
    }
  });

  signInWithEmailPassword = async (email: string, password: string): Promise<AuthInfo> => {
    try {
      const { user } = await this.auth.signInWithEmailAndPassword(email, password);
      if (user) {
        return {
          state: AuthState.SignedIn,
          details: {
            userId: user.uid,
            displayName: user.displayName,
            email: user.email,
          },
        };
      }
      return {
        state: AuthState.SignedOut,
      };
    } catch (e) {
      return {
        state: AuthState.SignedOut,
        error: {
          code: e.code,
          message: e.message,
        },
      };
    }
  };

  signUpWithEmailPassword = async (email: string, password: string): Promise<AuthInfo> => {
    try {
      const { user } = await this.auth.createUserWithEmailAndPassword(email, password);
      if (user) {
        return {
          state: AuthState.SignedIn,
          details: {
            userId: user.uid,
            displayName: user.displayName,
            email: user.email,
          },
        };
      }
      return {
        state: AuthState.SignedOut,
      };
    } catch (e) {
      return {
        state: AuthState.SignedOut,
        error: {
          code: e.code,
          message: e.message,
        },
      };
    }
  };
}

export default new Auth();
