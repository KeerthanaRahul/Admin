import React, { useState } from 'react'
import LoginStyles from './Login.module.css';
import { useNavigate } from 'react-router-dom';
import { TextField, FormControl, InputAdornment, Snackbar, Alert, Dialog, DialogContent, DialogContentText, Slide } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Loader from '../../CommonComponents/Loader/Loader';
import CommonButton from '../../CommonComponents/CommonButton/CommonButton';
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebaseConfig';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Login = () => {

  const navigate = useNavigate();

  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [loginPayload, setLoginPayload] = useState({});
  const [callLoginApi, setCallLoginApi] = useState(false);
  const [callGoogleLoginApi, setCallGoogleLoginApi] = useState(false);
  const [googleLoginPayload, setGoogleLoginPayload] = useState({});
  const [googleTokens, setGoogleTokens] = useState({});
  const [googleUser, setGoogleUser] = useState({});
  const [uuid, setUuid] = useState("");
  const [callDetailApi, setCallDetailApi] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snakbarMsg, setSnakbarMsg] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openLoginErrorDialog, setOpenLoginErrorDialog] = useState(false);

  const handleLoginForm = (event) => {
    setFormValues({ ...formValues, [event.target.name]: event.target.value });
  }

  const handleKeyDown = (e) => {
    if (e.keyCode === 13 || e.key === "Enter") {
      if (!formValues?.email || !formValues?.password) {
        return;
      } else {
        handleLogin();
      }
    }
  }

  const handleLoginErrors = (errors) => {
    switch (errors?.code) {
      case 'auth/invalid-email':
        setOpenSnackbar(true);
        setSnakbarMsg('Please enter valid email or password!!');
        break;
      case 'auth/missing-password':
        setOpenSnackbar(true);
        setSnakbarMsg('Please enter valid email or password!!');
        break;
      case 'auth/invalid-credential':
        setOpenSnackbar(true);
        setSnakbarMsg('Please enter valid email or password!!');
        break;
      default:
        setOpenSnackbar(true);
        setSnakbarMsg('Please enter valid email or password!!');
        break;
    }
  }

  const handleLogin = () => {
    setIsLoading(true);
    signInWithEmailAndPassword(auth, formValues?.email, formValues?.password).then((user) => {
      setIsLoading(false);
      setLoginPayload({
        idToken: user?.user?.stsTokenManager?.accessToken,
        refreshToken: user?.user?.stsTokenManager?.refreshToken
      });
      
      login()
    }).catch((error) => {
      const errString = JSON.stringify(error);
      const errorJson = JSON.parse(errString);
      handleLoginErrors(errorJson)
      setIsLoading(false)
    })

  }

  const login = async() => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8082/api/v1/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginPayload),
      });
      console.log(res)
      navigate('/dashboard');
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again later.');
      setOpenLoginErrorDialog(true);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {isLoading && <Loader showLoader={isLoading} />}
      <div className={LoginStyles.loginCcontainer}>
        <div className={LoginStyles.loginBox}>
          <div className={LoginStyles.loginLeft}>
            <div className={LoginStyles.loginLogo}>
            </div>
            <h1 className={LoginStyles.loginTitle}>Cafe Central Admin</h1>
            <p className={LoginStyles.loginpara}>Welcome back! Please sign in to continue.</p>
            <div className={LoginStyles.loginForm}>
              <FormControl sx={{ width: '100%' }}>
                <label>Email <span className={LoginStyles.required}>*</span></label>
                <TextField
                  name='email'
                  value={formValues?.email}
                  onChange={handleLoginForm}
                  onKeyDown={handleKeyDown}
                  InputProps={{
                    type: 'text',
                    startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment>
                  }}
                  sx={{ input: { "&::placeholder": { opacity: 0.9 } } }}
                  placeholder={"Enter your mail address"} size="small"
                />
                <label>Password <span className={LoginStyles.required}>*</span></label>
                <TextField
                  name='password'
                  value={formValues?.password}
                  onChange={handleLoginForm}
                  onKeyDown={handleKeyDown}
                  InputProps={{
                    type: passwordVisibility ? 'password' : 'text',
                    startAdornment: <InputAdornment position="start"><LockIcon /></InputAdornment>,
                    endAdornment: <InputAdornment position="end">{passwordVisibility ? <VisibilityOffIcon className={LoginStyles.VisibilityOffIcon} onClick={() => setPasswordVisibility(false)} /> : <VisibilityIcon className={LoginStyles.VisibilityIcon} onClick={() => setPasswordVisibility(true)} />}</InputAdornment>
                  }}
                  sx={{ input: { "&::placeholder": { opacity: 0.9 } } }}
                  placeholder={"Enter password"} size="small"
                />
              </FormControl>
              <CommonButton variant="contained" bgColor={'#5b67f1'} color={'white'} padding={'15px'} borderRadius={'5px'} fontWeight={'bold'} width={'100%'} height={'45px'} margin={'50px 0 0 0'} disabled={!formValues?.email || !formValues?.password} onClick={handleLogin}>Log In</CommonButton>
            </div>
          </div>
        </div>
      </div>
      <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {snakbarMsg}
        </Alert>
      </Snackbar>
      <Dialog open={openLoginErrorDialog} TransitionComponent={Transition} keepMounted onClose={() => setOpenLoginErrorDialog(false)} aria-describedby="alert-dialog-slide-description" fullWidth={false} maxWidth="sm" className={LoginStyles.dialogWrapper}>
        <div className={LoginStyles.modalinnerwrapper}>
          <div><h4 className={LoginStyles.headerText}>Oops..</h4></div>
          <IconButton aria-label="close" onClick={() => setOpenLoginErrorDialog(false)} sx={{ position: 'absolute', right: 8, top: 8, color: "#666" }}>
            <CloseIcon />
          </IconButton>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">

            </DialogContentText>
            <div className={LoginStyles.errorMessage}>{errorMessage}</div>
          </DialogContent>
          <div className={LoginStyles.modalabuttons}>
            <div className={LoginStyles.modalactionsection}>
              <button onClick={() => setOpenLoginErrorDialog(false)} className={LoginStyles.okButton}>
                Ok
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default Login