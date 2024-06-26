import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Container, Row, Col } from 'react-bootstrap';

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
      {course.sections.map((section, index) => (
        <Row key={index} className="mt-3">
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>{section.title}</Card.Title>
                <Card.Text>{section.description}</Card.Text>
                {section.resource.type === 'video' ? (
                  <video controls>
                    <source src={section.resource.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <iframe src={section.resource.url} title={section.title} width="100%" height="500px"></iframe>
                )}
                {section.quiz.questions.length > 0 && (
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
    </Container>
  );
}
