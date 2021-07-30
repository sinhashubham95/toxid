import firebase from 'firebase';

class Auth {
  auth = firebase.auth();

  onAuthStateChange = (handler) => this.auth.onAuthStateChanged((user) => {
    if (user) {
      // signed in
    } else {
      // signed out
    }
  });
}

export default new Auth();
