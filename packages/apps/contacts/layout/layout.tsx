import { useRouter } from "next/router";
import { WebChat } from "@openline-ai/openline-web-chat";
import "@openline-ai/openline-web-chat/dist/esm/index.css"
import { SidePanel } from "../components/organisms";
import { Configuration, FrontendApi, Session } from "@ory/client";
import { edgeConfig } from "@ory/integrations/next"
import { useEffect, useState } from "react";
import { getUserName } from "../utils/logged-in";
import {initGraphQLClient} from "../utils/graphQLClient";
import styles from './layout.module.scss'

const ory = new FrontendApi(new Configuration(edgeConfig))

export default function Layout({ children }: any) {
    const router = useRouter();
    const [isSidePanelVisible, setSidePanelVisible] = useState(false);

    const [session, setSession] = useState<Session | undefined>()
    const [userEmail, setUserEmail] = useState<string | undefined>()
    const [logoutUrl, setLogoutUrl] = useState<string | undefined>()

    useEffect(() => {
        if (router.asPath.startsWith("/login")) {
            return;
        }
        const start = Date.now();
        ory
            .toSession(undefined, {
                headers: {
                    "cache-control": "max-age=600",
                },
            })
            .then(({data, headers}) => {
                const end = Date.now();
                console.log(`Ory session execution time: ${end - start} ms; Cache: ` + (headers['cf-cache-status'] ?? 'missing header'));

                // User has a session!
                setSession(data)
                setUserEmail(getUserName(data.identity))

                initGraphQLClient()

                // Create a logout url
                ory.createBrowserLogoutFlow().then(({ data }) => {
                    setLogoutUrl(data.logout_url)
                })
            })
            .catch(() => {
                // Redirect to login page
                return router.push(edgeConfig.basePath + "/ui/login")
            })
    }, [router])

    if (!session) {
        if (router.asPath.startsWith("/login")) {
            return (
            <div className="flex-grow-1 flex h-full overflow-auto">
                <div className="w-full h-full">
                    {children}
                </div>
            </div>)
        }
        if (router.asPath != ("/login")) {
            return null;
        }
    }

    return (
        <div className={`flex w-full ${styles.pageContentWrapper}`} style={{minHeight: '100%'}}>

            {router.pathname === '/' && userEmail && (
                <SidePanel
                    userEmail={userEmail}
                    logoutUrl={logoutUrl}
                    isOpen={isSidePanelVisible}
                    onOpen={() => setSidePanelVisible(true)}
                    onClose={() => setSidePanelVisible(false)}
                />
            )}

            <div className={`flex-grow-1 flex h-full`}>
                <div className="w-full h-full">
                    {children}
                </div>
            </div>
        </div>
    )
}