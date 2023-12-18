import React, {useState} from "react";
import {Button, Form, InputGroup, Offcanvas, Stack} from "react-bootstrap";
import {useHistoryState} from "./History";

const HistorySaver = ({onSave}: { onSave: (stateName: string) => void }) => {
    const [currentSaveName, setCurrentSaveName] = useState<string>("")
    const handleSave = () => {
        if (currentSaveName === "") {
            return
        }
        onSave(currentSaveName)
        setCurrentSaveName("")
    }

    return <>
        <Form.Control
            placeholder="My simulation 207K..."
            value={currentSaveName}
            onChange={event => setCurrentSaveName(event.target.value)}
        />
        <Button variant="outline-secondary" onClick={handleSave}>Save</Button>
    </>;
}

export const StateHistory = ({children, historyName}: { children: JSX.Element, historyName: string }) => {

    const [history, historyActions] = useHistoryState<any>(historyName)
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    var childrenRef: any;
    const childrenWithRef = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(children, {
                ref: (ref: any) => (childrenRef = ref)
            });
        }
        return child;
    });

    const loadFromHistory = (id: string) => {
        const laodedState = historyActions.load(id)
        childrenRef?.loadState(laodedState)
    };

    const reset = () => {
        historyActions.reset()
    }
    const saveState = (currentSaveName: string) => {
        const stateToSave = childrenRef?.getState()
        stateToSave && historyActions.save(currentSaveName, stateToSave)
    };

    return <>
        <Button variant="primary" className="fixed-bottom m-3" onClick={handleShow}>Save / History</Button>
        <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Save / History</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <InputGroup className="mb-3">
                    <HistorySaver onSave={saveState}/>
                </InputGroup>

                <Stack gap={3}>
                    {Object.keys(history.history).map(saveId =>

                        <InputGroup className="mb-3" key={saveId}>
                            <Form.Control
                                defaultValue={saveId}
                                disabled
                            />
                            <Button variant="outline-secondary" onClick={_ => loadFromHistory(saveId)}>Load</Button>
                        </InputGroup>)}

                </Stack>
                <Button onClick={reset}>Delete all</Button>
            </Offcanvas.Body>
        </Offcanvas>
        {childrenWithRef}
    </>
}


export const EasyStateHistory = <E, >({historyName, currentState, loadState}: {
    historyName: string,
    currentState: E,
    loadState: (state: E) => void
}) => {

    const [history, historyActions] = useHistoryState<E>(historyName)
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const saveState = (currentSaveName: string) => {
        currentState && historyActions.save(currentSaveName, currentState)
    };

    const loadFromHistory = (id: string) => {
        const state = historyActions.load(id)
        state && loadState(state)
    };

    return <>
        <Button variant="primary" className="fixed-bottom m-3" onClick={handleShow}>Save / History</Button>
        <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Save / History</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <InputGroup className="mb-3">
                    <HistorySaver onSave={saveState}/>
                </InputGroup>

                <Stack gap={3}>
                    {Object.keys(history.history).map(saveId =>

                        <InputGroup className="mb-3" key={saveId}>
                            <Form.Control
                                defaultValue={saveId}
                                disabled
                            />
                            <Button variant="outline-secondary" onClick={_ => loadFromHistory(saveId)}>Load</Button>
                        </InputGroup>)}

                </Stack>
                <Button onClick={() => historyActions.reset()}>Delete all</Button>
            </Offcanvas.Body>
        </Offcanvas>
    </>
}