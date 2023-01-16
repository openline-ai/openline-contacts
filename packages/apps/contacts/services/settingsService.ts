import {HubspotSettings, ZendeskSettings} from "../models/settings";
import axios from "axios";

export function UpdateHubspotSettings(data: HubspotSettings): Promise<HubspotSettings> {
    return new Promise((resolve, reject) => axios.post(`/settings-api/settings/hubspot`, data).then((response: any) => {
        if (response) {
            resolve(response);
        } else {
            reject(response.error);
        }
    }).catch(reason => {
        reject(reason);
    }));
}
export function UpdateZendeskSettings(data: ZendeskSettings): Promise<ZendeskSettings> {
    return new Promise((resolve, reject) => axios.post(`/settings-api/settings/zendesk`, data).then((response: any) => {
        if (response) {
            resolve(response);
        } else {
            reject(response.error);
        }
    }).catch(reason => {
        reject(reason);
    }));
}
