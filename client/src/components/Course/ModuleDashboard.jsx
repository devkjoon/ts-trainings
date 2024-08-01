import React, { useEffect, useState } from 'react';
import { Container, Card, ListGroup, Alert, Spinner, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

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
    navigate(`/modules/${moduleId}`);
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
        <ListGroup>
          {modules.map((module) => (
            <ListGroup.Item key={module._id}>
              <Card>
                <Card.Body>
                  <Card.Title>{module.title}</Card.Title>
                  <Card.Text>{module.description}</Card.Text>
                  <Button variant="primary" onClick={() => handleModuleClick(module._id)}>Go to Module</Button>
                </Card.Body>
              </Card>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <Alert variant="info" className="text-center">
          No modules available for this course.
        </Alert>
      )}
    </Container>
  );
};

export default ModuleDashboard;
