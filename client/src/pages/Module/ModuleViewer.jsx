import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';

import ResourceViewer from '../../components/Course/ResourceViewer';
import QuizForm from '../../components/Course/QuizForm';
import ModalViewer from '../../components/Course/ModalViewer';
import API_URL from '../../config';

import '../../assets/css/ModuleViewer.css';

const ModuleViewer = () => {
  const { courseId, moduleId } = useParams();
  const [module, setModule] = useState(null);
  const [allModules, setAllModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizResult, setQuizResult] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);  // New state
  const navigate = useNavigate();

  const alertRef = useRef(null);
  const quizRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        const moduleResponse = await fetch(`${API_URL}/module/${moduleId}`);
        const moduleData = await moduleResponse.json();

        const allModulesResponse = await fetch(`${API_URL}/courses/${courseId}/modules`);
        const allModulesData = await allModulesResponse.json();

        setModule(moduleData.module);
        setAllModules(allModulesData.modules);
      } catch (error) {
        console.error('Error fetching module data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModuleData();
  }, [courseId, moduleId]);

  useEffect(() => {
    if (quizResult && quizResult === 'Quiz passed!') {
      // Show the "Quiz passed!" message for 2 seconds
      setTimeout(() => {
        setShowRedirectMessage(true);  // After 2 seconds, show redirecting message
      }, 3000);

      // Redirect after 3 more seconds (total 5 seconds from quiz passed)
      setTimeout(() => {
        setRedirecting(true);
        navigate(`/student/courses/${courseId}/modules`);
      }, 5000);
    }
  }, [quizResult, courseId, navigate]);

  useEffect(() => {
    if (quizResult && alertRef.current) {
      alertRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [quizResult]);

  const handleReturnToDashboard = () => navigate(`/student/courses/${courseId}/modules`);

  const toggleQuizVisibility = () => {
    setShowQuiz((prevShowQuiz) => !prevShowQuiz);
    setTimeout(() => {
      if (quizRef.current && !showQuiz) {
        quizRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const scrollToContent = () => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Container>
      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <h2 className="text-center mt-4 mb-4">{module?.title}</h2>

          <div className="module-content">
            <Row>
              <Col lg={module?.resource?.type ? 5 : 12} className='secondary-content-container'>
                <h4 className='objectives-text'>Objectives</h4>
                {module?.description && (
                  <ul className="objectives-list">
                    {module.description.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
                {module?.optionalResource?.length > 0 && (
                  <ModalViewer resources={module.optionalResource} />
                )}
              </Col>
              {module?.resource?.type && (
                <Col lg={7} className="d-flex justify-content-center mx-auto">
                  <ResourceViewer resource={module.resource} title={module.title} contentRef={contentRef} />
                </Col>
              )}
            </Row>
          </div>

          {module?.quiz && (
            <div className="mt-3 text-center module-btn-container">
              <Button className="mx-2 module-btn" variant="outline-warning" onClick={handleReturnToDashboard}>
                Module Dashboard
              </Button>
              <Button className="mx-2 module-btn" variant="outline-info" onClick={toggleQuizVisibility}>
                {showQuiz ? 'Hide Test' : 'Take Test'}
              </Button>
            </div>
          )}

          {showQuiz && module?.quiz && (
            <QuizForm
              quiz={module.quiz}
              moduleId={module._id}
              scrollToContent={scrollToContent}
              quizRef={quizRef}
              onSubmitResult={setQuizResult}
            />
          )}

          {quizResult && (
            <Alert ref={alertRef} variant={quizResult === 'Quiz passed!' ? 'success' : 'danger'} className="mt-3">
              {quizResult}
            </Alert>
          )}

          {showRedirectMessage && (
            <div className="text-center mt-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p>Redirecting to module dashboard...</p>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default ModuleViewer;
