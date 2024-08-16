import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';

import ResourceViewer from '../../components/Course/ResourceViewer';
import QuizForm from '../../components/Course/QuizForm'
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
  const navigate = useNavigate();

  const alertRef = useRef(null);

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
    if (quizResult && alertRef.current) {
      alertRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [quizResult]);

  const handleReturnToDashboard = () => navigate(`/student/courses/${courseId}/modules`);

  const toggleQuizVisibility = () => setShowQuiz((prevShowQuiz) => !prevShowQuiz);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading module...</span>
        </Spinner>
        <p>Loading module...</p>
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="text-center mt-4 mb-4">{module?.title}</h2>
      <Row>
        <Col md={module?.resource?.type ? 5 : 12}>
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
          <Col md={7} className="d-flex justify-content-center">
            <ResourceViewer resource={module.resource} title={module.title} />
          </Col>
        )}
      </Row>

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
          onSubmitResult={setQuizResult}
        />
      )}

      {quizResult && (
        <Alert ref={alertRef} variant={quizResult === 'Quiz passed!' ? 'success' : 'danger'} className="mt-3">
          {quizResult}
        </Alert>
      )}
    </Container>
  );
};

export default ModuleViewer;
