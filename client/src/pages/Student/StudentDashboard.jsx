import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col,  Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

import API_URL from '../../config';

import '../../assets/css/StudentDashboard.css'

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Assuming the student ID is stored in localStorage
  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    const fetchCourses = async () => {
      if (!studentId) {
        setError('Student ID not found.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/student/${studentId}/courses`);
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data.courses);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [studentId]);

  const handleCourseClick = (courseId) => {
    navigate(`/student/courses/${courseId}/modules`);
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading your courses...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="text-center mt-4 mb-4">My Courses</h1>
      {courses.length > 0 ? (
        <Row className="justify-content-center"> {/* Always centering but won't affect width */}
          {courses.map((course) => (
            <Col key={course._id} lg={4} md={6} className="mb-4 d-flex justify-content-center card-container">
              <Link to={`/student/courses/${course._id}/modules`} className='no-underline'>
                <Card className="course-card">
                  <Card.Img variant="top" src={course.imageUrl || "path/to/default/image.jpg"} className="cardImage" />
                  <Card.Body className="course-content">
                    <Card.Title>{course.title}</Card.Title>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info" className="text-center">
          You are not enrolled in any courses.
        </Alert>
      )}
    </Container>
  );
};