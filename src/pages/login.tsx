import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import NavBar from "@/components/navbar";
import {useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {signIn} from "next-auth/react";

export interface LoginForm{
    username: string;
    password: string;
}

export const loginSchema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
});

export default function Login() {

    const {register, handleSubmit, formState: {errors}, setError} = useForm<LoginForm>({resolver: yupResolver(loginSchema)});

    function login({username,password}:LoginForm){
        signIn('credentials', {username, password, callbackUrl: '/dashboard'})
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
                    <h2>Login to your Account</h2>
                    <input className={`${errors.username ? styles.error : ''}`} placeholder={"Username"} {...register('username')}/>
                    {errors.username && <span className={styles.error}>{errors.username.message}</span>}
                    <input className={`${errors.password ? styles.error : ''}`} placeholder={"Password"} {...register('password')}/>
                    {errors.password && <span className={styles.error}>{errors.password.message}</span>}

                    <button onClick={handleSubmit(login)}>Login</button>
                </div>
            </main>
        </>
    )
}