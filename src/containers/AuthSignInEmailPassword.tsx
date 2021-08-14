import FacebookIcon from "@material-ui/icons/Facebook";
import withAuth from "./hoc/withAuth";
import EmailPassword from "./auth/EmailPassword";
import auth from "../utils/auth";
import GoogleIcon from "../components/GoogleIcon";
import { blue, red } from "@material-ui/core/colors";

const AuthSignInEmailPassword = withAuth(
  EmailPassword,
  "signIn",
  auth.signInWithEmailPassword,
  [
    {
      title: "forgotPassword",
      link: "/forgotPassword",
    },
    {
      title: "dontHaveAccount",
      link: "/signUp",
    },
  ],
  [
    {
      title: "signInGoogle",
      color: red,
      icon: GoogleIcon,
      handler: auth.signInWithGoogle,
    },
    {
      title: "signInFacebook",
      color: blue,
      icon: FacebookIcon,
      handler: auth.signInWithFacebook,
    },
  ]
);

export default AuthSignInEmailPassword;
