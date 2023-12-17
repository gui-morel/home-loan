import {Movement} from "./formula";
import React, {useEffect, useRef, useState} from "react";
import {Button, FloatingLabel, Form, Stack, Table} from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import {Calculator, CheckIcon, EditIcon, PlusIcon, TrashIcon, Undo2} from "lucide-react";
import {DietzMethod} from "./DietzMethod";

export type DietzState = {
    endDate: Date
    flow: Movement[]
    currentCapital: number
}
const defaultDietz: DietzState = {
    endDate: new Date('01/01/2021'),
    flow: [
        {amount: 100000, executionDate: new Date('01/01/2019')},
        {amount: -50000, executionDate: new Date('05/16/2019')},
        {amount: 150000, executionDate: new Date('07/29/2019')},
    ],
    currentCapital: 220000,
}

const InvestmentInput = ({updateInvestment}: { updateInvestment: (state: DietzState) => void }) => {
    const [investmentState, setInvestmentState] = useState(defaultDietz)
    const [autoCompute, setAutoCompute] = useState(false)

    const endDateIsToday = () => {
        const today = new Date();
        setInvestmentState({...investmentState, endDate: today});
        (endDateInput.current as any).value = today.toLocaleDateString("en-CA");
    }

    const endDateInput = useRef(null)

    useEffect(() => {
        autoCompute && updateInvestment(investmentState)
    }, [autoCompute, investmentState])

    return (
        <Stack gap={3}>
            <FloatingLabel
                controlId="floatingInput"
                label="Current Capital"
            >
                <Form.Control defaultValue={investmentState.currentCapital}
                              onBlur={e => setInvestmentState({
                                  ...investmentState,
                                  currentCapital: Number(e.target.value)
                              })}
                />
            </FloatingLabel>
            <InputGroup>
                <Button onClick={endDateIsToday}>Today</Button>
                <FloatingLabel controlId="floatingDate" label="End Date">
                    <Form.Control ref={endDateInput} size="sm" type="date"
                                  defaultValue={investmentState.endDate.toLocaleDateString("en-CA")}
                                  onBlur={e => setInvestmentState({
                                      ...investmentState,
                                      endDate: (e.target as any).valueAsDate
                                  })}/>
                </FloatingLabel>
            </InputGroup>
            <MovementTable updateMovements={movements => setInvestmentState({...investmentState, flow: movements})}/>
            <Stack direction="horizontal" className="d-flex justify-content-between">
                <Form.Check
                    type="switch"
                    id="auto-compute-switch"
                    label="Auto Compute"
                    checked={autoCompute}
                    onChange={e => setAutoCompute(e.target.checked)}
                />
                <Button className="col-10" variant="success"
                        disabled={autoCompute}
                        onClick={_ => updateInvestment(investmentState)}>Compute <Calculator/></Button>
            </Stack>
        </Stack>
    );
}

const MovementTable = ({updateMovements}: { updateMovements: (movements: Movement[]) => void }) => {
    const [state, setState] = useState(defaultDietz.flow.map((movement, index) => ({movement, key: index})))
    const [nextKey, setNextKey] = useState(defaultDietz.flow.length)

    const addLine = () => {
        setState([...state, {movement: {amount: 0, executionDate: new Date()}, key: nextKey + 1}]);
        setNextKey(nextKey + 1);
    }
    const deleteLine = (indexToDel: number) => {
        setState(state.filter((_, index) => index != indexToDel));
    }
    const updateMovement = (indexToUpdate: number, movement: Movement) => {
        setState(
            state.map((value, index) =>
                index == indexToUpdate ? {movement: movement, key: value.key} : value)
        );
    }

    useEffect(() => {
        updateMovements(state.map(item => item.movement))
    }, [state])

    return <>
        <Table striped>
            <thead>
            <tr>
                <th>#</th>
                <th>Execution Date</th>
                <th>Amount</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {
                state.sort((a, b) => a.movement.executionDate.getTime() - b.movement.executionDate.getTime())
                    .map(({key, movement}, index) => <MovementLine key={key} index={index} movement={movement}
                                                                   deleteLine={() => deleteLine(index)}
                                                                   updateLine={newMovement => updateMovement(index, newMovement)}/>)
            }
            </tbody>
        </Table>
        <Button onClick={addLine}><PlusIcon/></Button>
    </>
}

const MovementLine = ({index, movement, deleteLine, updateLine}: {
    index: number,
    movement: Movement,
    deleteLine: () => void,
    updateLine: (movement: Movement) => void
}) => {
    const [editing, setEditing] = useState(false)

    const [amount, setAmount] = useState(movement.amount)
    const [executionDate, setExecutionDate] = useState(movement.executionDate)

    return <tr>
        <td className="col-1">{index + 1}</td>
        {
            editing ?
                <td className="col-3">
                    <Form.Control size="sm" type="date" defaultValue={executionDate.toLocaleDateString("en-CA")}
                                  onBlur={e => setExecutionDate((e.target as any).valueAsDate)}/>
                </td> :
                <td className="col-3">{movement.executionDate.toLocaleDateString()}</td>
        }
        {
            editing ?
                <td className="col-4">
                    <Form.Control size="sm" placeholder="15000" defaultValue={amount}
                                  onBlur={e => setAmount(Number(e.target.value))}/>
                </td> :
                <td className={"col-4 " + (movement.amount > 0 ? "bg-success" : movement.amount != 0 && "bg-danger")}>{movement.amount.toLocaleString()}</td>
        }
        <td className="d-flex justify-content-center gap-3">
            {
                editing ? <>
                    <Button variant="success" size="sm" onClick={_ => {
                        updateLine({amount, executionDate})
                        setEditing(false)
                        console.log("updateing line", amount, executionDate)
                    }}>
                        <CheckIcon/>
                    </Button>
                    <Button variant="info" size="sm" onClick={_ => {
                        setAmount(movement.amount)
                        setExecutionDate(movement.executionDate)
                        setEditing(false)
                    }}>
                        <Undo2/>
                    </Button>
                    <Button variant="danger" size="sm" onClick={deleteLine}>
                        <TrashIcon/>
                    </Button>
                </> : <>
                    <Button variant="info" size="sm" onClick={_ => setEditing(true)}>
                        <EditIcon/>
                    </Button>
                </>
            }
        </td>
    </tr>;
}


export const Investment = () => {
    const [dietzState, setDietzState] = useState(defaultDietz)
    console.log(dietzState)
    return <div className="col-6 d-flex flex-column align-items-center">
        <InvestmentInput updateInvestment={setDietzState}/>
        <DietzMethod {...dietzState}/>
    </div>
}
