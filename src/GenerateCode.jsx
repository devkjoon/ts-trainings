import Form from 'react-bootstrap/Form';

function GenerateCode() {
    return (
        <Form>
            <Form.Control size="lg" type="text" placeholder="First Name"/>
            <br />
            <Form.Control size="lg" type="text" placeholder="Last Name"/>
            <br />
            <Form.Control size="lg" type="text" placeholder="Company Name"/>
            <br />
            <Form.Control size="lg" type="text" placeholder="Course"/>
            <br />
        </Form>
    )
}

export default GenerateCode