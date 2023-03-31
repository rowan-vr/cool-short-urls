import {inspect} from "util";
import styles from '@/styles/Home.module.scss'
import {DetailedHTMLProps, HTMLAttributes} from "react";
import {useSession} from "next-auth/react";

export type NavBarProps = {

}

export default function NavBar({...restprops} :NavBarProps & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>){
    const session = useSession();

    return (<div className={styles.nav} {...restprops}>
        <div className={styles.item}>
            <a href="/" >Cool Short Urls</a>
        </div>

        {session.status === "authenticated" ? <>
            <div className={styles.item} style={{marginLeft: "auto"}}>
                <a href="/dashboard" >Dashboard</a>
            </div>
        </>: <>
        <div className={styles.item} style={{marginLeft: "auto"}}>
            <a href="/login" >login</a>
        </div>
        <div className={styles.item}>
            <a href="/register" >register</a>
        </div>
        </>}
    </div>)
}