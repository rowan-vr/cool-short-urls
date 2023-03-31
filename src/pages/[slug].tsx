import {GetServerSidePropsContext, NextPageContext} from "next";
import {prisma} from "@/database";
import exp from "constants";

function Slug() {
    return <></>
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const {slug} = context.params!;
    const destination = await prisma.url.update({
        where: {
            slug: slug as string
        },
        data: {
            visits: {
                increment: 1
            }
        }
    });

    if (destination) {
        return {
            redirect: {
                destination: destination.destination,
                permanent: false
            }
        }
    } else {
        return {
            notFound: true
        }
    }
}

export default Slug;
