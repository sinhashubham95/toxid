import firebase from 'firebase';
import { parseFullName } from 'parse-full-name';
import { PROFILE_PHOTO } from '../constants/constants';
import { COUNTRIES } from '../constants/countries';
import {
  AuthDetails,
  AuthErrorInfo,
  AuthInfo,
  AuthState,
  UserInfo,
  Username,
  BasicInfo,
} from '../types/auth';
import storage from './storage';

class Auth {
  private readonly auth = firebase.auth();
  private readonly googleAuthProvider = new firebase.auth.GoogleAuthProvider();
  private readonly facebookAuthProvider = new firebase.auth.FacebookAuthProvider();

  private readonly userCollection = firebase.firestore().collection("user");

  constructor() {
    this.auth.useDeviceLanguage();
    this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  }

  onAuthStateChange = (handler: (authInfo: AuthInfo) => void) => this.auth.onAuthStateChanged((user) => {
    if (user) {
      (async () => handler(await this.getAuthInfoFromUser(user)))();
    } else {
      handler({
        state: AuthState.SignedOut,
      });
    }
  });

  signOut = async (): Promise<AuthErrorInfo | null> => {
    try {
      await this.auth.signOut();
      return null;
    } catch (e) {
      return {
        code: e.code,
        message: e.message,
      };
    }
  };

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

  getBasicInfo = (details?: AuthDetails): BasicInfo => ({
    email: details?.email ? details.email : '',
    emailVerified: details?.emailVerified ? details.emailVerified : false,
    firstName: details?.firstName ? details.firstName : '',
    lastName: details?.lastName ? details.lastName : '',
    photoUrl: details?.photoUrl ? details.photoUrl : '',
    country: details?.country ? details.country : COUNTRIES[0],
    phoneNumber: details?.phoneNumber ? details.phoneNumber : '',
    phoneNumberVerified: details?.phoneNumberVerified ? details.phoneNumberVerified : false,
    dob: details?.dob ? details.dob : new Date(),
  });

  saveBasicInfo = async (userId?: string, info?: BasicInfo): Promise<AuthErrorInfo | null> => {
    try {
      if (userId && info) {
        // save in the database
        await this.userCollection.doc(userId).set({
          ...info,
          dob: info.dob.getTime(),
          countryCode: info.country.code,
        });
        // also update in the authentication information
        if (this.auth.currentUser?.email !== info.email) {
          await this.auth.currentUser?.updateEmail(info.email);
        }
        const fullName = this.getFullName(info.firstName, info.lastName);
        if (this.auth.currentUser?.displayName !== fullName) {
          await this.auth.currentUser?.updateProfile({
            displayName: fullName,
          });
        }
      }
      return null;
    } catch (e) {
      return {
        code: e.code,
        message: e.message,
      };
    }
  };

  countryToFlag = (isoCode: string): string => {
    return typeof String.fromCodePoint !== 'undefined'
      ? isoCode
        .toUpperCase()
        .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
      : isoCode;
  }

  private getUsername(displayName: string | null): Username {
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

  private getFullName = (firstName: string, lastName: string): string => `${firstName} ${lastName}`;

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
            photoUrl: await storage.getUrl(`${userId}-${PROFILE_PHOTO}`),
            country: COUNTRIES[data.countryCode],
            phoneNumber: data.phoneNumber,
            phoneNumberVerified: data.phoneNumberVerified,
            dob: data.dob ? new Date(data.dob) : new Date(),
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
          ...this.getUsername(user.displayName),
          photoUrl: user.photoURL,
          country: null,
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
