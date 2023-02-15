import type {NextPage} from 'next'
import {FullScreenModeLayout} from "../../components/organisms/fullscreen-mode-layout";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {
    DeleteHubspotSettings,
    DeleteJiraSettings,
    DeleteSmartsheetSettings,
    DeleteTrelloSettings,
    DeleteZendeskSettings,
    GetSettings,
    UpdateHubspotSettings,
    UpdateJiraSettings,
    UpdateSmartsheetSettings,
    UpdateTrelloSettings,
    UpdateZendeskSettings,
} from "../../services/settingsService";
import {HubspotSettings, Settings} from "../../models/settings";
import {Button} from "../../components/atoms";


const Settings: NextPage = () => {
    const [settings, setSettingsExist] = useState<Settings>({
        zendeskExists: false,
        smartSheetExists: false,
        hubspotExists: false,
        jiraExists: false,
        trelloExists: false,
    })

    const [hubspotPrivateAppKey, setHubspotPrivateAppKey] = useState<string>('')

    const [zendeskAPIKey, setZendeskApiKey] = useState<string>('')
    const [zendeskSubdomain, setZendeskSubdomain] = useState<string>('')
    const [zendeskAdminEmail, setZendeskAdminEmail] = useState<string>('')

    const [smartSheetId, setSmartsheetId] = useState<string>('')
    const [smartSheetAccessToken, setSmartsheetAccessToken] = useState<string>('')

    const [jiraAPIToken, setJiraAPIToken] = useState<string>('')
    const [jiraDomain, setJiraDomain] = useState<string>('')
    const [jiraEmail, setJiraEmail] = useState<string>('')

    const [trelloAPIToken, setTrelloAPIToken] = useState<string>('')
    const [trelloAPIKey, setTrelloAPIKey] = useState<string>('')

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
        setZendeskAdminEmail('')
    }

    const resetHubspot = () => {
        setHubspotPrivateAppKey('')
    }

    const resetSmartsheet = () => {
        setSmartsheetId('')
        setSmartsheetAccessToken('')
    }

    const resetJira = () => {
        setJiraAPIToken('')
        setJiraDomain('')
        setJiraEmail('')
    }

    const resetTrello = () => {
        setTrelloAPIToken('')
        setTrelloAPIKey('')
    }

    const handleSubmitHubspotSettings = (data: HubspotSettings) => {
        UpdateHubspotSettings({hubspotPrivateAppKey}).then(() => {
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
    const handleSubmitJiraSettings = () => {
        UpdateJiraSettings({
            jiraAPIToken,
            jiraDomain,
            jiraEmail
        }).then(() => {
            toast.success("Settings updated successfully!");
            setSettingsExist({
                ...settings,
                jiraExists: true,
            })
            resetJira()
        }).catch(() => {
            toast.error("There was a problem on our side and we are doing our best to solve it!");
        });
    }
    const handleSubmitTrelloSettings = () => {
        UpdateTrelloSettings({
            trelloAPIToken,
            trelloAPIKey
        }).then(() => {
            toast.success("Settings updated successfully!");
            setSettingsExist({
                ...settings,
                trelloExists: true,
            })
            resetJira()
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
    const handleDeleteJiraSettings = () => {
        DeleteJiraSettings().then(() => {
            setSettingsExist({
                ...settings,
                jiraExists: false,
            })
            resetJira()
        }).catch(() => {
            toast.error("There was a problem on our side and we are doing our best to solve it!");
        });
    }
    const handleDeleteTrelloSettings = () => {
        DeleteTrelloSettings().then(() => {
            setSettingsExist({
                ...settings,
                trelloExists: false,
            })
            resetTrello()
        }).catch(() => {
            toast.error("There was a problem on our side and we are doing our best to solve it!");
        });
    }

    return (
        <FullScreenModeLayout fullScreenMode>
            <div className="ml-6">
                <h1 className="text-gray-700 text-2xl mt-5">Settings</h1>

                <div className="flex flex-row justify-content-start gap-8">

                    <article className="flex flex-column" style={{width: '20rem'}}>
                        <h2 className="text-lg text-gray-800 mb-3">Hubspot</h2>

                        <div className="w-full">
                                <label htmlFor="openline-hubspot-api-key" className="mb-2 block text-gray-800">API key</label>
                                <input value={settings.hubspotExists ? "************" : hubspotPrivateAppKey}
                                       disabled={settings.hubspotExists}
                                       className="flex w-full mb-3 pt-2 pb-1 pr-2 pl-2"
                                       onChange={({target: {value}}) => setHubspotPrivateAppKey(value)}/>
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
                        </div>
                    </article>

                    <article className="flex flex-column" style={{width: '20rem'}}>
                        <h2 className="text-lg text-gray-800 mb-3">Zendesk</h2>
                        <div className="w-full">
                                <label htmlFor="openline-zendesk-api-key"
                                       className="mb-2 block text-gray-800">
                                    API key
                                </label>
                                <input value={settings.zendeskExists ? "*************" : zendeskAPIKey}
                                       id="openline-zendesk-api-key"
                                       disabled={settings.zendeskExists}
                                       className="flex w-full mb-4 pt-2 pb-1 pr-2 pl-2"
                                       onChange={({target: {value}}) => setZendeskApiKey(value)}/>
                                <label htmlFor="openline-zendesk-subdomain" className="mb-2 block text-gray-800">Subdomain</label>
                                <input value={settings.zendeskExists ? "*************" : zendeskSubdomain}
                                       id="openline-zendesk-subdomain"
                                       disabled={settings.zendeskExists}
                                       className="flex w-full mb-4 pt-2 pb-1 pr-2 pl-2"
                                       onChange={({target: {value}}) => setZendeskSubdomain(value)}/>
                                <label htmlFor="openline-zendesk-admin-email" className="mb-2 block text-gray-800">Admin Email</label>
                                <input value={settings.zendeskExists ? "*************" : zendeskAdminEmail}
                                       id="openline-zendesk-admin-email"
                                       disabled={settings.zendeskExists}
                                       className="flex w-full pt-2 pb-1 pr-2 pl-2 mb-3"
                                       onChange={({target: {value}}) => setZendeskAdminEmail(value)}/>
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
                        </div>
                    </article>

                    <article className="flex flex-column" style={{width: '20rem'}}>
                        <h2 className="text-lg text-gray-800 mb-3">Smartsheet</h2>
                        <div className="w-full">
                                <label htmlFor="openline-smartsheet-id" className="mb-2 block text-gray-800">ID</label>
                                <input value={settings.smartSheetExists ? "******************" : smartSheetId}
                                       id="openline-zendesk-api-key"
                                       disabled={settings.smartSheetExists}
                                       className="flex w-full mb-4 pt-2 pb-1 pr-2 pl-2"
                                       onChange={({target: {value}}) => setSmartsheetId(value)}/>
                                <label htmlFor="openline-smartsheet-api-key" className="mb-2 block text-gray-800">API key</label>
                                <input value={settings.smartSheetExists ? "******************" : smartSheetAccessToken}
                                       id="openline-zendesk-api-key"
                                       className="flex w-full mb-4 pt-2 pb-1 pr-2 pl-2"
                                       disabled={settings.smartSheetExists}
                                       onChange={({target: {value}}) => setSmartsheetAccessToken(value)}/>
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
                        </div>
                    </article>

                </div>

                <div className="flex flex-row justify-content-start gap-8 mt-5">

                    <article className="flex flex-column"  style={{width: '20rem'}}>
                        <h2 className="text-lg text-gray-800 mb-3">Jira</h2>
                        <div className="w-full">
                            <label className="mb-2 block text-gray-800">API Token</label>
                            <input value={settings.jiraExists ? "******************" : jiraAPIToken}
                                   disabled={settings.jiraExists}
                                   className="flex w-full mb-4 pt-2 pb-1 pr-2 pl-2"
                                   onChange={({target: {value}}) => setJiraAPIToken(value)}/>

                            <label className="mb-2 block text-gray-800">Domain</label>
                            <input value={settings.jiraExists ? "******************" : jiraDomain}
                                   className="flex w-full mb-4 pt-2 pb-1 pr-2 pl-2"
                                   disabled={settings.jiraExists}
                                   onChange={({target: {value}}) => setJiraDomain(value)}/>

                            <label className="mb-2 block text-gray-800">Email</label>
                            <input value={settings.jiraExists ? "******************" : jiraEmail}
                                   className="flex w-full mb-4 pt-2 pb-1 pr-2 pl-2"
                                   disabled={settings.jiraExists}
                                   onChange={({target: {value}}) => setJiraEmail(value)}/>

                            <div className="flex justify-content-end">
                                {settings.jiraExists ? (
                                    <Button onClick={handleDeleteJiraSettings} mode='danger'>
                                        Revoke
                                    </Button>
                                ) : (
                                    <Button onClick={handleSubmitJiraSettings} mode="primary">
                                        Save
                                    </Button>
                                )}
                            </div>
                        </div>
                    </article>

                    <article className="flex flex-column" style={{width: '20rem'}}>
                        <h2 className="text-lg text-gray-800 mb-3">Trello</h2>
                        <div className="w-full">
                            <label className="mb-2 block text-gray-800">API Token</label>
                            <input value={settings.trelloExists ? "******************" : trelloAPIToken}
                                   disabled={settings.trelloExists}
                                   className="flex w-full mb-4 pt-2 pb-1 pr-2 pl-2"
                                   onChange={({target: {value}}) => setTrelloAPIToken(value)}/>

                            <label className="mb-2 block text-gray-800">API key</label>
                            <input value={settings.trelloExists ? "******************" : trelloAPIKey}
                                   className="flex w-full mb-4 pt-2 pb-1 pr-2 pl-2"
                                   disabled={settings.trelloExists}
                                   onChange={({target: {value}}) => setTrelloAPIKey(value)}/>

                            <div className="flex justify-content-end">
                                {settings.trelloExists ? (
                                    <Button onClick={handleDeleteTrelloSettings} mode='danger'>
                                        Revoke
                                    </Button>
                                ) : (
                                    <Button onClick={handleSubmitTrelloSettings} mode="primary">
                                        Save
                                    </Button>
                                )}
                            </div>
                        </div>
                    </article>

                </div>

            </div>
        </FullScreenModeLayout>
    )
}

export default Settings
