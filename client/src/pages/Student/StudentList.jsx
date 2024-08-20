import React, { useEffect, useState } from "react";
import { Container, Button, Row, Col, Table, Alert, Spinner, Collapse } from "react-bootstrap";
import { Link } from 'react-router-dom';

import API_URL from '../../config';

import AdminTokenVerification from '../../hooks/AdminTokenVerification';
import AssignCourseModal from "../../components/Modals/AssignCourse";
import NewStudentModal from "../../components/Modals/AddNewStudent";

import '../../assets/css/StudentList.css';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showNewStudentModal, setShowNewStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState({});

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');

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

    const fetchCompanies = async () => {
      try {
        const response = await fetch(`${API_URL}/company`, {
          method:'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch companies');
        }
        const data = await response.json();
        setCompanies(data.companies);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchStudents();
    fetchCompanies();
  }, []);

  const handleDeleteStudent = async (id) => {
    const token = localStorage.getItem('token');

    const isConfirmed = window.confirm('Are you sure you want to delete this student? This action cannot be undone.');

    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/student/${id}`, {
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
      setAlert({ show: true, message: 'Deleted student', variant: 'success' });
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

  const resetForm = () => {
    setFirstname('');
    setLastname('');
    setEmail('');
    setCompany('');
  };
  
  const handleShowNewStudentModal = () => {
    setShowNewStudentModal(true);
  };

  const handleCloseNewStudentModal = () => {
    setShowNewStudentModal(false);
    resetForm();
  };

  const handleStudentCreation = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Show spinner
  
    try {
      const response = await fetch(`${API_URL}/student/newStudent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ firstname, lastname, email, company })
      });
  
      const result = await response.json();
      console.log('Add student result:', result);
  
      if (result.success) {
        setStudents((prevStudents) => [...prevStudents, result.student]); // Use the student from the result
  
        setAlert({ show: true, message: 'New student added successfully', variant: 'success' });
        handleCloseNewStudentModal();
      } else {
        console.log('Result indicates failure:', result);
        const errorMessage = result.message || 'Unsuccessful, please try again later';
        setAlert({ show: true, message: errorMessage, variant: 'danger' });
      }
    } catch (error) {
      console.error('Error adding new student:', error);
      setAlert({ show: true, message: 'Failed to add student. Please try again later.', variant: 'danger' });
    } finally {
      setIsLoading(false); // Hide spinner
    }
  };

  const toggleCollapse = (id) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [id]: !prevOpen[id],
    }));
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
            <th>Name</th>
            <th>Login Code</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <React.Fragment key={student._id}>
              <tr onClick={() => toggleCollapse(student._id)}>
                <td>{`${student.firstname} ${student.lastname}`}</td>
                <td>{student.loginCode}</td>
              </tr>
              <tr>
                <td colSpan="2" style={{ padding: 0 }}>
                  <Collapse in={open[student._id]}>
                    <div className="p-2">
                      <Table bordered>
                        <tbody>
                          <tr>
                            <td><strong>First Name:</strong></td>
                            <td>{student.firstname}</td>
                          </tr>
                          <tr>
                            <td><strong>Last Name:</strong></td>
                            <td>{student.lastname}</td>
                          </tr>
                          <tr>
                            <td><strong>Email:</strong></td>
                            <td>{student.email}</td>
                          </tr>
                          <tr>
                            <td><strong>Company:</strong></td>
                            <td>{student.company}</td>
                          </tr>
                          <tr>
                            <td><strong>Actions:</strong></td>
                            <td>
                              <Button className="student-list-btn" variant="outline-info" onClick={() => handleShowAssignModal(student._id)}>
                                Assign Course
                              </Button>
                              <Button className="student-list-btn" variant="outline-warning" onClick={() => handleDeleteStudent(student._id)}>
                                Delete
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </Collapse>
                </td>
              </tr>
            </React.Fragment>
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
        companies={companies}
        isLoading={isLoading}
      />
    </Container>
  );
}
