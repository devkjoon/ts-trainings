import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import '../assets/css/GenerateCode.css'

export default function GenerateCode() {



    return (
        <Form>
            
        <Form.Group className="mb-3 " controlId="formBasicEmail">
          <Form.Label>First Name</Form.Label>
          <Form.Control type="input" placeholder="First Name" />
        </Form.Group>

        <Form.Group className="mb-3 " controlId="formBasicEmail">
          <Form.Label>Last Name</Form.Label>
          <Form.Control type="input" placeholder="Last Name" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Company</Form.Label>
          <Form.Control type="input" placeholder="Company" />
        </Form.Group>

        <Form.Group className="mb-3 " controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="input" placeholder="Email" />
        </Form.Group>
  
        <Form.Group className="mb-3">
          <Form.Label>Class</Form.Label>
          <Form.Control as="select" placeholder="Class">
            <option>OSHA 10</option>
            <option>OSHA 30</option>
        </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit" >
          Submit
        </Button>

      </Form>

      
    )
}
