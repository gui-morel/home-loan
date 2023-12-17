import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Tab, Tabs} from 'react-bootstrap';
import './App.css';
import { HomeLoan } from './components/home-loan/HomeLoan';
import { Investment } from './components/financial-investment/Investment';
import { StateHistory } from './components/StateHistory';

function App() {
  return (
    <Tabs
      defaultActiveKey="loan"
      id="fill-tab"
      className="mb-3 container-fluid"
      fill
    >
      <Tab eventKey="loan" title="Home Loan">
        <Container>
          <StateHistory historyName='homeloan'>
            <HomeLoan></HomeLoan>
          </StateHistory>
        </Container>
      </Tab>
      <Tab eventKey="investment" title="Financial Investment">
        <Row className="d-flex justify-content-center">
          <Investment></Investment>
        </Row>
      </Tab>
    </Tabs>
  )
}

export default App
