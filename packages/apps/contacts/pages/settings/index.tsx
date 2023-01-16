import type {NextPage} from 'next'
import {getSession} from "next-auth/react";
import {loggedInOrRedirectToLogin} from "../../utils/logged-in";
import {FullScreenModeLayout} from "../../components/organisms/fullscreen-mode-layout";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {
    GetSettings,
    UpdateHubspotSettings,
    UpdateZendeskSettings
} from "../../services/settingsService";
import {Settings} from "../../models/settings";
import {Button} from "../../components/atoms";


const Settings: NextPage = () => {
    const [hubspotPrivateAppKey, setHubspotPrivateAppKey] = useState<string>('')
    const [zendeskAPIKey, setZendeskApiKey] = useState<string>('')
    const [zendeskSubdomain, setZendeskSubdomain] = useState<string>('')
    const [zendeskAdminEmail, setAdminEmail] = useState<string>('')


    useEffect(() => {
        //todo
        GetSettings().then((settings: Settings) => {
            setHubspotPrivateAppKey(settings.hubspotPrivateAppKey || '')
            setZendeskApiKey(settings.zendeskAPIKey || '')
            setZendeskSubdomain(settings.zendeskSubdomain || '')
            setAdminEmail(settings.zendeskAdminEmail || '')

        }).catch((reason: any) => {
            // if(reason.response.status !== 404) {
            //     // toast.error("There was a problem on our side and we cannot load settings data at the moment,  we are doing our best to solve it! ");
            // }
        });
    }, [])

    const handleSubmitHubspotSettings = () => {
        UpdateHubspotSettings({hubspotPrivateAppKey}).then(() => {
            toast.success("Settings updated successfully!");
        }).catch(() => {
            toast.error("There was a problem on our side and we are doing our best to solve it!");
        });
    }

    const handleSubmitZendeskSettings = () => {
        UpdateZendeskSettings({
            zendeskAPIKey,
            zendeskSubdomain,
            zendeskAdminEmail
        }).then(() => {
            toast.success("Settings updated successfully!");
        }).catch(() => {
            toast.error("There was a problem on our side and we are doing our best to solve it!");
        });
    }


    return (
        <FullScreenModeLayout fullScreenMode >
            <h1 className="text-gray-700 text-2xl mt-5">Settings</h1>
            <article className="flex flex-column mb-3">
                <h2 className="text-lg text-gray-800 mb-3">Hubspot</h2>
                <div style={{ maxWidth: '25rem', width: '100%'}}>
                    <label htmlFor="openline-hubspot-api-key" className="mb-2 block text-gray-800">Private App token</label>
                    <input value={hubspotPrivateAppKey} id="openline-hubspot-api-key"  className="flex w-full mb-3 pt-2 pb-1 pr-2 pl-2"  onChange={({target: {value}}) => setHubspotPrivateAppKey(value)}/>
                    <div className="flex justify-content-end">
                        <Button onClick={handleSubmitHubspotSettings} mode="primary">
                            Save
                        </Button>
                    </div>
                </div>
            </article>
            <article className="flex flex-column" >
                <h2 className="text-lg text-gray-800 mb-3">Zendesk</h2>
                <div style={{ maxWidth: '25rem', width: '100%'}}>
                    <label htmlFor="openline-zendesk-api-key" className="mb-2 block text-gray-800">API key</label>
                    <input value={zendeskAPIKey} id="openline-zendesk-api-key"  className="flex w-full mb-4 pt-2 pb-1 pr-2 pl-2" onChange={({target: {value}}) => setZendeskApiKey(value)}/>
                    <label htmlFor="openline-zendesk-subdomain" className="mb-2 block text-gray-800">Subdomain</label>
                    <input value={zendeskSubdomain} id="openline-zendesk-subdomain"  className="flex w-full mb-4 pt-2 pb-1 pr-2 pl-2" onChange={({target: {value}}) => setZendeskSubdomain(value)}/>
                    <label htmlFor="openline-zendesk-admin-email" className="mb-2 block text-gray-800">Admin Email</label>
                    <input value={zendeskAdminEmail} id="openline-zendesk-admin-email"  className="flex w-full pt-2 pb-1 pr-2 pl-2 mb-3" onChange={({target: {value}}) => setAdminEmail(value)}/>
                   <div className="flex justify-content-end">
                       <Button onClick={handleSubmitZendeskSettings} mode="primary">
                           Save
                       </Button>
                   </div>

                </div>
            </article>

        </FullScreenModeLayout>
    )
}

export async function getServerSideProps(context: any) {
    return loggedInOrRedirectToLogin(await getSession(context));
}

export default Settings
