import React, { useEffect, useState } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from 'react-router-dom';

import '../../assets/css/CourseList.css';

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/courses", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        setCourses(data.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleDeleteCourse = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/courses/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.log(response.message);
        throw new Error("Failed to delete course");
      }

      setCourses((prevCourses) =>
        prevCourses.filter((course) => course._id !== id)
      );
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleViewCourse = (courseId) => {
    navigate(`/admin/courses/${courseId}`);
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Course List</h1>
      <Row>
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
      </Row>
      <div className="text-center">
        <Button className="mainButton mt-3" variant="outline-info" size="lg" href="/admin/dashboard">Back</Button>
      </div>
    </Container>    
  );
}

 


    