import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

import API_URL from '../../config';

import '../../assets/css/Modals.css'

const AssignCourseModal = ({ show, handleClose, studentId, showAlert }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [studentCourses, setStudentCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_URL}/courses`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        setCourses(data.courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    const fetchStudentCourses = async () => {
      try {
        const response = await fetch(`${API_URL}/student/${studentId}/courses`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch student courses');
        }

        const data = await response.json();
        setStudentCourses(data.courses || []);
      } catch (error) {
        console.error('Error fetching student courses:', error);
      }
    };

    if (show) {
      fetchCourses();
      fetchStudentCourses();
    }
  }, [show, studentId]);

  const handleAssignCourse = async () => {

    const alreadyAssigned = studentCourses.some(course => course._id === selectedCourse);

    if (alreadyAssigned) {
      handleClose();
      showAlert('Student is already assigned to this course', 'warning');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/student/${studentId}/assign-course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId: selectedCourse }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign course');
      }

      handleClose();
      showAlert('Course assigned successfully', 'success');
    } catch (error) {
      console.error('Error assigning course:', error);
      showAlert('Failed to assign course. Please try again later.', 'danger')
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Assign Course</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formCourseSelect">
            <Form.Label>Select Course</Form.Label>
            <Form.Control
              as="select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
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
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleAssignCourse}>
          Assign Course
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AssignCourseModal;
