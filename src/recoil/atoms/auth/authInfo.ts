import { atom } from "recoil";
import { AuthInfo, AuthState } from "../../../types/auth";

const authInfo = atom<AuthInfo>({
  key: "authInfo",
  default: {
    state: AuthState.SignedOut,
  },
});

export default authInfo;
