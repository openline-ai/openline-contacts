import { useRouter } from "next/router";
import { WebChat } from "@openline-ai/openline-web-chat";
import "@openline-ai/openline-web-chat/dist/esm/index.css"
import { SidePanel } from "../components/organisms";
import { Configuration, FrontendApi, Session } from "@ory/client";
import { edgeConfig } from "@ory/integrations/next"
import { useEffect, useState } from "react";
import { getUserName } from "../utils/logged-in";
import { setClient } from "../utils/graphQLClient";
import axios from "axios";

const ory = new FrontendApi(new Configuration(edgeConfig))

export default function Layout({ children }: any) {
    const router = useRouter();

    const [session, setSession] = useState<Session | undefined>()
    const [userEmail, setUserEmail] = useState<string | undefined>()
    const [logoutUrl, setLogoutUrl] = useState<string | undefined>()

    useEffect(() => {
        if (router.asPath === ("/login")) {
            return;
        } //TODO: remove this check when we switch to the new login page
        ory
            .toSession()
            .then(({ data }) => {
                // User has a session!
                setSession(data)
                let userName = getUserName(data.identity);
                setUserEmail(userName)

                setClient(userName)
                axios.defaults.headers.common['X-Openline-USERNAME'] = userName;

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
        // Still loading
        if (router.asPath === ("/login")) {
            return (
            <div className="flex-grow-1 flex h-full overflow-auto">
                <div className="w-full h-full">
                    {children}
                </div>
            </div>)
            ;
        }
        if (router.asPath != ("/login")) {
            return null;
        } //TODO: revert this check to return null; when we switch to the new login page
    }

    return (
        <div className="flex h-full w-full">

            {router.pathname === '/' && (
                <SidePanel userEmail={userEmail} logoutUrl={logoutUrl} />
            )}

            <div className="flex-grow-1 flex h-full overflow-auto">
                <div className="w-full h-full">
                    {children}
                </div>
            </div>

            <WebChat apikey={`${process.env.WEB_CHAT_API_KEY}`}
                httpServerPath={`${process.env.WEB_CHAT_HTTP_PATH}`}
                wsServerPath={`${process.env.WEB_CHAT_WS_PATH}`}
                location="left"
                trackerEnabled={`${process.env.WEB_CHAT_TRACKER_ENABLED}` === 'true'}
                trackerAppId={`${process.env.WEB_CHAT_TRACKER_APP_ID}`}
                trackerId={`${process.env.WEB_CHAT_TRACKER_ID}`}
                trackerCollectorUrl={`${process.env.WEB_CHAT_TRACKER_COLLECTOR_URL}`}
                trackerBufferSize={`${process.env.WEB_CHAT_TRACKER_BUFFER_SIZE}`}
                trackerMinimumVisitLength={`${process.env.WEB_CHAT_TRACKER_MINIMUM_VISIT_LENGTH}`}
                trackerHeartbeatDelay={`${process.env.WEB_CHAT_TRACKER_HEARTBEAT_DELAY}`}
                userEmail={userEmail || ''}
            />
        </div>
    )
}