import {
  ChangeEvent,
  ChangeEventHandler,
  Fragment,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  GridSize,
  makeStyles,
  TextField,
  TextFieldProps,
} from "@material-ui/core";
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

import ProfilePhoto from '../../components/ProfilePhoto';
import authInfo from "../../recoil/atoms/auth/authInfo";
import auth from '../../utils/auth';
import storage from '../../utils/storage';
import { BasicInfo, Country } from '../../types/auth';
import { CommonProps } from '../../types/common';
import { PROFILE_PHOTO } from '../../constants/constants';
import { COUNTRIES } from '../../constants/countries';
import isMandatoryUserInfoAvailableSelector from '../../recoil/selectors/auth/isMandatoryUserInfoAvailable';
import { HOME } from '../../constants/routes';

const UserInfo = ({ showErrorMessage }: CommonProps) => {
  const classes = useStyles();

  const { init } = useParams<{ init: string }>();

  const { t } = useTranslation();
  const history = useHistory();

  const isMandatoryUserInfoAvailable = useRecoilValue(isMandatoryUserInfoAvailableSelector);

  const [info, setInfo] = useRecoilState(authInfo);
  const [basicInfo, setBasicInfo] = useState<BasicInfo>(auth.getBasicInfo(info.details));

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isMandatoryUserInfoAvailable && JSON.parse(init)) {
      history.replace(HOME);
    }
  }, [isMandatoryUserInfoAvailable, init, history]);

  const onFileChange = (file: File) => {
    // try to upload this file
    uploadFile(file);
  };

  const onChange = (key: string): ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> => (event) => setBasicInfo({
    ...basicInfo,
    [key]: event.target.value,
  });

  const onDOBChange = (date: Date | null) => {
    if (date) {
      setBasicInfo({
        ...basicInfo,
        dob: date,
      });
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    const error = await auth.saveBasicInfo(info.details?.userId, basicInfo);
    if (error) {
      showErrorMessage(error.message);
    } else if (info.details) {
      // update in auth info
      setInfo({
        ...info,
        details: {
          userId: info.details.userId,
          ...basicInfo,
        },
      });
    }
    setLoading(false);
  };

  const onSkip = () => history.replace(HOME);

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
    }
  };

  const renderAvatar = () => (
    <ProfilePhoto
      onFileChange={onFileChange}
      photoUrl={basicInfo.photoUrl}
      avatarStyle={classes.avatar}
    />
  );

  const renderTextField = (xs?: boolean | GridSize, sm?: boolean | GridSize) => (
    autoComplete: string,
    name: string,
    value: string,
    props?: TextFieldProps,
  ) => (
    <Grid item xs={xs} sm={sm}>
      <TextField
        autoComplete={autoComplete}
        name={name}
        variant="outlined"
        required
        fullWidth
        id={name}
        label={t(name)}
        value={value}
        onChange={onChange(name)}
        {...props}
      />
    </Grid>
  );

  const renderSelect = (xs?: boolean | GridSize, sm?: boolean | GridSize) => <T,>(
    name: string,
    options: Array<T>,
    getOptionLabel: (option: unknown) => string,
    renderOption: (option: unknown) => ReactNode,
    renderInput: (params: AutocompleteRenderInputParams) => ReactNode,
    value: T | null,
    onChange: (event: ChangeEvent<{}>, newValue: T | null) => void,
  ) => (
    <Grid item xs={xs} sm={sm}>
      <Autocomplete
        id={name}
        options={options}
        autoHighlight
        getOptionLabel={getOptionLabel}
        renderOption={renderOption}
        renderInput={renderInput}
        value={value}
        onChange={onChange}
      />
    </Grid>
  );

  const renderCountryCode = () => renderSelect(12, 5)<Country>(
    "countryCode",
    Object.values(COUNTRIES),
    (option: unknown) => (option as Country).label,
    (option: unknown) => (
      <Fragment>
        <span>{auth.countryToFlag((option as Country).code)}</span>
        ({(option as Country).code}) +{(option as Country).phone}
      </Fragment>
    ),
    (params: AutocompleteRenderInputParams) => (
      <TextField
        {...params}
        label={t("countryCode")}
        variant="outlined"
        required
        inputProps={{
          ...params.inputProps,
          autoComplete: 'countryCode',
        }}
      />
    ),
    basicInfo.country,
    (_event: any, newValue: Country | null) =>
      newValue && setBasicInfo({ ...basicInfo, country: newValue }),
  );

  const renderDOB = () => (
    <Grid item xs={12}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          variant="inline"
          fullWidth
          required
          format="dd/MM/yyyy"
          margin="normal"
          id="dob"
          label={t("dob")}
          value={basicInfo.dob}
          onChange={onDOBChange}
          KeyboardButtonProps={{
            'aria-label': 'Change date of birth',
          }}
        />
      </MuiPickersUtilsProvider>
    </Grid>
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
    <Grid item xs={12}>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
        onClick={onSubmit}
      >
        {t("save")}
      </Button>
    </Grid>
  );

  const renderSkip = () => (
    <Grid
      container
      justifyContent="center"
      alignContent="center"
      alignItems="center"
    >
      <Button
        type="submit"
        variant="text"
        color="secondary"
        onClick={onSkip}
      >
        {history.length === 1 ? t("skip") : t("done")}
      </Button>
    </Grid>
  );

  const renderForm = () => (
    <form className={classes.form} noValidate>
      <Grid container spacing={2}>
        {renderTextField(12)("email", "email", basicInfo.email, { autoFocus: true })}
        {renderTextField(12, 6)("fName", "firstName", basicInfo.firstName)}
        {renderTextField(12, 6)("lName", "lastName", basicInfo.lastName)}
        {renderCountryCode()}
        {renderTextField(12, 7)("pNum", "phoneNumber", basicInfo.phoneNumber, { type: "number" })}
        {renderDOB()}
        {loading && renderLoading()}
        {!loading && renderSubmit()}
        {!loading && renderSkip()}
      </Grid>
    </form>
  );

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {renderAvatar()}
        {renderForm()}
      </div>
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
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  loading: {
    margin: theme.spacing(2, 0, 2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default UserInfo;
