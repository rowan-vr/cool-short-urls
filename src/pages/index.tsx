import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.scss'
import NavBar from "@/components/navbar";
import {useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import axios from "axios";
import SuccessDialog from "@/components/SuccessDialog";
import * as url from "url";
import {useState} from "react";
import AuthDialog from "@/components/AuthDialog";
import {useSession} from "next-auth/react";

const schema = yup.object().shape({
    url: yup.string().url().required(),
});

interface UrlForm{
    url: string;
    force?: boolean;
}

export default function Home() {
    const {status} = useSession();

    const {register, handleSubmit, formState: {errors}} = useForm<UrlForm>({resolver: yupResolver(schema)});
    const [url, setUrl] = useState<string | undefined>(undefined);
    const [auth, setAuth] = useState<string | undefined>(undefined);

    function submit({url, force=false}:UrlForm){
        if (!force && status !== 'authenticated') {
            setAuth(url);
            return;
        }

        axios.post('/api/urls/new', {destination: url}, {withCredentials: true}).then(res => {
            setUrl(window.location.origin + '/' + res.data.code);
        });
    }


  return (
    <>
      <Head>
        <title>Cool Short Urls</title>
        <meta name="description" content="Cool Short Urls is the coolest url shortifyer which you will ever see!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <SuccessDialog onClose={() => setUrl(undefined)} url={url} />
        <AuthDialog open={auth !== undefined} onClose={(s) => {

            if (s && auth) {
                submit({url: auth, force: true})
            }

            setAuth(undefined);
        }} />

      <main className={styles.main}>
          <NavBar/>
          <div className={styles.urlbar}>
              <input placeholder={"Boring long url"} {...register('url')}/> <button onClick={handleSubmit(submit)}>Make it COOL!</button>
          </div>
      </main>
    </>
  )
}
