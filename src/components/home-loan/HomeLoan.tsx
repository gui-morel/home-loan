import moment from "moment";
import React, { useImperativeHandle, useState } from "react";
import { Accordion, Col, Form, FormGroup, Row, Table } from "react-bootstrap";
import InputGroup from 'react-bootstrap/InputGroup';
import { interestPayment, monthlyPayment } from "../../LoanFunctions";
import { EasyStateHistory } from "../StateHistory";
import { StateQueryParam } from "../query-param-loader/StateQueryParam";
import { toQueryParam, toState } from "../query-param-loader/queryParamFunctions";
import { useTranslation } from "react-i18next";

export type HomeLoanState = {
    name: string,
    amount: number,
    rate: number,
    duration: number,
    currency: string,
    startDate: Date
}

const defaultHomeLoan: HomeLoanState = {
    name: "Loan name",
    amount: 100000,
    rate: 6.66,
    duration: 240,
    currency: 'EUR',
    startDate: new Date(1673732484000)
}

type Loans = HomeLoanState[]


const currencyToLocal = (currency: string): string => {
    switch (currency) {
        case 'USD':
            return 'en-US'
        case 'GBP':
            return 'en-EN'
        case 'EUR':
            return 'fr-FR'
        default:
            return 'fr-FR'
    }
}

export const HomeLoan = React.forwardRef((_, ref) => {
    const [homeLoan, setHomeLoan] = useState<HomeLoanState>(defaultHomeLoan)
    const {i18n, t} = useTranslation();

    useImperativeHandle(ref, () => ({
        loadState: (state: HomeLoanState) => {
            setHomeLoan(state)
        },
        getState: () => {
            return homeLoan
        }
    }));

    return <>
        <StateQueryParam currentState={homeLoan} loadState={state => setHomeLoan(state)} toState={toState}
                         toQueryParam={toQueryParam}></StateQueryParam>
        <EasyStateHistory currentState={homeLoan}
                          loadState={state => setHomeLoan(state)}
                          historyName="homeloan"/>
        <HomeLoanEditor homeloan={homeLoan} setHomeloan={setHomeLoan}></HomeLoanEditor>
        <HomeLoanResume homeloan={homeLoan}></HomeLoanResume>
        <Accordion defaultActiveKey={homeLoan.name}>
            <Accordion.Item eventKey={homeLoan.name}>
                <Accordion.Header>{homeLoan.name}</Accordion.Header>
                <Accordion.Body>
                    <AmortizationSchedule homeloan={homeLoan}></AmortizationSchedule>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    </>
});


type AmortizationSchedule = {
    lines: AmortizationLine[]
}

type AmortizationLine = {
    date: Date,
    month: number,
    remaning: number,
    interestToDate: number,
    monthlyInterest: number,
    principalPayment: number
    monthlyPayment: number,
    principalToDate: number
}

const computeAmortisationSchedule = (homeLoan: HomeLoanState): AmortizationSchedule => {
    const firstLine = computeAmortizationLine(homeLoan.amount, homeLoan.amount, homeLoan.rate / 100, homeLoan.duration, 1, 0, 0, homeLoan.startDate)
    const amortizationLines: AmortizationLine[] = [firstLine, ...computeAmortizationLines(homeLoan, firstLine, firstLine.month + 1)]

    return {lines: amortizationLines};
}

const computeAmortizationLines = (homeLoan: HomeLoanState, previousLine: AmortizationLine, month: number): AmortizationLine[] => {
    if (month > homeLoan.duration) {
        return []
    }
    const currentLine = computeAmortizationLine(homeLoan.amount, previousLine.remaning, homeLoan.rate / 100, homeLoan.duration, month, previousLine.principalToDate, previousLine.interestToDate, previousLine.date)
    return [currentLine, ...computeAmortizationLines(homeLoan, currentLine, month + 1)]
}

