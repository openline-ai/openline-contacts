export type HubspotSettings = {
    hubspotPrivateAppKey: string | undefined | null
}
export type SmartsheetSettings = {
    smartSheetId: string | undefined | null,
    smartSheetAccessToken: string | undefined | null,
}

export type ZendeskSettings = {
    zendeskAPIKey: string | undefined | null
    zendeskSubdomain: string | undefined | null
    zendeskAdminEmail: string | undefined | null
}


export type Settings = {
    hubspotExists:boolean,
    zendeskExists: boolean,
    smartSheetExists: boolean
}
