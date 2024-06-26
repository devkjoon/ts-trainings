import React, { useEffect, useState } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/courses');
        const data = await response.json();
        setCourses(data.courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const viewCourse = (courseId) => {
    history.push(`/courses/${courseId}`);
  };

  return (
    <Container>
      <h1 className="text-center mt-4 mb-4">Courses</h1>
      {courses.map((course) => (
        <Card key={course.id} className="mb-4">
          <Card.Body>
            <Card.Title>{course.title}</Card.Title>
            <Card.Text>{course.description}</Card.Text>
            <Button variant="outline-info" onClick={() => viewCourse(course.id)}>
              View Course
            </Button>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default CourseList;
