import {HomeLoanState} from "./HomeLoan";
import {useLocation, useSearchParams} from "react-router-dom";
import React, {useEffect} from "react";
import {fromState, toState} from "./toState";

type Props = {
    currentState: HomeLoanState
    loadState: (state: HomeLoanState) => void
}

export const HomeLoanUrlLoader = ({loadState, currentState}: Props) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlSearchParams = React.useMemo(() => new URLSearchParams(searchParams), []);
    useEffect(() => {
        const state = toState(urlSearchParams);
        if (state) {
            loadState(state)
        }
    }, []);

    useEffect(() => {
        setSearchParams(fromState(currentState))
    }, [currentState]);
    return <></>
}