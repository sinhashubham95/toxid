import { FunctionComponent } from 'react';
import {
  Avatar,
  Button,
  Grid,
  Link,
  makeStyles,
  TextField,
  Typography,
  CircularProgress,
  SvgIconTypeMap,
} from '@material-ui/core';
import { LockOutlined } from '@material-ui/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthInfo, AuthProps } from '../../types/auth';
import withButtonColor from '../../components/hoc/withButtonColor';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { ChangeEventHandler } from 'react';

const EmailPassword: FunctionComponent<AuthProps> = ({
  title,
  method,
  extras,
  signInExtras,
  showErrorMessage,
}) => {
  const classes = useStyles();

  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async () => {
    setLoading(true);
    const result: AuthInfo = await method(email, password);
    if (result.error) {
      showErrorMessage(result.error.message);
    }
    setLoading(false);
  };

  const onSignInExtra = (handler: Function) => async () => {
    const result: AuthInfo = await handler();
    if (result.error) {
      showErrorMessage(result.error.message);
    }
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
    autoFocus: boolean,
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

  const renderButtonWithColor = (
    title: string,
    color: { [key: string]: string },
    IconComponent: OverridableComponent<SvgIconTypeMap<{}, "svg">>,
    handler: Function,
  ) => {
    const ColorButton = withButtonColor(color[900], color[900], color["A700"]);
    return (
      <ColorButton
        variant="contained"
        className={classes.extraButton}
        startIcon={<IconComponent />}
        onClick={onSignInExtra(handler)}
      >
        {t(title)}
      </ColorButton>
    );
  };

  const renderSignInExtrasGrid = () => (
    <Grid
      container
      direction="column"
      alignItems="center"
      spacing={1}
      className={classes.signInExtras}
    >
      {signInExtras.map(({ title, color, icon, handler }, index) => (
        <Grid key={title} item xs={index === 0}>
          {renderButtonWithColor(title, color, icon, handler)}
        </Grid>
      ))}
    </Grid>
  );

  const renderForm = () => (
    <form className={classes.form} noValidate>
      {renderTextField("email", "email", email, (event) => setEmail(event.target.value), true)}
      {renderTextField("password", "current-password", password, (event) => setPassword(event.target.value), false)}
      {loading && (
        <CircularProgress />
      )}
      {!loading && renderSubmit()}
      {renderExtrasGrid()}
      {renderSignInExtrasGrid()}
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

const useStyles = makeStyles(theme => ({
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  signInExtras: {
    margin: theme.spacing(4, 0, 0),
  },
  extraButton: {
    margin: theme.spacing(1),
  },
}));

export default EmailPassword;
