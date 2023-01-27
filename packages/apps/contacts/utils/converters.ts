import {Filter} from "./pagination";

export function MapGridFilters(fitlers: Filter[]) {
    if (!fitlers) return undefined;

    var where = undefined as any;
    switch (fitlers.length) {
        case 0: {
            where = undefined;
            break;
        }
        case 1: {
            where = {
                "filter": {
                    property: fitlers[0].property,
                    value: fitlers[0].value,
                    operation: fitlers[0].operation
                }
            };
            break;
        }
        default: {
            const AND_filters = fitlers
                    .filter(data => data.condition === "AND")
                    .map(({condition, ...data}) => ({"filter": data}));
            const OR_filters = fitlers
                    .filter(data => data.condition === "OR")
                    .map(({condition, ...data}) => ({"filter": data}));

            if (AND_filters.length) {
                where = {
                    "AND": AND_filters
                };
            }

            if (OR_filters.length) {
                where = {
                    "OR": OR_filters
                };
            }

            if (OR_filters.length && AND_filters.length) {
                where = {
                    "OR": OR_filters,
                    "AND": AND_filters
                };
            }

        }
    }
    return where;
}


