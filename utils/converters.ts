import {Filter} from "./pagination";

export function MapGridFilters(fitlers: Filter[]) {
    var where = undefined as any;
    switch (fitlers.length) {
        case 0: {
            where = undefined;
            break;
        }
        case 1: {
            where = {
                "filter": fitlers[0]
            };
            break;
        }
        default: {
            where = {
                "AND": []
            };
            fitlers.forEach((f: any) => {
                where["AND"].push({
                    "filter": f
                })
            })
        }
    }
    return where;
}


