import {useRouter} from "next/router";
import {Button} from "primereact/button";
import {OverlayPanel} from "primereact/overlaypanel";
import {useRef} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket, faCaretDown, faIdCard, faSitemap, faUserSecret, faUsersRectangle} from "@fortawesome/free-solid-svg-icons";
import {Menu} from "primereact/menu";
import {signOut, useSession} from "next-auth/react";
import {WebChat} from "@openline-ai/openline-web-chat";
import "@openline-ai/openline-web-chat/dist/esm/index.css"
import WorkspacePanel from "../components/organisms/workspace-panel/WorkspacePanel";

export default function Layout({children}: any) {
    const router = useRouter();

    const {data: session} = useSession();

    console.log(router)

    return (
        <div className="flex h-full w-full">

            {router.pathname === '/' && (
                <WorkspacePanel
                    workspaceList={['Workspace']}
                    workspaceListItems={[]} />

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
                     userEmail={session?.user?.email || ''}
            />
        </div>
    )
}