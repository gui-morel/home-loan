import React, { useContext, useState } from "react";
import { Col, Form, FormGroup, Row, Table } from "react-bootstrap";
import InputGroup from 'react-bootstrap/InputGroup';
import { interestPayment, monthlyPayment } from "../LoanFunctions";

type HomeLoanContext = {
    homeLoan: HomeLoanState,
    setHomeLoan: (homeLoanState: HomeLoanState) => void
}

type HomeLoanState = {
    amount: number,
    rate: number,
    duration: number,
    currency: string
}

const defaultHomeLoan: HomeLoanState = {
    amount: 207000,
    rate: 0.0093,
    duration: 300,
    currency: 'USD',
}


const currencyToLocal = (currency: string): string => {
    switch (currency) {
        case 'USD': return 'en-US'
        case 'GBP': return 'en-EN'
        case 'EUR': return 'fr-FR'
        default: return 'fr-FR'
    }
}

const HomeLoanContext = React.createContext<HomeLoanContext>({
    homeLoan: defaultHomeLoan,
    setHomeLoan: () => { }
});

export const HomeLoan = () => {
    const [homeLoan, setHomeLoan] = useState<HomeLoanState>(defaultHomeLoan)

    return <HomeLoanContext.Provider value={({
        homeLoan,
        setHomeLoan
    })}>
        <HomeLoanEditor></HomeLoanEditor>
        <HomeLoanResume></HomeLoanResume>
        <AmortizationSchedule></AmortizationSchedule>
    </HomeLoanContext.Provider>;
}


type AmortizationSchedule = {
    lines: AmortizationLine[]
}

type AmortizationLine = {
    month: number,
    remaning: number,
    interestToDate: number,
    monthlyInterest: number,
    principalPayment: number
    monthlyPayment: number,
    principalToDate: number
}

const computeAmortisationSchedule = (homeLoan: HomeLoanState): AmortizationSchedule => {
    const firstLine = computeAmortizationLine(homeLoan.amount, homeLoan.amount, homeLoan.rate, homeLoan.duration, homeLoan.duration, 0, 0)
    const amortizationLines: AmortizationLine[] = [firstLine, ...computeAmortizationLines(homeLoan, firstLine, firstLine.month - 1)]

    return { lines: amortizationLines };
}

const computeAmortizationLines = (homeLoan: HomeLoanState, previousLine: AmortizationLine, month: number): AmortizationLine[] => {
    if (month <= 0) {
        return []
    }
    const currentLine = computeAmortizationLine(homeLoan.amount, previousLine.remaning, homeLoan.rate, homeLoan.duration, month, previousLine.principalToDate, previousLine.interestToDate)
    return [currentLine, ...computeAmortizationLines(homeLoan, currentLine, month - 1)]
}

const computeAmortizationLine = (loanAmount: number, outstandingLoanBalance: number, loanRate: number, mensualityCount: number, month: number, principalToDate: number, interestToDate: number): AmortizationLine => {
    const mensuality = computeMensuality(loanAmount, outstandingLoanBalance, loanRate, mensualityCount)

    return ({
        month: month,
        remaning: outstandingLoanBalance - mensuality.principalPayment,
        monthlyInterest: mensuality.monthlyInterest,
        principalPayment: mensuality.principalPayment,
        monthlyPayment: mensuality.principalPayment + mensuality.monthlyInterest,
        principalToDate: principalToDate + mensuality.principalPayment,
        interestToDate: interestToDate + mensuality.monthlyInterest,
    })
}

const computeMensuality = (loanAmount: number, outstandingLoanBalance: number, loadRate: number, mensualityCount: number) => {
    const mensuality = monthlyPayment(loanAmount, loadRate, mensualityCount)
    const interest = interestPayment(outstandingLoanBalance, loadRate, 12)

    return {
        monthlyInterest: interest,
        principalPayment: mensuality - interest,
    }
}

