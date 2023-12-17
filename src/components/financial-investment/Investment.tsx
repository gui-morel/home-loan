import {contributionWeightedOverTime, gainsOrLoss, modifiedDietzMethod, Movement} from "./formula";
import React, {useState} from "react";
import {Button, FloatingLabel, Form, Stack, Table} from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import {CheckIcon, EditIcon, MinusIcon, PlusIcon} from "lucide-react";

type DietzState = {
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

const InvestmentInput = () => {
    const [investmentState, setInvestmentState] = useState(defaultDietz)

    const endDateIsToday = () => {
        setInvestmentState({...investmentState, endDate: new Date()})
    }

    return (
        <Stack gap={3}>
            <FloatingLabel
                controlId="floatingInput"
                label="Current Capital"
            >
                <Form.Control type="email" placeholder="15000"
                              defaultValue={investmentState.currentCapital.toLocaleString()}/>
            </FloatingLabel>
            <InputGroup>
                <Button onClick={endDateIsToday}>Today</Button>
                <FloatingLabel controlId="floatingDate" label="End Date">
                    <Form.Control type="date" value={investmentState.endDate.toLocaleDateString("en-CA")}/>
                </FloatingLabel>
            </InputGroup>
            <MovementTable/>
        </Stack>
    );
}

const MovementTable = () => {
    const [movements, setMovements] = useState(defaultDietz.flow.map((movement, index) => ({movement, key: index})))
    const [nextKey, setNextKey] = useState(defaultDietz.flow.length)

    const addLine = () => {
        setMovements([...movements, {movement: {amount: 0, executionDate: new Date()}, key: nextKey + 1}]);
        setNextKey(nextKey + 1);
    }
    const deleteLine = (indexToDel: number) =>
        setMovements(movements.filter((_, index) => index != indexToDel))
    const updateMovement = (indexToUpdate: number, movement: Movement) =>
        setMovements(
            movements.map((value, index) =>
                index == indexToUpdate ? {
                    movement: movement,
                    key: value.key
                } : value)
        )

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
                movements.sort((a, b) => a.movement.executionDate.getTime() - b.movement.executionDate.getTime())
                    .map(({key, movement}, index) => <MovementLine key={key} index={index} movement={movement}
                                                                   deleteLine={() => deleteLine(index)}
                                                                   updateMovement={newMovement => updateMovement(index, newMovement)}/>)
            }
            </tbody>
        </Table>
        <Button onClick={addLine}><PlusIcon/></Button>
    </>
}

const MovementLine = ({index, movement, deleteLine, updateMovement}: {
    index: number,
    movement: Movement,
    deleteLine: () => void,
    updateMovement: (movement: Movement) => void
}) => {
    const [editing, setEditing] = useState(false)

    const [amount, setAmount] = useState(movement.amount)
    const [executionDate, setExecutionDate] = useState(movement.executionDate)

    return <tr>
        <td className="col-1">{index + 1}</td>
        <td className="col-3">{movement.executionDate.toLocaleDateString()}</td>
        <td className={"col-4 " + (movement.amount > 0 ? "bg-success" : movement.amount != 0 && "bg-danger")}>{movement.amount.toLocaleString()}</td>
        <td className="d-flex justify-content-center gap-3">
            {
                editing ? <>
                    <Button variant="success" size="sm" onClick={_ => {
                        updateMovement({amount, executionDate})
                        setEditing(false)
                    }}>
                        <CheckIcon/>
                    </Button>
                    <Button variant="danger" size="sm" onClick={deleteLine}>
                        <MinusIcon/>
                    </Button>
                </> : <Button variant="info" size="sm" onClick={_ => setEditing(true)}>
                    <EditIcon/>
                </Button>
            }
        </td>
    </tr>;
}


const DietzMethod = ({endDate, flow, currentCapital}: DietzState) => {
    const performance = modifiedDietzMethod(
        gainsOrLoss(currentCapital, flow.map(it => it.amount)),
        contributionWeightedOverTime(endDate, flow)
    );
    return <div>
        <figure className="text-center m-3">
            <blockquote className="blockquote">
                <p>The {endDate.toLocaleDateString()} your performance is {(performance * 100).toFixed(2)}%</p>
            </blockquote>
            <figcaption className="blockquote-footer">
                Formula: <a href="https://en.wikipedia.org/wiki/Modified_Dietz_method">Modified Dietz method</a>
            </figcaption>
        </figure>
    </div>
}

export const Investment = () => {
    const [dietzState, setDietzState] = useState(defaultDietz)
    return <div className="col-6 d-flex flex-column align-items-center">
        <InvestmentInput/>
        <DietzMethod {...dietzState}/>
    </div>
}