const computeAmortizationLine = (loanAmount: number, outstandingLoanBalance: number, loanRate: number, mensualityCount: number, month: number, principalToDate: number, interestToDate: number, date: Date): AmortizationLine => {
    const mensuality = computeMensuality(loanAmount, outstandingLoanBalance, loanRate, mensualityCount)

    return ({
        date: moment(date).add(1, 'M').toDate(),
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

const AmortizationSchedule = ({homeloan}: { homeloan: HomeLoanState }) => {
    const {i18n, t} = useTranslation();

    return <Table striped bordered hover>
        <thead className="sticky-top bg-light">
        <tr>
            <th>{t("date")}<sup className="text-muted">(dd/mm/aaaa)</sup></th>
            <th>{t("month")}</th>
            <th>{t("outstandingLoanBalance")}</th>
            <th>{t("monthlyPayment")}</th>
            <th>{t("principalToDate")}</th>
            <th>{t("interestToDate")}</th>
        </tr>
        </thead>
        <tbody>
        {computeAmortisationSchedule(homeloan).lines.map(line =>
            <tr key={line.month} className={line.date < new Date() ? "table-success" : ""}>
                <td>
                    {moment(line.date).calendar({
                        sameDay: '[Today]',
                        nextDay: '[Tomorrow]',
                        nextWeek: 'dddd',
                        lastDay: '[Yesterday]',
                        lastWeek: '[Last] dddd',
                        sameElse: 'DD/MM/YYYY'
                    })}
                </td>
                <td>
                    {line.month}
                </td>
                <td>
                    {line.remaning.toLocaleString(currencyToLocal(homeloan.currency), {
                        style: 'currency',
                        currency: homeloan.currency
                    })}
                </td>
                <td>
                    {`${line.monthlyPayment.toLocaleString(currencyToLocal(homeloan.currency), {
                        style: 'currency',
                        currency: homeloan.currency
                    })} (${line.principalPayment.toLocaleString(currencyToLocal(homeloan.currency), {
                        style: 'currency',
                        currency: homeloan.currency
                    })} + ${line.monthlyInterest.toLocaleString(currencyToLocal(homeloan.currency), {
                        style: 'currency',
                        currency: homeloan.currency
                    })})`}
                </td>
                <td>
                    {line.principalToDate.toLocaleString(currencyToLocal(homeloan.currency), {
                        style: 'currency',
                        currency: homeloan.currency
                    })}
                </td>
                <td>
                    {line.interestToDate.toLocaleString(currencyToLocal(homeloan.currency), {
                        style: 'currency',
                        currency: homeloan.currency
                    })}
                </td>
            </tr>)
        }
        </tbody>
    </Table>
}

const HomeLoanResume = ({homeloan}: { homeloan: HomeLoanState }) => {
    const {i18n, t} = useTranslation();

    return <>
        <FormGroup as={Row} className="mb-3 mt-3">
            <Form.Label sm={2} column htmlFor="loan-amount">{t("amount")}</Form.Label>
            <Col sm={10}>
                <Form.Control id="loan-amount" disabled type="text"
                              value={homeloan.amount.toLocaleString(currencyToLocal(homeloan.currency), {
                                  style: 'currency',
                                  currency: homeloan.currency
                              })}/>
            </Col>
        </FormGroup>

        <FormGroup as={Row} className="mb-3">
            <Form.Label sm={2} column htmlFor="loan-rate">{t("rate")}</Form.Label>
            <Col sm={10}>
                <Form.Control id="loan-rate" disabled type="text" value={`${homeloan.rate} %`}/>
            </Col>
        </FormGroup>

        <FormGroup as={Row} className="mb-3">
            <Form.Label sm={2} column htmlFor="loan-duration">{t("monthCount")}</Form.Label>
            <Col sm={10}>
                <Form.Control id="loan-duration" disabled type="text" value={homeloan.duration}/>
            </Col>
        </FormGroup>

        <FormGroup as={Row} className="mb-3">
            <Form.Label sm={2} column htmlFor="loan-cost">{t("loanCost")}</Form.Label>
            <Col sm={10}>
                <Form.Control id="loan-duration" disabled type="text"
                              value={(monthlyPayment(homeloan.amount, homeloan.rate / 100, homeloan.duration) * homeloan.duration - homeloan.amount).toLocaleString(currencyToLocal(homeloan.currency), {
                                  style: 'currency',
                                  currency: homeloan.currency
                              })}/>
            </Col>
        </FormGroup>

        <FormGroup as={Row} className="mb-3">
            <Form.Label sm={2} column htmlFor="loan-beggin">{t("loanBeggin")}</Form.Label>
            <Col sm={10}>
                <Form.Control id="loan-beggin" disabled type="date"
                              value={moment(homeloan.startDate).format("YYYY-MM-DD")}/>
            </Col>
        </FormGroup>


        <FormGroup as={Row} className="mb-3">
            <Form.Label sm={2} column htmlFor="loan-end">{t("loanEnd")}</Form.Label>
            <Col sm={10}>
                <Form.Control id="loan-end" disabled type="date"
                              value={moment(homeloan.startDate).add(homeloan.duration, 'M').format("YYYY-MM-DD")}/>
            </Col>
        </FormGroup>
    </>
}


type HomeLoanEditorProps = {
    homeloan: HomeLoanState
    setHomeloan: (state: HomeLoanState) => void
}

const HomeLoanEditor = ({homeloan, setHomeloan}: HomeLoanEditorProps) => {
    return <>
        <Row>
            <Col md="6">
                <Form.Label htmlFor="loan-name" visuallyHidden>Loan Name</Form.Label>
                <Form.Control key={homeloan.name} id="loan-name" type="text"
                              defaultValue={homeloan.name}
                              onBlur={event => setHomeloan({
                                  ...homeloan,
                                  name: event.target.value
                              })}></Form.Control>
            </Col>
        </Row>
        <Row>
            <Col md="6">
                <Form.Label htmlFor="loan-amount" visuallyHidden>Amount</Form.Label>
                <Form.Control key={homeloan.amount} id="loan-amount" type="text"
                              defaultValue={homeloan.amount}
                              onBlur={event => setHomeloan({
                                  ...homeloan,
                                  amount: Number(event.target.value)
                              })}></Form.Control>
            </Col>
            <Col md="2">
                <Form.Label htmlFor="loan-currency" visuallyHidden>Currency</Form.Label>
                <Form.Select value={homeloan.currency} id="loan-currency"
                             onChange={event => setHomeloan({...homeloan, currency: event.target.value})}>
                    <option value="USD">$</option>
                    <option value="EUR">€</option>
                    <option value="GBP">£</option>
                </Form.Select>
            </Col>
            <Col md="2">
                <Form.Label htmlFor="loan-rate" visuallyHidden>Rate</Form.Label>
                <InputGroup>
                    <Form.Control id="loan-rate" type="text"
                                  key={homeloan.rate}
                                  onBlur={event => setHomeloan({
                                      ...homeloan,
                                      rate: Number(event.target.value.replace(',', '.'))
                                  })}
                                  defaultValue={homeloan.rate}
                    />
                    <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
            </Col>
            <Col md="2">
                <Form.Label htmlFor="loan-duration" visuallyHidden>Duration in Year</Form.Label>
                <InputGroup>
                    <Form.Control id="loan-duration" type="text"
                                  key={homeloan.duration}
                                  onBlur={event => setHomeloan({
                                      ...homeloan,
                                      duration: Number(event.target.value) * 12
                                  })}
                                  defaultValue={(homeloan.duration / 12).toFixed(0)}/>
                    <InputGroup.Text>Years</InputGroup.Text>
                </InputGroup>
            </Col>
        </Row>
        <Row>
            <Col md="6">
                <Form.Label htmlFor="loan-start-date" visuallyHidden>Start Date</Form.Label>
                <Form.Control id="loan-start-date" value={moment(homeloan.startDate).format("YYYY-MM-DD")} type="date"
                              onChange={event => setHomeloan({
                                  ...homeloan,
                                  startDate: (event.target as any).valueAsDate
                              })}/>
            </Col>
        </Row>
    </>
}
