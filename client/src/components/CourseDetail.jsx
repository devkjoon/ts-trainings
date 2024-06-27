import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';

export default function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5000/courses/${courseId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch course');
        }
        const data = await response.json();
        setCourse(data.course);
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (!course) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>{course.title}</Card.Title>
              <Card.Text>{course.description}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {course.modules.map((module, index) => (
        <Row key={index} className="mt-3">
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>{module.title}</Card.Title>
                <Card.Text>{module.description}</Card.Text>
                {module.resource.type === 'video' ? (
                  <video controls>
                    <source src={module.resource.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <iframe src={module.resource.url} title={module.title} width="100%" height="500px"></iframe>
                )}
                {module.quiz.questions.length > 0 && (
                  <div>
                    <h5>Quiz</h5>
                    {/* Render quiz questions here */}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ))}
      <div className="text-center">
        <Button className="mainButton mt-3" variant="outline-info" size="lg" href="/admin/dashboard">Back</Button>
      </div>
    </Container>
  );
}
