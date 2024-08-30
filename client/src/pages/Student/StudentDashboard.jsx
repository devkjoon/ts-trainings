import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col,  Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

import API_URL from '../../config';

import '../../assets/css/StudentDashboard.css'

export default function StudentDashboard() {
  const [enrolledCourses, setEnrolledCourses] = useState([]); // State for enrolled courses
  const [completedCourses, setCompletedCourses] = useState([]); // State for completed courses
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
        setEnrolledCourses(data.enrolledCourses); // Set enrolled courses
        setCompletedCourses(data.completedCourses); // Set completed courses
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
          <span className="visually-hidden">Loading your courses...</span>
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
      
      {enrolledCourses.length > 0 ? (
        <>
          <h2 className="text-center">Enrolled Courses</h2>
          <Row className="justify-content-center">
            {enrolledCourses.map((course) => (
              <Col key={course._id} lg={4} md={6} className="mb-4 d-flex justify-content-center card-container">
                <Link to={`/student/courses/${course._id}/modules`} className='no-underline'>
                  <Card className="course-card">
                    <div className="course-image-container">
                      <Card.Img src={course.imageUrl || "path/to/default/image.jpg"} className="cardImage" />
                    </div>
                    <div className="course-content-container">
                      <Card.Body className="course-content">
                        <Card.Title className='course-card-title'>{course.title}</Card.Title>
                      </Card.Body>
                    </div>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </>
      ) : (
        <Alert variant="info" className="text-center">
          You are not enrolled in any courses.
        </Alert>
      )}

      {completedCourses.length > 0 && (
        <>
          <h2 className="text-center mt-5">Completed Courses</h2>
          <Row className="justify-content-center">
            {completedCourses.map((course) => (
              <Col key={course._id} lg={4} md={6} className="mb-4 d-flex justify-content-center card-container">
                <Link to={`/student/courses/${course._id}/modules`} className='no-underline'>
                  <Card className="course-card">
                    <div className="course-image-container">
                      <Card.Img src={course.imageUrl || "path/to/default/image.jpg"} className="cardImage" />
                    </div>
                    <div className="course-content-container">
                      <Card.Body className="course-content">
                        <Card.Title className='course-card-title'>{course.title}</Card.Title>
                      </Card.Body>
                    </div>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};
