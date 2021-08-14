import { selector } from "recoil";
import { AuthState } from "../../../types/auth";
import authInfo from "../../atoms/auth/authInfo";

const isSignedIn = selector({
  key: "isSignedIn",
  get: ({ get }) => get(authInfo).state === AuthState.SignedIn,
});

export default isSignedIn;
