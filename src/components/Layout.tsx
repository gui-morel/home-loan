import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import { AiOutlineStock } from "react-icons/ai";
import { FaHouseCircleCheck } from "react-icons/fa6";
import { ThemeToggle } from "./ThemeToggle";
import { useTranslation } from "react-i18next";
import { LanguageSelect } from "../translation/LanguageSelect";
import { MdOutlineDomainDisabled } from "react-icons/md";

const LayoutNav = () => {
    const { i18n, t } = useTranslation();

    return <Navbar expand="lg" className="bg-body-tertiary mb-3">
        <Container fluid>
            <Navbar.Brand>gui-morel</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll"/>
            <Navbar.Collapse id="navbarScroll">
                <Nav
                    className="me-auto my-2 my-lg-0"
                    style={{maxHeight: '100px'}}
                    navbarScroll
                >
                    <Nav.Link as={Link} to="/"><FaHouseCircleCheck/> {t("homeLoan")}</Nav.Link>
                    <Nav.Link disabled><MdOutlineDomainDisabled /> {t("multiHomeLoan")}</Nav.Link>
                    <Nav.Link as={Link} to="/investment"><AiOutlineStock/> {t("investment")}</Nav.Link>
                </Nav>
                <div className="flex d-inline-flex gap-3">
                    <LanguageSelect/>
                    <ThemeToggle/>
                </div>
            </Navbar.Collapse>
        </Container>
    </Navbar>;
}

export const Layout = () => {
    return <>
        <LayoutNav></LayoutNav>
        <Container>
            <Outlet/>
        </Container>
    </>
}