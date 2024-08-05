import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';

import API_URL from '../../config';

import AdminTokenVerification from '../../hooks/AdminTokenVerification';
import AssignCourseModal from "../Tools/AssignCourseModal";
import '../../assets/css/StudentList.css';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

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
    }
  };

  const handleShowModal = (studentId) => {
    setSelectedStudent(studentId);
    setShowModal(true);
  };

  const handleCloseModal = (studentId) => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  return (
    <>
    <div className="table-container">
      <h1 className="text-center mt-4 mb-4">Student List</h1>
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
              <Button variant="outline-info"
                onClick={() => handleShowModal(student._id)}
                >
                 Assign Course 
                </Button>
              </td>
              <td className="table-vertical-center">
                <Button
                  variant="outline-warning"
                  onClick={() => handleDeleteStudent(student._id)}
                >
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
      show={showModal}
      handleClose={handleCloseModal}
      studentId={selectedStudent}
      />
    )}
    </>
  );
}
