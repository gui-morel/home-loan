import { HomeLoanState } from "./HomeLoan";

const isValidQueryParam = (urlSearchParams: URLSearchParams): boolean => {
    return urlSearchParams.has("amount")
        && urlSearchParams.has("currency")
        && urlSearchParams.has("duration")
        && urlSearchParams.has("rate")
        && urlSearchParams.has("startDate")
}

export const toState = (urlSearchParams: URLSearchParams): HomeLoanState | undefined => {
    if (!isValidQueryParam(urlSearchParams)) {
        return undefined;
    }
    return {
        amount: Number(urlSearchParams.get("amount")),
        currency: urlSearchParams.get("currency")!,
        duration: Number(urlSearchParams.get("duration")),
        rate: Number(urlSearchParams.get("rate")),
        startDate: new Date(Number(urlSearchParams.get("startDate")))
    };
}

export const fromState = (homeLoanState: HomeLoanState): URLSearchParams => {
    console.log("fromState", homeLoanState)
    return new URLSearchParams([
        ["amount", `${homeLoanState.amount}`],
        ["currency", `${homeLoanState.currency}`],
        ["duration", `${homeLoanState.duration}`],
        ["rate", `${homeLoanState.rate}`],
        ["startDate", `${homeLoanState.startDate.getTime()}`],
    ])

}