import React, { useEffect, useState } from 'react';
import { Container, Card, /* Row, Col, Link, */ ListGroup, Alert, Spinner, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
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
        const response = await fetch(`http://localhost:5000/student/${studentId}/courses`);
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
    navigate(`/courses/${courseId}`);
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
      {/* <Row>
        {courses.map((course) => (
          <Col key={course._id} md={4} className="mb-4">
            <Link to={`/admin/courses/${course._id}`}>
            <Card className="course-card">
              
                <Card.Img variant="top" src={course.imageUrl} className="cardImage" />
              
              <Card.Body className="course-content">
                <Card.Title>{course.title}</Card.Title>
              </Card.Body>
            </Card>
            </Link>
          </Col>
        ))}
      </Row> */}
      {courses.length > 0 ? (
        <ListGroup>
          {courses.map((course) => (
            <ListGroup.Item key={course._id}>
              <Card>
                <Card.Body>
                  <Card.Title>{course.title}</Card.Title>
                  <Card.Text>{course.description}</Card.Text>
                  <Button variant="primary" onClick={() => handleCourseClick(course._id)}>Go to Course</Button>
                </Card.Body>
              </Card>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <Alert variant="info" className="text-center">
          You are not enrolled in any courses.
        </Alert>
      )}
    </Container>
  );
};

export default StudentDashboard;
