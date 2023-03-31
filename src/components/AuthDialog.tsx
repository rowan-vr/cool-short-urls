import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Icon,
    IconButton,
    Input, Tab, Tabs, Typography
} from "@mui/material";
import {inspect} from "util";
import styles from '@/styles/Home.module.scss'
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {signIn} from "next-auth/react";
import {LoginForm, loginSchema} from "@/pages/login";
import axios from "axios";
import {RegisterForm, registerSchema} from "@/pages/register";

interface TabPanelProps {
    children?: React.ReactNode;
    current: string;
    value: string;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, current: index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 1}} className={`${styles.login} ${styles.authdialog}`}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export interface AuthDialogProps {
    open: boolean;
    onClose: (success: boolean) => void;

}

export default function AuthDialog({open, onClose}: AuthDialogProps) {
    const [tab, setTab] = useState<'login' | 'register'>('login');

    const loginForm = useForm<LoginForm>({resolver: yupResolver(loginSchema)});

    function login({username, password}: LoginForm) {
        signIn('credentials', {username, password, callbackUrl: '/dashboard', redirect: false})
            .then(res => {
                if (res!.ok)
                    onClose(true);
                else {
                    loginForm.setError("password", {type: "manual", message: "Invalid username or password"})
                    loginForm.setError("username", {type: "manual", message: ""})
                }
            })
    }

    const registerForm = useForm<RegisterForm>({resolver: yupResolver(registerSchema)});

    function register({username, password}: RegisterForm) {
        axios.post('/api/user/register', {username, password}, {validateStatus: () => true}).then(res => {
            if (res.status === 200) {
                signIn('credentials', {username, password, callbackUrl: '/'}).then(res => {
                    if (res!.ok)
                        onClose(true);
                    else {
                        setTab('login');
                    }
                })
            } else if (res.status === 409) {
                registerForm.setError("username", {type: "manual", message: "Username already taken"})
            } else {
                registerForm.setError("username", {type: "manual", message: "Something went wrong"})
            }
        })
    }


    return <Dialog
        open={open}
        disableEscapeKeyDown
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        onClose={onClose}

        sx={{
            '& .MuiDialog-paper': {
                backgroundColor: '#3f4459',
                width: '100%',
            },
            '& .MuiDialogTitle-root,.MuiDialogContentText-root': {
                color: 'white',
                fontFamily: '\'Roboto Mono\', monospace',
            }
        }}
    >
        <DialogTitle id='alert-dialog-title'>You are almost there!</DialogTitle>
        <DialogContent style={{width: '100%', display: 'block'}} sx={{position: 'relative'}}>
            <DialogContentText id='alert-dialog-description'>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <Tabs value={tab} onChange={(e, n) => setTab(n)} aria-label="basic tabs example" sx={{
                        '& .MuiButtonBase-root.MuiTab-root': {
                            color: '#bbbbbb',
                            fontFamily: '\'Roboto Mono\', monospace',
                            '&.Mui-selected': {
                                color: 'white',
                            }
                        }
                    }}>
                        <Tab label="Login" value="login"/>
                        <Tab label="Register" value="register"/>
                    </Tabs>
                </Box>
                <TabPanel current={tab} value={'login'}>
                    <input className={loginForm.formState.errors.username ? styles.error : ''}
                           placeholder="Username" {...loginForm.register('username')}/>
                    {loginForm.formState.errors.username && <span className={styles.error}>{loginForm.formState.errors.username.message}</span>}
                    <input className={loginForm.formState.errors.password ? styles.error : ''}
                           placeholder="Password" {...loginForm.register('password')}/>
                    {loginForm.formState.errors.password && <span className={styles.error}>{loginForm.formState.errors.password.message}</span>}
                    <button onClick={loginForm.handleSubmit(login)}>Login</button>
                </TabPanel>
                <TabPanel current={tab} value={'register'}>
                    <input className={registerForm.formState.errors.username ? styles.error : ''}
                           placeholder="Username" {...registerForm.register('username')}/>
                    {registerForm.formState.errors.username && <span className={styles.error}>{registerForm.formState.errors.username.message}</span>}
                    <input className={registerForm.formState.errors.password ? styles.error : ''}
                           placeholder="Password" {...registerForm.register('password')}/>
                    {registerForm.formState.errors.password && <span className={styles.error}>{registerForm.formState.errors.password.message}</span>}
                    <input className={registerForm.formState.errors.password ? styles.error : ''}
                           placeholder="Confirm Password" {...registerForm.register('confirmPassword')}/>
                    {registerForm.formState.errors.confirmPassword && <span className={styles.error}>{registerForm.formState.errors.confirmPassword.message}</span>}
                    <button onClick={registerForm.handleSubmit(register)}>Register</button>
                </TabPanel>
            </DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>

        </DialogActions>
    </Dialog>
}