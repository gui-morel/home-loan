import React from "react";
import {Link, Outlet} from "react-router-dom";
import {Container, Nav, Navbar} from "react-bootstrap";
import {AiOutlineStock} from "react-icons/ai";
import {FaHouseCircleCheck} from "react-icons/fa6";
import {ThemeToggle} from "./ThemeToggle";

export const Layout = () => {
    return <>
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container fluid>
                <Navbar.Brand>gui-morel</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll"/>
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{maxHeight: '100px'}}
                        navbarScroll
                    >
                        <Nav.Link as={Link} to="/home-loan"><FaHouseCircleCheck/> Home Loan</Nav.Link>
                        <Nav.Link as={Link} to="/investment"><AiOutlineStock/> Investment</Nav.Link>
                    </Nav>
                    <ThemeToggle/>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <Container>
            <Outlet/>
        </Container>
    </>
}