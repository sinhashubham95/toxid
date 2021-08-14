import withAuth from "./hoc/withAuth";
import ResetEmailPassword from "./auth/ResetEmailPassword";
import auth from "../utils/auth";

const AuthResetEmailPassword = withAuth(
  ResetEmailPassword,
  "resetPassword",
  auth.sendPasswordResetEmail,
  [
    {
      title: "signIn",
      link: "/",
    },
  ],
  []
);

export default AuthResetEmailPassword;
