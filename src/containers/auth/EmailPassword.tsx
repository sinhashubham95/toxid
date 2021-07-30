import React from 'react';
import { Avatar, Button, Grid, Link, makeStyles, TextField, Typography, CircularProgress } from '@material-ui/core';
import { LockOutlined } from '@material-ui/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const EmailPassword = ({ title, method, extras }) => {
  const classes = useStyles();

  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async () => {
    setLoading(true);
    await method(email, password);
    setLoading(false);
  };

  return (
    <div className={classes.paper}>
      <Avatar className={classes.avatar}>
        <LockOutlined />
      </Avatar>
      <Typography component="h1" variant="h5">
        {t(title)}
      </Typography>
      <form className={classes.form} noValidate>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label={t('email')}
          name="email"
          autoComplete="email"
          value={email}
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label={t('password')}
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
        />
        {loading && (
          <CircularProgress />
        )}
        {!loading && (
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
        )}
        <Grid container>
          {extras.map(({ title, link }) => (
            <Grid item>
              <Link href={link} variant="body2">
                {t(title)}
              </Link>
            </Grid>
          ))}
        </Grid>
      </form>
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
}));

export default EmailPassword;
