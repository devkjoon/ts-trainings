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

  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch(`http://localhost:5000/courses/${courseId}/modules?sid=${studentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch modules');
        }
        const data = await response.json();

        setModules(data.modules);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [courseId, studentId]);

  const handleModuleClick = (moduleId) => {
    navigate(`/student/courses/${courseId}/modules/${moduleId}`);
  };

  const incompleteModules = modules.filter(module => !module.completed);
  const completedModules = modules.filter(module => module.completed);

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
      {incompleteModules.length > 0 ? (
        <Row className="justify-content-center align-items-stretch">
          {incompleteModules.map((module) => (
            <Col key={module._id} md={4} className="mb-4 d-flex">
              <Card className="course-card h-100 w-100" style={{ width: '18rem' }}>
                <Card.Img className="moduleCardImg" variant="top" src={module.moduleIconUrl || 'default-image-url.jpg'} alt="Module Image" />
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div m-auto>
                    <Card.Title>{module.title}</Card.Title>
                  </div>
                  {/* <div className='mb-2 mt-auto'>
                    <Card.Text>{module.description}</Card.Text>
                  </div> */}
                  <Button variant="outline-info" onClick={() => handleModuleClick(module._id)}>Go to Module</Button>
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

      {completedModules.length > 0 && (
        <>
          <h2 className="text-center mt-4 mb-4">Completed Modules</h2>
          <Row className="justify-content-center align-items-stretch">
            {completedModules.map((module) => (
              <Col key={module._id} md={4} className="mb-4 d-flex">
                <Card className="course-card h-100 w-100" style={{ width: '18rem' }}>
                  <Card.Img className="moduleCardImg" variant="top" src={module.moduleIconUrl || 'default-image-url.jpg'} alt="Module Image" />
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div m-auto>
                      <Card.Title>{module.title}</Card.Title>
                    </div>
                    {/* <div className='mb-2 mt-auto'>
                      <Card.Text>{module.description}</Card.Text>
                    </div> */}
                    <Button variant="outline-warning" onClick={() => handleModuleClick(module._id)}>Review Module</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default ModuleDashboard;
