import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';


import API_URL from '../../config';

import '../../assets/css/ModuleViewer.css';

const LazyResourceViewer = lazy(() => import('../../components/ModuleViewer/ResourceViewer'));
const LazyQuizForm = lazy(() => import('../../components/ModuleViewer/QuizForm'));
const LazyModalViewer = lazy(() => import('../../components/ModuleViewer/ModalViewer'));

const ModuleViewer = () => {
  const { courseId, moduleId } = useParams();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizResult, setQuizResult] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const navigate = useNavigate();

  const alertRef = useRef(null);
  const quizRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        const studentId = localStorage.getItem('studentId');
        if (!studentId) {
          navigate('/login');
          return;
        }

        const moduleResponse = await fetch(`${API_URL}/module/${moduleId}?sid=${studentId}`);
        const moduleData = await moduleResponse.json();

        setModule(moduleData.module);
      } catch (error) {
        console.error('Error fetching module data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModuleData();
  }, [courseId, moduleId, navigate]);

  useEffect(() => {
    if (quizResult === 'Module complete! Redirecting back to dashboard...') {
      setTimeout(() => navigate(`/student/courses/${courseId}/modules`), 3000);
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
    if (!showQuiz && quizRef.current) {
      setTimeout(() => quizRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  };

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
              <Col lg={module?.resource?.type ? 5 : 12} className="secondary-content-container">
                <h4 className="objectives-text">Objectives</h4>
                {module?.description && (
                  <ul className="objectives-list">
                    {module.description.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
                {module?.optionalResource?.length > 0 && (
                  <Suspense fallback={<div>Loading...</div>}>
                    <LazyModalViewer resources={module.optionalResource} />
                  </Suspense>
                )}
              </Col>
              {module?.resource?.type && (
                <Col lg={7} className="d-flex justify-content-center mx-auto">
                  <Suspense fallback={<div>Loading...</div>}>
                    <LazyResourceViewer
                      resource={module.resource}
                      title={module.title}
                      contentRef={contentRef}
                    />
                  </Suspense>
                </Col>
              )}
            </Row>
          </div>

          {module?.quiz && (
            <div className="mt-3 text-center module-btn-container">
              <Button
                className="mx-2 module-btn"
                variant="outline-warning"
                onClick={handleReturnToDashboard}
              >
                Module Dashboard
              </Button>
              <Button
                className="mx-2 module-btn"
                variant="outline-info"
                onClick={toggleQuizVisibility}
              >
                {showQuiz ? 'Hide Test' : 'Take Test'}
              </Button>
            </div>
          )}

          {showQuiz && module?.quiz && (
            <Suspense fallback={<div>Loading...</div>}>
              <LazyQuizForm
                quiz={module.quiz}
                moduleId={module._id}
                scrollToContent={scrollToContent}
                quizRef={quizRef}
                onSubmitResult={setQuizResult}
              />
            </Suspense>
          )}

          {quizResult && (
            <Alert
              ref={alertRef}
              variant={
                quizResult === 'Module complete! Redirecting back to dashboard...'
                  ? 'success'
                  : 'danger'
              }
              className="mt-3"
            >
              {quizResult === 'Module complete! Redirecting back to dashboard...' ? (
                <>
                  <Spinner animation="border" size="sm" role="status" className="me-2" />
                  {quizResult}
                </>
              ) : (
                quizResult
              )}
            </Alert>
          )}
        </>
      )}
    </Container>
  );
};

export default ModuleViewer;
