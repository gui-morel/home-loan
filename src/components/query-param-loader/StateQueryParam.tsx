import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

type QueryParamToState<E> = (queryParam: URLSearchParams, defaultState: E) => E
type StateToQueryParam<E> = (stats: E) => URLSearchParams

export const StateQueryParam = <E, >({currentState, loadState, toQueryParam, toState}: {
    currentState: E,
    loadState: (state: E) => void,
    toState: QueryParamToState<E>,
    toQueryParam: StateToQueryParam<E>
}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlSearchParams = React.useMemo(() => new URLSearchParams(searchParams), []);
    useEffect(() => {
        const state = toState(urlSearchParams, currentState);
        if (state) {
            loadState(state)
        }
    }, []);

    useEffect(() => {
        setSearchParams(toQueryParam(currentState))
    }, [currentState]);
    return <></>
}