import Head from 'next/head'
import Image from 'next/image'
import {Inter} from 'next/font/google'
import styles from '@/styles/Home.module.scss'
import NavBar from "@/components/navbar";
import {useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import axios from "axios";
import SuccessDialog from "@/components/SuccessDialog";
import * as url from "url";
import {useState} from "react";
import {useSession} from "next-auth/react";
import {Box, Tab, Tabs} from "@mui/material";
import {Url} from '@prisma/client'

import useSWR from "swr";
import {DataGrid, GridColDef} from "@mui/x-data-grid";

const columns: GridColDef<Url>[] = [
    {field: 'slug', headerName: 'Slug', flex: 1},
    {field: 'destination', headerName: 'Destination', flex: 2},
    {field: 'visits', headerName: 'Visits', flex: 1},
]

export default function Dashboard() {
    const {data} = useSession({required: true, onUnauthenticated: () => window.location.href = '/login'});
    const user = data?.user;

    const res = useSWR('/api/urls/mine', (url) => axios.get(url, {withCredentials: true}).then(res => res.data));

    if (!user || !res?.data) return <></>;

    console.log(res.data)


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
                <div style={{width: '810px'}}>
                    <DataGrid style={{border:"none"}} columns={columns} rows={res.data} sx={{minHeight: '600px',
                    '&& .MuiDataGrid-cell, .MuiDataGrid-columnHeaders, .MuiDataGrid-footerContainer, .MuiToolbar-gutters, .MuiDataGrid-virtualScrollerContent': {
                        background: '#2c2f3b',
                        color: '#d0d0d0',
                        border: 'none',
                        fontFamily: '\'Roboto Mono\', monospace'
                    },
                        '&& .MuiSvgIcon-root': {
                            color: '#d0d0d0'
                        }
                    }}/>
                </div>
            </main>
        </>
    )
}
