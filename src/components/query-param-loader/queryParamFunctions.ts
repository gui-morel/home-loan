export const toState = <E extends Object>(urlSearchParams: URLSearchParams, defaultState: E): E => {
    const entries = Object.entries(defaultState)
        .map(([key, defaultValue]) => [key, mapFromStringOrDefault(urlSearchParams.get(key), defaultValue)]);
    return Object.fromEntries(entries)
}

export const toQueryParam = <E extends Object>(state: E) => {
    const queryParamInit = Object.entries(state)
        .map(([key, value]) => [key, mapToString(value)]);
    return new URLSearchParams(queryParamInit);
}

const mapToString = (object: any) => {
    switch (object.constructor) {
        case Date:
            return object.getTime();
        default:
            return object;
    }
}

const mapFromStringOrDefault = (valueToMap: any, defaultValue: any) => {
    if (!valueToMap) {
        return defaultValue
    }
    switch (defaultValue.constructor) {
        case Number:
            return Number(valueToMap)
        case Date:
            return new Date(Number(valueToMap));
        default:
            return defaultValue;
    }
}