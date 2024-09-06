import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';

import API_URL from '../../../config';
import '../../../assets/css/AdminPreLogin.css'; // Import the pre-login CSS

const AssignCourse = ({ show, handleClose, studentId, showAlert, setStudents, courses }) => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [studentCourses, setStudentCourses] = useState([]);
  const [modalAlert, setModalAlert] = useState({ show: false, message: '', variant: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudentCourses = async () => {
      if (!studentId) return;

      try {
        const response = await fetch(`${API_URL}/student/${studentId}/courses`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch student courses');
        }

        const data = await response.json();
        setStudentCourses(data.courses || []);
      } catch (error) {
        console.error('Error fetching student courses:', error);
        showAlert('Failed to fetch student courses', 'danger');
      }
    };

    if (show) {
      fetchStudentCourses();
      setModalAlert({ show: false, message: '', variant: '' }); // Reset modal alert when opening
    }
  }, [show, studentId, showAlert]);

  const handleAssignCourse = async () => {
    if (!selectedCourse) {
      setModalAlert({
        show: true,
        message: 'Please select a course to assign',
        variant: 'warning',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/student/${studentId}/assign-course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ courseId: selectedCourse }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const assignedCourse = courses.find((course) => course._id === selectedCourse);
        if (assignedCourse) {
          setStudents((prevStudents) =>
            prevStudents.map((student) =>
              student._id === studentId
                ? {
                    ...student,
                    courseProgress: [
                      ...(student.courseProgress || []),
                      {
                        courseId: assignedCourse._id,
                        courseName: assignedCourse.title,
                        progress: 0,
                      },
                    ],
                  }
                : student
            )
          );

          handleModalClose();
          showAlert('Course assigned successfully', 'success');
        } else {
          console.error('Assigned course not found in the courses list.');
        }
      } else {
        setModalAlert({
          show: true,
          message: result.message || 'Failed to assign course. Please try again later.',
          variant: 'warning',
        });
      }
    } catch (error) {
      console.error('Error assigning course:', error);
      setModalAlert({
        show: true,
        message: 'Failed to assign course. Please try again later.',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setSelectedCourse('');
    setModalAlert({ show: false, message: '', variant: '' });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered className="admin-modal">
      <Modal.Header closeButton>
        <Modal.Title>Assign Course</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {modalAlert.show && (
          <Alert
            variant={modalAlert.variant}
            onClose={() => setModalAlert({ ...modalAlert, show: false })}
            dismissible
          >
            {modalAlert.message}
          </Alert>
        )}
        <Form className="admin-form">
          <Form.Group controlId="formCourseSelect" className="admin-input-group">
            <Form.Label>Select Course</Form.Label>
            <Form.Control
              as="select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="admin-input"
            >
              <option value="">Select a course...</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleModalClose} disabled={loading} className="admin-button">
          Close
        </Button>
        <Button variant="outline-primary" onClick={handleAssignCourse} disabled={loading} className="admin-button">
          {loading ? (
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
          ) : (
            'Assign Course'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AssignCourse;
