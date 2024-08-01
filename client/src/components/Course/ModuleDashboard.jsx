import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Alert, Spinner, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import '../../assets/css/ModuleDashboard.css'

const ModuleDashboard = () => {
  const { courseId } = useParams();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch(`http://localhost:5000/courses/${courseId}/modules`);
        if (!response.ok) {
          throw new Error('Failed to fetch modules');
        }
        const data = await response.json();
        setModules(data.modules);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [courseId]);

  const handleModuleClick = (moduleId) => {
    navigate(`/student/modules/${moduleId}`);
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading modules...</p>
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
      <h1 className="text-center mt-4 mb-4">Course Modules</h1>
      {modules.length > 0 ? (
        <Row className="justify-content-center">
          {modules.map((module) => (
            <Col key={module._id} md={4} className="mb-4 d-flex justify-content-center">
              <Card className="course-card h-100" style={{ width: '18rem' }}>
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title>{module.title}</Card.Title>
                    <Card.Text>{module.description}</Card.Text>
                  </div>
                  <Button variant="primary" onClick={() => handleModuleClick(module._id)}>Go to Module</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info" className="text-center">
          No modules available for this course.
        </Alert>
      )}
    </Container>
  );
};

export default ModuleDashboard;
