import type { NextPage } from 'next'
import { FullScreenModeLayout } from "../../components/organisms/fullscreen-mode-layout";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    DeleteHubspotSettings,
    DeleteSmartsheetSettings,
    DeleteZendeskSettings,
    GetSettings,
    UpdateHubspotSettings,
    UpdateSmartsheetSettings,
    UpdateZendeskSettings,
} from "../../services/settingsService";
import { HubspotSettings, Settings } from "../../models/settings";
import { Button } from "../../components/atoms";


const Settings: NextPage = () => {
    const [settings, setSettingsExist] = useState<Settings>({
        zendeskExists: false,
        smartSheetExists: false,
        hubspotExists: false,
    })

    const [hubspotPrivateAppKey, setHubspotPrivateAppKey] = useState<string>('')
    const [zendeskAPIKey, setZendeskApiKey] = useState<string>('')
    const [zendeskSubdomain, setZendeskSubdomain] = useState<string>('')
    const [zendeskAdminEmail, setAdminEmail] = useState<string>('')
    const [smartSheetId, setSmartsheetId] = useState<string>('')
    const [smartSheetAccessToken, setSmartsheetAccessToken] = useState<string>('')

    useEffect(() => {
        GetSettings().then((data: Settings) => {
            setSettingsExist(data)
        }).catch((reason: any) => {
            toast.error("There was a problem on our side and we cannot load settings data at the moment,  we are doing our best to solve it! ");
        });
    }, [])

    const resetZendesk = () => {
        setZendeskApiKey('')
        setZendeskSubdomain('')
        setAdminEmail('')
    }

    const resetHubspot = () => {
        setHubspotPrivateAppKey('')
    }

    const resetSmartsheet = () => {
        setSmartsheetId('')
        setSmartsheetAccessToken('')
    }


    const handleSubmitHubspotSettings = (data: HubspotSettings) => {
        UpdateHubspotSettings({ hubspotPrivateAppKey }).then(() => {
            toast.success("Settings updated successfully!");
            setSettingsExist({
                ...settings,
                hubspotExists: true,
            })
            resetHubspot()
        }).catch(() => {
            toast.error("There was a problem on our side and we are doing our best to solve it!");
        });
    }

    const handleSubmitZendeskSettings = () => {
        UpdateZendeskSettings({
            zendeskSubdomain,
            zendeskAdminEmail,
            zendeskAPIKey
        }).then(() => {
            toast.success("Settings updated successfully!");
            setSettingsExist({
                ...settings,
                zendeskExists: true,
            })
            resetZendesk()
        }).catch(() => {
            toast.error("There was a problem on our side and we are doing our best to solve it!");
        });
    }
    const handleSubmitSmartsheetSettings = () => {
        UpdateSmartsheetSettings({
            smartSheetAccessToken,
            smartSheetId
        }).then(() => {
            toast.success("Settings updated successfully!");
            setSettingsExist({
                ...settings,
                smartSheetExists: true,
            })
            resetSmartsheet()
        }).catch(() => {
            toast.error("There was a problem on our side and we are doing our best to solve it!");
        });
    }
    const handleDeleteHubspot = () => {
        DeleteHubspotSettings().then(() => {
            setSettingsExist({
                ...settings,
                hubspotExists: false,
            })
            resetHubspot()
        }).catch(() => {
            toast.error("There was a problem on our side and we are doing our best to solve it!");
        });
    }
    const handleDeleteZendesk = () => {
        DeleteZendeskSettings().then(() => {
            setSettingsExist({
                ...settings,
                zendeskExists: false,
            })
            resetZendesk()
        }).catch(() => {
            toast.error("There was a problem on our side and we are doing our best to solve it!");
        });
    }
    const handleDeleteSmartsheetSettings = () => {
        DeleteSmartsheetSettings().then(() => {
            setSettingsExist({
                ...settings,
                smartSheetExists: false,
            })
            resetSmartsheet()
        }).catch(() => {
            toast.error("There was a problem on our side and we are doing our best to solve it!");
        });
    }


    return (
        <FullScreenModeLayout fullScreenMode>
            <div className="ml-6">
                <h1 className="text-gray-700 text-2xl mt-5">Settings</h1>
                <article className="flex flex-column mb-3">
                    <h2 className="text-lg text-gray-800 mb-3">Hubspot</h2>

                    <div style={{ maxWidth: '25rem', width: '100%' }}>
                        <>
                            <label htmlFor="openline-hubspot-api-key" className="mb-2 block text-gray-800">API key</label>
                            <input value={settings.hubspotExists ? "************" : hubspotPrivateAppKey}
                                id="openline-hubspot-api-key"
                                disabled={settings.hubspotExists}
                                className="flex w-full mb-3 pt-2 pb-1 pr-2 pl-2"
                                onChange={({ target: { value } }) => setHubspotPrivateAppKey(value)} />
                            <div className="flex justify-content-end">
                                {settings.hubspotExists ? (
                                    <Button onClick={handleDeleteHubspot} mode='danger'>
                                        Revoke
                                    </Button>
                                ) : (
                                    <Button onClick={handleSubmitHubspotSettings} mode="primary">
                                        Save
                                    </Button>
                                )}

                            </div>
                        </>
                    </div>
                </article>
                <article className="flex flex-column mb-3">
                    <h2 className="text-lg text-gray-800 mb-3">Zendesk</h2>
                    <div style={{ maxWidth: '25rem', width: '100%' }}>

                        <>
                            <label htmlFor="openline-zendesk-api-key"
                                className="mb-2 block text-gray-800">
                                API key
                            </label>
                            <input value={settings.zendeskExists ? "*************" : zendeskAPIKey}
                                id="openline-zendesk-api-key"
                                disabled={settings.zendeskExists}
                                className="flex w-full mb-4 pt-2 pb-1 pr-2 pl-2"
                                onChange={({ target: { value } }) => setZendeskApiKey(value)} />
                            <label htmlFor="openline-zendesk-subdomain" className="mb-2 block text-gray-800">Subdomain</label>
                            <input value={settings.zendeskExists ? "*************" : zendeskSubdomain}
                                id="openline-zendesk-subdomain"
                                disabled={settings.zendeskExists}
                                className="flex w-full mb-4 pt-2 pb-1 pr-2 pl-2"
                                onChange={({ target: { value } }) => setZendeskSubdomain(value)} />
                            <label htmlFor="openline-zendesk-admin-email" className="mb-2 block text-gray-800">Admin Email</label>
                            <input value={settings.zendeskExists ? "*************" : zendeskAdminEmail}
                                id="openline-zendesk-admin-email"
                                disabled={settings.zendeskExists}
                                className="flex w-full pt-2 pb-1 pr-2 pl-2 mb-3"
                                onChange={({ target: { value } }) => setAdminEmail(value)} />
                            <div className="flex justify-content-end">
                                {settings.zendeskExists ? (
                                    <Button onClick={handleDeleteZendesk} mode='danger'>
                                        Revoke
                                    </Button>
                                ) : (
                                    <Button onClick={handleSubmitZendeskSettings} mode="primary">
                                        Save
                                    </Button>
                                )}
                            </div>
                        </>


                    </div>
                </article>
                <article className="flex flex-column mb-8">
                    <h2 className="text-lg text-gray-800 mb-3">Smartsheet</h2>
                    <div style={{ maxWidth: '25rem', width: '100%' }}>
                        <>
                            <label htmlFor="openline-smartsheet-id" className="mb-2 block text-gray-800">ID</label>
                            <input value={settings.smartSheetExists ? "******************" : smartSheetId}
                                id="openline-zendesk-api-key"
                                disabled={settings.smartSheetExists}
                                className="flex w-full mb-4 pt-2 pb-1 pr-2 pl-2"
                                onChange={({ target: { value } }) => setSmartsheetId(value)} />
                            <label htmlFor="openline-smartsheet-api-key" className="mb-2 block text-gray-800">API key</label>
                            <input value={settings.smartSheetExists ? "******************" : smartSheetAccessToken}
                                id="openline-zendesk-api-key"
                                className="flex w-full mb-4 pt-2 pb-1 pr-2 pl-2"
                                disabled={settings.smartSheetExists}
                                onChange={({ target: { value } }) => setSmartsheetAccessToken(value)} />
                            <div className="flex justify-content-end">
                                {settings.smartSheetExists ? (
                                    <Button onClick={handleDeleteSmartsheetSettings} mode='danger'>
                                        Revoke
                                    </Button>
                                ) : (
                                    <Button onClick={handleSubmitSmartsheetSettings} mode="primary">
                                        Save
                                    </Button>
                                )}
                            </div>

                        </>

                    </div>
                </article>
            </div>
        </FullScreenModeLayout>
    )
}

export default Settings
