import {HubspotSettings, ZendeskSettings} from "../models/settings";
import axios from "axios";
export function GetSettings(): Promise<any> {

    return new Promise((resolve, reject) => axios.get('/sa/settings/').then(({data, error}: any) => {
        if (data) {
            resolve(data);
        } else {
            reject(error);
        }
    }).catch(reason => {
        reject(reason);
    }));
}
export function UpdateHubspotSettings(data: HubspotSettings): Promise<HubspotSettings> {
    return new Promise((resolve, reject) => axios.post(`/sa/settings/hubspot`, data).then((response: any) => {

        if (response.data) {
            resolve(response.data);
        } else {
            reject(response.error);
        }
    }).catch(reason => {
        reject(reason);
    }));
}
export function UpdateZendeskSettings(data: ZendeskSettings): Promise<ZendeskSettings> {
    return new Promise((resolve, reject) => axios.post(`/sa/settings/zendesk`, data).then((response: any) => {
        if (response.data) {
            resolve(response.data);
        } else {
            reject(response.error);
        }
    }).catch(reason => {
        reject(reason);
    }));
}

