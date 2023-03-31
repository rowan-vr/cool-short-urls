import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import {SessionProvider} from "next-auth/react"
import {Session} from "next-auth";
import {ThemeProvider} from "@mui/material";
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#fff',
        },
        info: {
            main: '#eceffa',
        },
        success:{
            main: '#48ff00',
        },
        background: {
            default: '#3f4459',
            paper: '#3f4459',
        }
    },
});


export default function App({Component, pageProps: {session, ...pageProps}} : AppProps & { session: Session}) {
    return (
        <ThemeProvider theme={theme}>
        <SessionProvider session={session}>
            <Component {...pageProps} />
        </SessionProvider>
        </ThemeProvider>
    )
}