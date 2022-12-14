import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeflex/primeflex.css';
import "primeicons/primeicons.css";

import '../styles/globals.css'
import '../styles/theme-override.css'
import '../styles/layout.css'
import '../styles/card-fieldset.css'
import '../styles/button.css'
import '../styles/search-component.css'
import 'react-toastify/dist/ReactToastify.css';


import {AppProps} from "next/app";
import {Session} from "next-auth";
import {ToastContainer} from "react-toastify";
import Layout from "../layout/layout";
import {SessionProvider} from "next-auth/react";

export default function App({
                                Component,
                                pageProps: {session, ...pageProps},
                            }: AppProps<{ session: Session }>) {


    return (
        <SessionProvider session={session}>
            <Layout>
                <ToastContainer position="bottom-right"
                                autoClose={3000}
                                closeOnClick={true}
                                hideProgressBar={true}
                                theme="colored"/>
                <Component {...pageProps} />
            </Layout>
        </SessionProvider>
    )
}
