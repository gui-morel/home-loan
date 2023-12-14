import React, { useState } from "react";
import { Button, Form, InputGroup, Offcanvas, Stack } from "react-bootstrap";
import { useHistoryState } from "./History";

export const StateHistory = ({ children, historyName }: { children: JSX.Element, historyName: string }) => {

    const [history, historyActions] = useHistoryState<any>(historyName)
    const [currentSaveName, setCurrentSaveName] = useState<string>("")
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
    const saveState = () => {
        const stateToSave = childrenRef?.getState()
        stateToSave && historyActions.save(currentSaveName, stateToSave)
        stateToSave && setCurrentSaveName("")
    };

    return <>
        <Button variant="primary" className="fixed-bottom m-3" onClick={handleShow}>Save / History</Button>
        <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Save / History</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <InputGroup className="mb-3">
                    <Form.Control
                        placeholder="My simulation 207K..."
                        value={currentSaveName}
                        onChange={event => setCurrentSaveName(event.currentTarget.value)}
                    />
                    <Button variant="outline-secondary" onClick={saveState}>Save</Button>
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