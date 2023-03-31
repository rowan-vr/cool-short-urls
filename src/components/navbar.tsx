import {inspect} from "util";
import styles from '@/styles/Home.module.scss'
import {DetailedHTMLProps, HTMLAttributes} from "react";
import {useSession} from "next-auth/react";
import Link from "next/link";

export type NavBarProps = {

}

export default function NavBar({...restprops} :NavBarProps & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>){
    const session = useSession();

    return (<div className={styles.nav} {...restprops}>
        <div className={styles.item}>
            <Link href="/" >Cool Short Urls</Link>
        </div>

        {session.status === "authenticated" ? <>
            <div className={styles.item} style={{marginLeft: "auto"}}>
                <Link href="/dashboard" >Dashboard</Link>
            </div>
        </>: <>
        <div className={styles.item} style={{marginLeft: "auto"}}>
            <Link href="/login" >login</Link>
        </div>
        <div className={styles.item}>
            <Link href="/register" >register</Link>
        </div>
        </>}
    </div>)
}