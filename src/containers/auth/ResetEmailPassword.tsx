import { FunctionComponent, ChangeEventHandler } from "react";
import {
  Avatar,
  Button,
  Grid,
  Link,
  makeStyles,
  TextField,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { LockOutlined } from "@material-ui/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthErrorInfo, AuthProps } from "../../types/auth";

const ResetEmailPassword: FunctionComponent<AuthProps> = ({
  title,
  method,
  extras,
  showSuccessMessage,
  showErrorMessage,
}) => {
  const classes = useStyles();

  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const onSubmit = async () => {
    setLoading(true);
    const error: AuthErrorInfo = await method(email);
    if (error) {
      showErrorMessage(error.message);
    } else {
      showSuccessMessage(t("successReset"));
    }
    setLoading(false);
  };

  const renderHeaderIcon = () => (
    <Avatar className={classes.avatar}>
      <LockOutlined />
    </Avatar>
  );

  const renderHeader = () => (
    <Typography component="h1" variant="h5">
      {t(title)}
    </Typography>
  );

  const renderTextField = (
    key: string,
    autoComplete: string,
    value: string,
    onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>,
    autoFocus: boolean
  ) => (
    <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      id={key}
      label={t(key)}
      name={key}
      autoComplete={autoComplete}
      value={email}
      onChange={onChange}
      autoFocus={autoFocus}
    />
  );

  const renderLoading = () => (
    <Grid
      container
      justifyContent="center"
      alignContent="center"
      alignItems="center"
      className={classes.loading}
    >
      <CircularProgress color="secondary" />
    </Grid>
  );

  const renderSubmit = () => (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      color="primary"
      className={classes.submit}
      onClick={onSubmit}
    >
      {t(title)}
    </Button>
  );

  const renderExtrasGrid = () => (
    <Grid container>
      {extras.map(({ title, link }, index) => (
        <Grid key={title} item xs={index === 0}>
          <Link href={link} variant="body2">
            {t(title)}
          </Link>
        </Grid>
      ))}
    </Grid>
  );

  const renderForm = () => (
    <form className={classes.form} noValidate>
      {renderTextField(
        "email",
        "email",
        email,
        (event) => setEmail(event.target.value),
        true
      )}
      {loading && renderLoading()}
      {!loading && renderSubmit()}
      {renderExtrasGrid()}
    </form>
  );

  return (
    <div className={classes.paper}>
      {renderHeaderIcon()}
      {renderHeader()}
      {renderForm()}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  loading: {
    margin: theme.spacing(2, 0, 2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default ResetEmailPassword;