const AmortizationSchedule = () => {
    const { homeLoan } = useContext(HomeLoanContext)

    return <Table striped bordered hover>
        <thead>
            <tr>
                <th>Month</th>
                <th>Outstanding Loan Balance</th>
                <th>Monthly Payment (Principal + Interest)</th>
                <th>Principal to Date</th>
                <th>Interest to Date</th>
            </tr>
        </thead>
        <tbody>
            {computeAmortisationSchedule(homeLoan).lines.map(line => <tr key={line.month}>
                <td>
                    {line.month}
                </td>
                <td>
                    {line.remaning.toLocaleString(currencyToLocal(homeLoan.currency), { style: 'currency', currency: homeLoan.currency })}
                </td>
                <td>
                    {`${line.monthlyPayment.toLocaleString(currencyToLocal(homeLoan.currency), { style: 'currency', currency: homeLoan.currency })} (${line.principalPayment.toLocaleString(currencyToLocal(homeLoan.currency), { style: 'currency', currency: homeLoan.currency })} + ${line.monthlyInterest.toLocaleString(currencyToLocal(homeLoan.currency), { style: 'currency', currency: homeLoan.currency })})`}
                </td>
                <td>
                    {line.principalToDate.toLocaleString(currencyToLocal(homeLoan.currency), { style: 'currency', currency: homeLoan.currency })}
                </td>
                <td>
                    {line.interestToDate.toLocaleString(currencyToLocal(homeLoan.currency), { style: 'currency', currency: homeLoan.currency })}
                </td>
            </tr>)}
        </tbody>
    </Table>
}

const HomeLoanResume = () => {
    const { homeLoan } = useContext(HomeLoanContext)

    return <>
        <FormGroup as={Row} className="mb-3 mt-3">
            <Form.Label sm={2} column htmlFor="loan-amount">Amount</Form.Label>
            <Col sm={10}>
                <Form.Control id="loan-amount" disabled type="text" value={homeLoan.amount.toLocaleString(currencyToLocal(homeLoan.currency), { style: 'currency', currency: homeLoan.currency })} />
            </Col>
        </FormGroup>

        <FormGroup as={Row} className="mb-3">
            <Form.Label sm={2} column htmlFor="loan-rate">Rate</Form.Label>
            <Col sm={10}>
                <Form.Control id="loan-rate" disabled type="text" value={`${(homeLoan.rate * 100).toFixed(2)} %`} />
            </Col>
        </FormGroup>

        <FormGroup as={Row} className="mb-3">
            <Form.Label sm={2} column htmlFor="loan-duration">Month Count</Form.Label>
            <Col sm={10}>
                <Form.Control id="loan-duration" disabled type="text" value={homeLoan.duration} />
            </Col>
        </FormGroup>

        <FormGroup as={Row} className="mb-3">
            <Form.Label sm={2} column htmlFor="loan-cost">Loan Cost</Form.Label>
            <Col sm={10}>
                <Form.Control id="loan-duration" disabled type="text" value={(monthlyPayment(homeLoan.amount, homeLoan.rate, homeLoan.duration) * homeLoan.duration - homeLoan.amount).toLocaleString(currencyToLocal(homeLoan.currency), { style: 'currency', currency: homeLoan.currency })} />
            </Col>
        </FormGroup>
    </>
}

const HomeLoanEditor = () => {
    const { homeLoan, setHomeLoan } = useContext(HomeLoanContext)

    return <Row>
        <Col md="6">
            <Form.Label htmlFor="loan-amount" visuallyHidden>Amount</Form.Label>
            <Form.Control id="loan-amount" type="text" onChange={event => setHomeLoan({ ...homeLoan, amount: Number(event.target.value) })} placeholder={(defaultHomeLoan.amount).toLocaleString(defaultHomeLoan.currency)} />
        </Col>
        <Col md="2">
            <Form.Label htmlFor="loan-currency" visuallyHidden>Amount</Form.Label>
            <Form.Select id="loan-currency" onChange={event => setHomeLoan({ ...homeLoan, currency: event.target.value })}>
                <option value="USD">$</option>
                <option value="EUR">€</option>
                <option value="GBP">£</option>
            </Form.Select>
        </Col>
        <Col md="2">
            <Form.Label htmlFor="loan-rate" visuallyHidden>Rate</Form.Label>
            <InputGroup>
                <Form.Control id="loan-rate" type="text" onChange={event => setHomeLoan({ ...homeLoan, rate: Number(event.target.value) / 100 })} placeholder={(defaultHomeLoan.rate * 100).toFixed(2)} />
                <InputGroup.Text>%</InputGroup.Text>
            </InputGroup>
        </Col>
        <Col md="2">
            <Form.Label htmlFor="loan-duration" visuallyHidden>Duration in Year</Form.Label>
            <InputGroup>
                <Form.Control id="loan-duration" type="text" onChange={event => setHomeLoan({ ...homeLoan, duration: Number(event.target.value) * 12 })} placeholder={(defaultHomeLoan.duration / 12).toFixed(0)} />
                <InputGroup.Text>Years</InputGroup.Text>
            </InputGroup>
        </Col>
    </Row>
}
