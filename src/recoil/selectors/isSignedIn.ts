import { selector } from 'recoil';
import authInfo from '../atoms/authInfo';

const isSignedIn = selector({
  key: "isSignedIn",
  get: ({ get }) => get(authInfo).state,
});

export default isSignedIn;
