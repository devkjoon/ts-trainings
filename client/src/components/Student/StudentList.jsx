import React, { useEffect, useState } from "react";
import { Container, Button, Row, Col, Table, Alert } from "react-bootstrap";
import { Link } from 'react-router-dom';

import API_URL from '../../config';

import AdminTokenVerification from '../../hooks/AdminTokenVerification';
import AssignCourseModal from "../Tools/AssignCourseModal";
import NewStudentModal from "../Tools/NewStudentModal";

import '../../assets/css/StudentList.css';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showNewStudentModal, setShowNewStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [validated, setValidated] = useState(false);

  AdminTokenVerification();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${API_URL}/student`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        const data = await response.json();
        setStudents(data.students);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleDeleteStudent = async (id) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5000/student/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!response.ok) {
        console.log(response.message)
        throw new Error("Failed to delete student");
      }

      setStudents((prevStudents) =>
        prevStudents.filter((student) => student._id !== id)
      );
    } catch (error) {
      console.error("Error deleting student:", error);
      showAlert('Failed to delete student. Please try again later.', 'danger');
    }
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
  };  

  const handleShowAssignModal = (studentId) => {
    setSelectedStudent(studentId);
    setShowAssignModal(true);
  };

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setSelectedStudent(null);
  };

  const handleShowNewStudentModal = () => {
    setShowNewStudentModal(true);
  };

  const handleCloseNewStudentModal = () => {
    setShowNewStudentModal(false);
  };

  const handleStudentCreation = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/student/newStudent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstname, lastname, email, company })
      });

      const result = await response.json();
      console.log(result);
      if (result.success) {
        setAlert({ show: true, message: 'Created new student!', variant: 'success' });
        setStudents((prevStudents) => [...prevStudents, { firstname, lastname, email, company, loginCode: result.loginCode }]);
        handleCloseNewStudentModal();
      } else {
        setAlert({ show: true, message: 'Unsuccessful, please try again later :(', variant: 'danger' });
      }
    } catch (error) {
      console.error('Error registering student:', error);
      setAlert({ show: true, message: 'Failed to register student. Please try again later.', variant: 'danger' });
    }
  };

  return (
    <Container>
      <Row>
        <Col xs={10}>
         <h1 className="mt-4 mb-4">Student List</h1>
        </Col>
        <Col className='m-auto p-auto'>
          <Button className='company-button mb-2' variant="outline-info" onClick={handleShowNewStudentModal}>
            New Student
          </Button>
        </Col>
      </Row>
      <div className="table-container">
        {alert.show && (
          <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
            {alert.message}
          </Alert>
        )}
        <Table striped bordered hover className="custom-table">
          <thead>
            <tr>
              <th>Last Name</th>
              <th>First Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Login Code</th>
              <th>Assign</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td className="table-vertical-center">{student.lastname}</td>
                <td className="table-vertical-center">{student.firstname}</td>
                <td className="table-vertical-center">{student.email}</td>
                <td className="table-vertical-center">{student.company}</td>
                <td className="table-vertical-center">{student.loginCode}</td>
                <td className="table-vertical-center">
                  <Button variant="outline-info" onClick={() => handleShowAssignModal(student._id)}>
                    Assign Course 
                  </Button>
                </td>
                <td className="table-vertical-center">
                  <Button variant="outline-warning" onClick={() => handleDeleteStudent(student._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Link to='/admin/dashboard' className='no-underline'>
          <Button className="button-25 mt-3" variant="outline-info" size="lg">Back</Button>
        </Link>
      </div>
      {selectedStudent && (
        <AssignCourseModal
          show={showAssignModal}
          handleClose={handleCloseAssignModal}
          studentId={selectedStudent}
          showAlert={showAlert}
        />
      )}
      <NewStudentModal
        show={showNewStudentModal}
        handleClose={handleCloseNewStudentModal}
        handleSubmit={handleStudentCreation}
        firstname={firstname}
        setFirstname={setFirstname}
        lastname={lastname}
        setLastname={setLastname}
        email={email}
        setEmail={setEmail}
        company={company}
        setCompany={setCompany}
      />
    </Container>
  );
}