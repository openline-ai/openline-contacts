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
import {AppProps} from "next/app";
import {Session} from "next-auth";
import {SessionProvider} from "next-auth/react";

export default function App({
                                Component,
                                pageProps: { session, ...pageProps },
                            }: AppProps<{ session: Session }>) {
    return (
        <SessionProvider session={session}>
            <Component {...pageProps} />
        </SessionProvider>
    )
}
