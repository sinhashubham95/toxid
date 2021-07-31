import firebase from 'firebase';
import { AuthErrorInfo, AuthInfo, AuthState } from '../types/auth';

class Auth {
  private readonly auth = firebase.auth();
  private readonly googleAuthProvider = new firebase.auth.GoogleAuthProvider();
  private readonly facebookAuthProvider = new firebase.auth.FacebookAuthProvider();

  constructor() {
    this.auth.useDeviceLanguage();
  }

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
      return this.getAuthInfoFromUser(await this.auth.signInWithEmailAndPassword(email, password));
    } catch (e) {
      return this.getAuthInfoFromError(e);
    }
  };

  signUpWithEmailPassword = async (email: string, password: string): Promise<AuthInfo> => {
    try {
      return this.getAuthInfoFromUser(await this.auth.createUserWithEmailAndPassword(email, password));
    } catch (e) {
      return this.getAuthInfoFromError(e);
    }
  };

  sendPasswordResetEmail = async (email: string): Promise<AuthErrorInfo | null> => {
    try {
      await this.auth.sendPasswordResetEmail(email);
      return null;
    } catch (e) {
      return {
        code: e.code,
        message: e.message,
      };
    }
  };

  signInWithGoogle = async (): Promise<AuthInfo> => {
    try {
      return this.getAuthInfoFromUser(await this.auth.signInWithPopup(this.googleAuthProvider));
    } catch (e) {
      return this.getAuthInfoFromError(e);
    }
  };

  signInWithFacebook = async (): Promise<AuthInfo> => {
    try {
      return this.getAuthInfoFromUser(await this.auth.signInWithPopup(this.facebookAuthProvider));
    } catch (e) {
      return this.getAuthInfoFromError(e);
    }
  };

  private getAuthInfoFromUser(credential: firebase.auth.UserCredential): AuthInfo {
    const { user } = credential;
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
  }

  private getAuthInfoFromError(e: AuthErrorInfo): AuthInfo {
    return {
      state: AuthState.SignedOut,
      error: {
        code: e.code,
        message: e.message,
      },
    };
  }
}

export default new Auth();
