import React, { useState } from "react";
import { Accordion } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { HomeLoan, HomeLoanState } from "./HomeLoan";


type Loans = HomeLoanState[]

const defaultHomeLoan: HomeLoanState = {
    name: "Loan 1",
    amount: 100000,
    rate: 6.66,
    duration: 240,
    currency: 'EUR',
    startDate: new Date(1673732484000)
}

export const MultiHomeLoan = React.forwardRef((_, ref) => {
    const [loans, setLoans] = useState<Loans>([defaultHomeLoan])
    const {i18n, t} = useTranslation();

    return <>
        <Accordion defaultActiveKey="Sum of loan">
            <Accordion.Item eventKey="Sum of loan">
                <Accordion.Header>Sum of loan</Accordion.Header>
                <Accordion.Body>
                    {/*<AmortizationSchedule homeloan={loans[0]}></AmortizationSchedule>*/}
                </Accordion.Body>
            </Accordion.Item>

            {loans.map(homeloan => <Accordion.Item eventKey={homeloan.name}>
                <Accordion.Header>{homeloan.name}</Accordion.Header>
                <Accordion.Body>
                    <HomeLoan></HomeLoan>
                </Accordion.Body>
            </Accordion.Item>)}
        </Accordion>

    </>
});

