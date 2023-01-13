import type {NextPage} from 'next'
import {getSession} from "next-auth/react";
import {loggedInOrRedirectToLogin} from "../utils/logged-in";
import Dashboard from "./dashboard";

const Home: NextPage = () => {

    return (
        <>
            <Dashboard/>
        </>
    )
}

export async function getServerSideProps(context: any) {
    return loggedInOrRedirectToLogin(await getSession(context));
}

export default Home
