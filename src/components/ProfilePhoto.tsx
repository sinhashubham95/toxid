import { makeStyles, IconButton, Avatar } from "@material-ui/core";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import clsx from "clsx";
import { ChangeEventHandler } from "react";
import { ProfilePhotoProps } from "../types/common";

const ProfilePhoto = ({ onFileChange, onClick, photoUrl, avatarStyle }: ProfilePhotoProps) => {
  const classes = useStyles();

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { files } = event.target;
    if (files && files.length > 0 && onFileChange) {
      // use the first selected file
      const file = files[0];
      // notify about the new file
      onFileChange(file);
    }
  };

  const renderInput = () => (
    <input
      accept="image/*"
      id="profile-photo"
      type="file"
      onChange={onInputChange}
      className={classes.avatarInput}
    />
  );

  return (
    <div>
      {onFileChange && renderInput()}
      <label htmlFor="profile-photo">
        <IconButton
          aria-label="Upload profile photo"
          component="span"
          disabled={!onClick && !onFileChange}
          onClick={onClick}
        >
          <Avatar
            className={clsx(classes.avatar, avatarStyle)}
            src={photoUrl ? photoUrl : ""}
          >
            <AccountCircleIcon fontSize="large" />
          </Avatar>
        </IconButton>
      </label>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  avatarInput: {
    display: 'none',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default ProfilePhoto;
