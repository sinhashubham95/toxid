import { selector } from 'recoil';
import authInfo from '../../atoms/auth/authInfo';

const isMandatoryUserInfoAvailable = selector({
  key: "isUserInfoAvailable",
  get: ({ get }) => {
    const details = get(authInfo).details;
    if (
      details &&
      details.email &&
      details.firstName &&
      details.lastName &&
      details.country &&
      details.phoneNumber &&
      details.dob
    ) {
      return true;
    }
    return false;
  },
});

export default isMandatoryUserInfoAvailable;
