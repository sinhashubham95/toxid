import { selector } from 'recoil';
import authInfo from '../atoms/authInfo';

const isUserInfoAvailable = selector({
  key: "isUserInfoAvailable",
  get: ({ get }) => {
    const details = get(authInfo).details;
    if (
      details &&
      details.email &&
      details.firstName &&
      details.lastName &&
      details.countryCode &&
      details.phoneNumber &&
      details.dob
    ) {
      return true;
    }
    return false;
  },
});

export default isUserInfoAvailable;
