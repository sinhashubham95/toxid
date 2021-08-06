import { MouseEvent, useState } from "react";
import { useRecoilState } from 'recoil';
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { makeStyles, Menu, MenuItem } from "@material-ui/core";
import authInfo from '../recoil/atoms/auth/authInfo';
import auth from "../utils/auth";
import { CommonProps } from "../types/common";
import { BASIC_INFO } from "../constants/routes";
import ProfilePhoto from "../components/ProfilePhoto";

const Profile = ({
  showErrorMessage,
}: CommonProps) => {
  const classes = useStyles();

  const { t } = useTranslation();
  const history = useHistory();
  const [info] = useRecoilState(authInfo);

  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const onClick = (event: MouseEvent<HTMLButtonElement>) => setAnchor(event.currentTarget);

  const onClose = () => setAnchor(null);

  const onSignOut = async () => {
    const error = await auth.signOut();
    if (error) {
      // show error message
      showErrorMessage(error.message);
    }
  };

  const renderProfilePhoto = () => (
    <ProfilePhoto
      id="profile-photo"
      photoUrl={info.details?.photoUrl}
      onClick={onClick}
    />
  );

  const renderProfilePopover = () => (
    <Menu
      id="profile-photo"
      open={!!anchor}
      anchorEl={anchor}
      onClose={onClose}
    >
      <MenuItem onClick={() => history.replace(`${BASIC_INFO}/false`)}>
        {t("manageAccount")}
      </MenuItem>
      <MenuItem onClick={onSignOut}>{t("signOut")}</MenuItem>
    </Menu>
  );

  return (
    <div className={classes.root}>
      {renderProfilePhoto()}
      {renderProfilePopover()}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(0, 2, 0),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default Profile;
