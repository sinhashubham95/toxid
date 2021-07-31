import firebase from 'firebase';
import { parseFullName } from 'parse-full-name';
import { AuthErrorInfo, AuthInfo, AuthState, UserInfo, Username } from '../types/auth';

class Auth {
  private readonly auth = firebase.auth();
  private readonly googleAuthProvider = new firebase.auth.GoogleAuthProvider();
  private readonly facebookAuthProvider = new firebase.auth.FacebookAuthProvider();

  private readonly userCollection = firebase.firestore().collection("user");

  constructor() {
    this.auth.useDeviceLanguage();
  }

  onAuthStateChange = (handler: (info: AuthInfo) => void) => this.auth.onAuthStateChanged((user) => {
    if (user) {
      // signed in
      (async () => handler(await this.getAuthInfoFromUser(user)))();
    } else {
      // signed out
      handler({
        state: AuthState.SignedOut,
      });
    }
  });

  signInWithEmailPassword = async (email: string, password: string): Promise<AuthInfo> => {
    try {
      return await this.getAuthInfoFromUser((await this.auth.signInWithEmailAndPassword(email, password)).user);
    } catch (e) {
      return this.getAuthInfoFromError(e);
    }
  };

  signUpWithEmailPassword = async (email: string, password: string): Promise<AuthInfo> => {
    try {
      return await this.getAuthInfoFromUser((await this.auth.createUserWithEmailAndPassword(email, password)).user);
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
      return await this.getAuthInfoFromUser((await this.auth.signInWithPopup(this.googleAuthProvider)).user);
    } catch (e) {
      return this.getAuthInfoFromError(e);
    }
  };

  signInWithFacebook = async (): Promise<AuthInfo> => {
    try {
      return await this.getAuthInfoFromUser((await this.auth.signInWithPopup(this.facebookAuthProvider)).user);
    } catch (e) {
      return this.getAuthInfoFromError(e);
    }
  };

  private getName(displayName: string | null): Username {
    const result: Username = {
      firstName: null,
      lastName: null,
    };
    if (displayName) {
      const name = parseFullName(displayName);
      if (name.first && name.middle) {
        result.firstName = `${name.first} ${name.middle}`;
      } else if (name.first) {
        result.firstName = name.first;
      }
      if (name.last) {
        result.lastName = name.last;
      }
    }
    return result;
  }

  private getUserInfo = async (userId: string): Promise<UserInfo | null> => {
    try {
      const userInfo = await this.userCollection.doc(userId).get();
      if (userInfo.exists) {
        const data = userInfo.data();
        if (data) {
          return {
            email: data.email,
            emailVerified: data.emailVerified,
            firstName: data.firstName,
            lastName: data.lastName,
            countryCode: data.countryCode,
            phoneNumber: data.phoneNumber,
            phoneNumberVerified: data.phoneNumberVerified,
            dob: data.dob,
          };
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  private getAuthInfoFromUser = async (user: firebase.User | null): Promise<AuthInfo> => {
    if (user) {
      const userInfo = await this.getUserInfo(user.uid);
      return {
        state: AuthState.SignedIn,
        details: {
          userId: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          ...this.getName(user.displayName),
          countryCode: null,
          phoneNumber: null,
          phoneNumberVerified: false,
          dob: null,
          ...userInfo,
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
