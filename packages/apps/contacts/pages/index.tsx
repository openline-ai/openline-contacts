import type {NextPage} from 'next'
import ContactList from "./contact";
import {getSession} from "next-auth/react";
import {loggedInOrRedirectToLogin} from "../utils/logged-in";

const Home: NextPage = () => {

    return (
        <>
            <ContactList/>
        </>
    )
}

export async function getServerSideProps(context: any) {
    return loggedInOrRedirectToLogin(await getSession(context));
}

export default Home
