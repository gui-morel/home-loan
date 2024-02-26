import {Movement} from "./formula";
import React, {useRef, useState} from "react";
import {Button, FloatingLabel, Form, Stack, Table} from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import {CheckIcon, EditIcon, PlusIcon, TrashIcon, Undo2} from "lucide-react";
import {DietzMethod, DietzProps} from "./DietzMethod";
import {EasyStateHistory} from "../StateHistory";
import {AbsolutePerformance} from "./AbsolutePerformance";

const defaultDietz: DietzProps = {
    endDate: new Date('01/01/2021').getTime(),
    flow: [
        {id: 1, amount: 100000, executionDate: new Date('01/01/2019').getTime()},
        {id: 2, amount: -50000, executionDate: new Date('05/16/2019').getTime()},
        {id: 3, amount: 150000, executionDate: new Date('07/29/2019').getTime()},
    ],
    currentCapital: 220000,
}

const InvestmentInput = ({updateInvestment, state}: {
    state: InvestmentState,
    updateInvestment: (state: InvestmentState) => void
}) => {
    const endDateIsToday = () => {
        const today = new Date();
        updateInvestment({...state, endDate: today.getTime()});
        (endDateInput.current as any).value = today.toLocaleDateString("en-CA");
    }

    const endDateInput = useRef(null)

    return (
        <Stack gap={3}>
            <FloatingLabel
                controlId="floatingInput"
                label="Current Capital"
            >
                <Form.Control value={state.currentCapital}
                              onChange={e => updateInvestment({
                                  ...state,
                                  currentCapital: Number(e.target.value)
                              })}
                />
            </FloatingLabel>
            <InputGroup>
                <Button onClick={endDateIsToday}>Today</Button>
                <FloatingLabel controlId="floatingDate" label="End Date">
                    <Form.Control ref={endDateInput} size="sm" type="date"
                                  value={new Date(state.endDate).toLocaleDateString("en-CA")}
                                  onChange={e => updateInvestment({
                                      ...state,
                                      endDate: (e.target as any).valueAsDate.getTime()
                                  })}/>
                </FloatingLabel>
            </InputGroup>
            <MovementTable movements={state.flow}
                           updateMovements={movements => updateInvestment({...state, flow: [...movements]})}/>
        </Stack>
    );
}

const MovementTable = ({updateMovements, movements}: {
    updateMovements: (movements: Movement[]) => void,
    movements: Movement[]
}) => {
    // const [state, setState] = useState(movements.map((movement, index) => ({movement, key: index})))
    const [nextKey, setNextKey] = useState(movements.length)

    const addLine = () => {
        const newState = [...movements, {amount: 0, executionDate: Date.now(), id: Math.random()}];
        setNextKey(nextKey + 1);
        updateMovements(newState)
    }

    const clearLines = () => {
        setNextKey(0);
        updateMovements([])
    }

    const deleteLine = (deletedId: number) =>
        updateMovements(movements.filter(movement => movement.id != deletedId))

    const updateMovement = (movement: Movement) =>
        updateMovements(movements.map(value => value.id == movement.id ? movement : value))

    return <>
        <Button onClick={addLine}><PlusIcon/></Button>
        <Button variant="danger" onClick={clearLines}><TrashIcon/></Button>
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
                movements.sort((a, b) => a.executionDate - b.executionDate)
                    .map((movement, index) => <MovementLine key={movement.id} index={index} movement={movement}
                                                   deleteLine={() => deleteLine(movement.id)}
                                                   updateLine={newMovement => updateMovement(newMovement)}/>)
            }
            </tbody>
        </Table>
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
                    <Form.Control size="sm" type="date"
                                  defaultValue={new Date(executionDate).toLocaleDateString("en-CA")}
                                  onBlur={e => setExecutionDate((e.target as any).valueAsDate?.getTime())}/>
                </td> :
                <td className="col-3">{new Date(movement.executionDate).toLocaleDateString()}</td>
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
                        updateLine({amount, executionDate: executionDate, id: movement.id})
                        setEditing(false)
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

type InvestmentState = {
    endDate: number
    flow: Movement[]
    currentCapital: number
}


export const Investment = () => {
    const [investmentState, setInvestmentState] = useState<InvestmentState>(defaultDietz)

    const updateInvestment = (investment: DietzProps) => {
        setInvestmentState({...investment, flow: [...investment.flow]})
    }

    return <>
        <EasyStateHistory currentState={investmentState}
                          loadState={state => setInvestmentState(state)}
                          historyName="investement"/>
        <InvestmentInput state={investmentState}
                         updateInvestment={updateInvestment}/>
        <DietzMethod {...investmentState}/>
        <AbsolutePerformance investedCapital={amounts(investmentState.flow)}
                             actualCapital={investmentState.currentCapital}/>
    </>
}

const amounts = (flow: Movement[]) => flow.reduce((acc, flow) => acc + flow.amount, 0)
