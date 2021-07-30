import withAuth from "./hoc/withAuth";
import EmailPassword from './auth/EmailPassword';
import auth from '../utils/auth';

const AuthSignUpEmailPassword = withAuth(
  EmailPassword,
  'signIn',
  auth.signUpWithEmailPassword,
  [
    {
      title: 'alreadyHaveAccount',
      link: '/',
    },
  ]
);

export default AuthSignUpEmailPassword;
