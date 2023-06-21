import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Tab, Tabs } from 'react-bootstrap';
import './App.css';
import { HomeLoan } from './components/HomeLoan';
import { Investment } from './components/Investment';
import { StateHistory } from './components/StateHistory';

function App() {
  return (
    <Tabs
      defaultActiveKey="loan"
      id="fill-tab"
      className="mb-3 container-fluid"
      transition={false}
      fill
    >
      <Tab eventKey="loan" title="Home Loan">
        <Container>
          <StateHistory historyName='homeloan'>
            <HomeLoan></HomeLoan>
          </StateHistory>
        </Container>
      </Tab>
      <Tab eventKey="investment" title="Financial Investment" disabled>
        <Container>
          <Investment></Investment>
        </Container>
      </Tab>
    </Tabs>
  )
}

export default App
