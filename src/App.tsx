import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row } from 'react-bootstrap';
import './App.css';
import { HomeLoan } from './components/HomeLoan';

function App() {
  return (
    <div className="App">
      <Row>
        <Col>
          <HomeLoan></HomeLoan>
        </Col>
      </Row>
    </div>
  )
}

export default App
