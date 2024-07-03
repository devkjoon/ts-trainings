import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";

import AdminTokenVerification from '../hooks/AdminTokenVerification';
import '../assets/css/StudentList.css';

export default function StudentList() {
  const [students, setStudents] = useState([]);

  AdminTokenVerification();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:5000/student", {
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
    try {
      const response = await fetch(`http://localhost:5000/student/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
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
            <th>Actions</th>
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
                <Button
                  variant="danger"
                  onClick={() => handleDeleteStudent(student._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button className="button-25 mt-3" variant="outline-info" size="lg" href="/admin/dashboard">Back</Button>
    </div>
    </>
  );
}
