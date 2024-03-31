import { useTranslation } from "react-i18next";
import { Dropdown } from "react-bootstrap";
import React, { useState } from "react";
import FlagIcon from "./Flags";

export const LanguageSelect = () => {
    const {i18n, t} = useTranslation();

    const [countries, setCountries] = useState(i18n.languages)
    const flagIcon = (code: string) => <>
        <FlagIcon code={code}/> {code}
    </>

    const [toggleContents, setToggleContents] = useState(flagIcon(i18n.language));

    return <Dropdown
        onSelect={eventKey => {
            setToggleContents(flagIcon(eventKey!!));
            i18n.changeLanguage(eventKey!!)
        }}
    >
        <Dropdown.Toggle variant="outline-secondary">
            {toggleContents}
        </Dropdown.Toggle>

        <Dropdown.Menu>
            {countries.map(code => (
                <Dropdown.Item key={code} eventKey={code}> {flagIcon(code)}</Dropdown.Item>
            ))}
        </Dropdown.Menu>
    </Dropdown>
}