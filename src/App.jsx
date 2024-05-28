import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import './App.css'

function App() {
  return (
    <Container>
      <div>
        <h1>I am a</h1>
      </div>
      <Row>
        <Button variant="outline-warning" size="lg">Administrator</Button>{' '}
        <Button variant="outline-info" size="lg">Student</Button>{' '}
      </Row>
    </Container>
  );
}

export default App