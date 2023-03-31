import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import NavBar from "@/components/navbar";
import {useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import axios from "axios";
import {useState} from "react";
import {set} from "immutable";
import {signIn} from "next-auth/react";

export interface RegisterForm {
    username: string;
    password: string;
    confirmPassword: string;
}

export const registerSchema = yup.object().shape({
    username: yup.string().required().min(3),
    password: yup.string().required().min(3),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match')
});

export default function Register() {
    const [loading, setLoading] = useState(false);
    const {register, handleSubmit, formState: {errors}, setError} = useForm<RegisterForm>({resolver: yupResolver(registerSchema)});


    function submit({username, password}: RegisterForm) {
        if (loading) return;

        setLoading(true);

        axios.post('/api/user/register', {username, password}, {validateStatus: () => true}).then(res => {
            if (res.status === 200) {
                signIn('credentials', {username, password, callbackUrl: '/'})
            } else if (res.status === 409) {
                setError("username", {type: "manual", message: "Username already taken"})
            } else {
                setError("username", {type: "manual", message: "Something went wrong"})
            }
            setLoading(false);
        })
    }

    return (
        <>
            <Head>
                <title>Cool Short Urls</title>
                <meta name="description"
                      content="Cool Short Urls is the coolest url shortifyer which you will ever see!"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className={styles.main}>
                <NavBar/>
                <div className={styles.login}>
                    <h2>Create a new Account</h2>
                    <input className={`${errors.username ? styles.error : ''}`} placeholder={"Username"} {...register('username')}/>
                    {errors.username && <span className={styles.error}>{errors.username.message}</span>}
                    <input className={`${errors.password ? styles.error : ''}`} placeholder={"Password"} type="password" {...register('password')}/>
                    {errors.password && <span className={styles.error}>{errors.password.message}</span>}
                    <input className={`${errors.confirmPassword ? styles.error : ''}`} placeholder={"Confirm Password"} type="password" {...register('confirmPassword')}/>
                    {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword.message}</span>}

                    <button onClick={handleSubmit(submit)}>Login</button>
                </div>
            </main>
        </>
    )
}