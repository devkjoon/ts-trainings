import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Alert, Spinner, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import API_URL from '../../config';

import ProgressBar from '../Tools/ProgressBar';

import '../../assets/css/ModuleDashboard.css';

const ModuleDashboard = () => {
  const { courseId } = useParams();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});
  const navigate = useNavigate();

  const studentId = localStorage.getItem('studentId');  

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch(`${API_URL}/courses/${courseId}/modules?sid=${studentId}`);
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
    setFlippedCards((prevState) => ({
      ...prevState,
      [moduleId]: !prevState[moduleId],
    }));
  };
  
  const incompleteModules = modules.filter(module => !module.isFinalTest && !module.completed);
  const completedModules = modules.filter(module => module.completed);
  const finalTestModule = modules.find(module => module.isFinalTest);

  const isFinalTestLocked = incompleteModules.length > 0;

  const totalModules = modules.length;
  const progress = totalModules > 0 ? Math.round((completedModules.length / totalModules) * 100) : 0;


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

  let alertMessage = "No modules available for this course.";
  if (incompleteModules.length === 0 && finalTestModule && !finalTestModule.completed) {
    alertMessage = "Take the final test to complete the course.";
  } else if (incompleteModules.length === 0 && finalTestModule && finalTestModule.completed) {
    alertMessage = "Congratulations! You have completed this course.";
  }

  return (
    <Container>
      <h1 className="text-center mt-4 mb-4">Course Modules</h1>
      <ProgressBar progress={progress}/>
      {incompleteModules.length > 0 ? (
        <Row className="justify-content-center align-items-stretch">
          {incompleteModules.map((module) => (
            <Col key={module._id} xs={12} sm={6} md={4} className="mb-4 d-flex">
              <Card className={`course-card h-100 w-100 ${flippedCards[module._id] ? 'flipped' : ''}`} onClick={() => handleModuleClick(module._id)}>
                <div className="card-inner">
                  <div className="card-front">
                    <Card.Img className="moduleCardImg" variant="top" src={module.moduleIconUrl || 'default-image-url.jpg'} alt="Module Image" />
                    <Card.Body className="card-body-flex">
                      <div className="m-auto">
                        <Card.Title>{module.title}</Card.Title>
                      </div>
                      <Card.Footer className="card-footer"> {/* Ensure button is at the bottom */}
                        <Button
                          className='module-btn'
                          variant={module.isLocked ? 'outline-danger' : 'outline-primary'}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card flip when clicking the button
                            if (!module.isLocked) {
                              navigate(`/student/courses/${courseId}/modules/${module._id}`);
                            }
                          }}
                          disabled={module.isLocked}
                        >
                          {module.isLocked ? "Locked" : "Go to Module"}
                        </Button>
                      </Card.Footer>
                    </Card.Body>
                  </div>
                  <div className="card-back">
                  <Card.Body className="d-flex flex-column justify-content-center align-items-center" onclick={(e) => {
                    e.stopPropagation();
                    handleModuleClick(module._id);
                  }}>
                    <div className="description-header">
                      <strong>About this Module:</strong>
                    </div>
                      <ul className="description-list scrollable-description text-left">
                        {module.description.map((desc, index) => (
                          <li key={index}>{desc}</li>
                        ))}
                      </ul>
                    </Card.Body>
                  </div>
              </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info" className="text-center">
          {alertMessage}
        </Alert>
      )}

      {finalTestModule && (
        <>
          <h2 className="text-center mt-4 mb-4">Final Test</h2>
          <Row className="justify-content-center align-items-stretch">
            <Col key={finalTestModule._id} xs={12} sm={6} md={4} className="mb-4 d-flex">
              <Card className={`course-card h-100 w-100 ${flippedCards[finalTestModule._id] ? 'flipped' : ''}`} onClick={() => handleModuleClick(finalTestModule._id)}>
                <div className="card-inner">
                  <div className="card-front">
                    <Card.Img className="moduleCardImg" variant="top" src={finalTestModule.moduleIconUrl || 'default-image-url.jpg'} alt="Final Test Image" />
                    <Card.Body className="card-body-flex">
                      <div className="m-auto">
                        <Card.Title>{finalTestModule.title}</Card.Title>
                      </div>
                      <Card.Footer className="card-footer">
                        <Button
                          className='module-btn'
                          variant={isFinalTestLocked ? 'outline-danger' : 'outline-primary'}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card flip when clicking the button
                            if (!isFinalTestLocked) {
                              navigate(`/student/courses/${courseId}/modules/${finalTestModule._id}`);
                            }
                          }}
                          disabled={isFinalTestLocked}
                        >
                          {isFinalTestLocked ? "Locked" : (completedModules.some(module => module._id === finalTestModule._id) ? "Review Test" : "Go to Final Test")}
                        </Button>
                      </Card.Footer>
                    </Card.Body>
                  </div>
                  <div className="card-back">
                  <Card.Body className="d-flex flex-column justify-content-center align-items-center" onclick={(e) => {
                    e.stopPropagation();
                    handleModuleClick(module._id);
                  }}>
                    <div className="description-header">
                      <strong>About this Module:</strong>
                    </div>
                      <ul className="description-list scrollable-description text-left">
                        {finalTestModule.description.map((desc, index) => (
                          <li key={index}>{desc}</li>
                        ))}
                      </ul>
                    </Card.Body>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {completedModules.length > 0 && (
        <>
          <h2 className="text-center mt-4 mb-4">Completed Modules</h2>
          <Row className="justify-content-center align-items-stretch">
            {completedModules.map((module) => (
              <Col key={module._id} xs={12} sm={6} md={4} className="mb-4 d-flex">
                <Card className={`course-card h-100 w-100 ${flippedCards[module._id] ? 'flipped' : ''}`} onClick={() => handleModuleClick(module._id)}>
                  <div className="card-inner">
                    <div className="card-front">
                      <Card.Img className="moduleCardImg" variant="top" src={module.moduleIconUrl || 'default-image-url.jpg'} alt="Module Image" />
                      <Card.Body className="card-body-flex">
                        <div className='m-auto'>
                          <Card.Title>{module.title}</Card.Title>
                        </div>
                        <Card.Footer className="card-footer">
                          <Button
                            className='module-btn'
                            variant="outline-warning"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card flip when clicking the button
                              navigate(`/student/courses/${courseId}/modules/${module._id}`);
                            }}
                          >
                            Review Module
                          </Button>
                        </Card.Footer>
                      </Card.Body>
                    </div>
                    <div className="card-back">
                    <Card.Body className="d-flex flex-column justify-content-center align-items-center" onclick={(e) => {
                    e.stopPropagation();
                    handleModuleClick(module._id);
                  }}>
                      <div className="description-header">
                        <strong>About this Module:</strong>
                      </div>
                        <ul className="description-list scrollable-description text-left">
                          {module.description.map((desc, index) => (
                            <li key={index}>{desc}</li>
                          ))}
                        </ul>
                      </Card.Body>
                    </div>
                  </div>
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
