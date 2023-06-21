import { useEffect, useState } from "react";

interface HistoryHookState<E> {
    history: { [key: string]: E };
}

interface HistoryHookActions<E> {
    save: (id: string, state: E) => void;
    load: (id: string) => E | undefined;
    reset: () => void;
}

export const useHistoryState = <E>(historyName: string): [HistoryHookState<E>, HistoryHookActions<E>] => {
    const savedInBrowser = localStorage.getItem(historyName)
    const defaultValue = savedInBrowser && JSON.parse(savedInBrowser) || { history: {} }

    const [historyState, setHistoryState] = useState<HistoryHookState<E>>(defaultValue)

    useEffect(() => {
        localStorage.setItem(historyName, JSON.stringify(historyState));
    }, [historyState]);

    const actions: HistoryHookActions<E> = {
        save: (id: string, state: E) => {
            setHistoryState({ history: { ...historyState.history, [id]: state } })
        },
        load: function (id: string): E | undefined {
            return historyState.history[id]
        },
        reset: () => {
            setHistoryState({ history: {} })
        }
    }


    return [historyState, actions];
}