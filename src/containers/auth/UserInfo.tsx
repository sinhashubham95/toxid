import { ChangeEventHandler, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { Avatar, Container, CssBaseline, IconButton, makeStyles, Snackbar } from "@material-ui/core";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Alert from '@material-ui/lab/Alert';

import authInfo from "../../recoil/atoms/auth/authInfo";
import auth from '../../utils/auth';
import storage from '../../utils/storage';
import { BasicInfo } from '../../types/auth';
import { SnackInfo, SnackState } from '../../types/common';
import { PROFILE_PHOTO } from '../../constants/constants';

const UserInfo = () => {
  const classes = useStyles();

  const { t } = useTranslation();

  const [info] = useRecoilState(authInfo);
  const [basicInfo, setBasicInfo] = useState<BasicInfo>(auth.getBasicInfo(info.details));

  const [snack, setSnack] = useState<SnackInfo | null>(null);

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { files } = event.target;
    if (files && files.length > 0) {
      // use the first selected file
      const file = files[0];
      // try to upload this file
      uploadFile(file);
    }
  };

  const onCloseSnack = () => setSnack(null);

  const showSuccessMessage = (message: string) => setSnack({
    state: SnackState.Success,
    message,
  });

  const showErrorMessage = (message: string) => setSnack({
    state: SnackState.Error,
    message,
  });

  const uploadFile = async (file: File) => {
    const result = await storage.uploadFile(PROFILE_PHOTO, file);
    if (result.error) {
      // some error occurred
      showErrorMessage(result.error.message);
      return;
    }
    if (result.downloadUrl) {
      setBasicInfo({
        ...basicInfo,
        photoUrl: result.downloadUrl,
      });
      showSuccessMessage(t('profilePhotoUpload'));
    }
  };

  const renderAvatar = () => (
    <div>
      <input
        accept="image/*"
        id="profile-photo"
        type="file"
        onChange={onFileChange}
        className={classes.avatarInput}
      />
      <label htmlFor="profile-photo">
        <IconButton aria-label="Upload profile photo" component="span">
          <Avatar
            className={classes.avatar}
            src={basicInfo.photoUrl}
          >
            <AccountCircleIcon fontSize="large" />
          </Avatar>
        </IconButton>
      </label>
    </div>
  );

  const renderSnackbar = () => (
    <Snackbar open={!!snack} autoHideDuration={6000} onClose={onCloseSnack}>
      <Alert elevation={6} variant="filled" severity={snack?.state} onClose={onCloseSnack}>
        {snack?.message}
      </Alert>
    </Snackbar>
  );

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {renderAvatar()}
      </div>
      {renderSnackbar()}
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatarInput: {
    display: 'none',
  },
  avatar: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default UserInfo;
