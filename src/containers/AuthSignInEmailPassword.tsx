import withAuth from "./hoc/withAuth";
import EmailPassword from './auth/EmailPassword';
import auth from '../utils/auth';

const AuthSignInEmailPassword = withAuth(
  EmailPassword,
  'signIn',
  auth.signInWithEmailPassword,
  [
    {
      title: 'forgotPassword',
      link: '/forgotPassword',
    },
    {
      title: 'dontHaveAccount',
      link: '/signUp',
    },
  ]
);

export default AuthSignInEmailPassword;
