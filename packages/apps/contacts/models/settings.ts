export type HubspotSettings = {
    hubspotPrivateAppKey: string | undefined | null
}

export type ZendeskSettings = {
    zendeskAPIKey: string | undefined | null
    zendeskSubdomain: string | undefined | null
    zendeskAdminEmail: string | undefined | null
}


export type Settings = HubspotSettings & ZendeskSettings
