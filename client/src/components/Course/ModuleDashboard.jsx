import React, { useEffect, useState } from 'react';
import { Container, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import API_URL from '../../config';
import ProgressBar from '../Tools/ProgressBar';
import ModuleList from './ModuleList'; // Import the ModuleList component

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
    [moduleId]: !prevState[moduleId], // Toggle the flipped state
  }));
};

  const incompleteModules = modules.filter(module => !module.isFinalTest && !module.completed);
  const completedModules = modules.filter(module => module.completed);
  const finalTestModule = modules.find(module => module.isFinalTest);

  const isFinalTestLocked = incompleteModules.length > 0;
  const progress = modules.length > 0 ? Math.round((completedModules.length / modules.length) * 100) : 0;

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
      <ProgressBar progress={progress} />
      {incompleteModules.length > 0 ? (
        <ModuleList
          modules={incompleteModules}
          flippedCards={flippedCards}
          handleModuleClick={handleModuleClick}
          navigate={navigate}
          courseId={courseId}
        />
      ) : (
        <Alert variant="info" className="text-center">
          {alertMessage}
        </Alert>
      )}

      {finalTestModule && (
        <>
          <h2 className="text-center mt-4 mb-4">Final Test</h2>
          <ModuleList
            modules={[finalTestModule]}
            flippedCards={flippedCards}
            handleModuleClick={handleModuleClick}
            navigate={navigate}
            courseId={courseId}
          />
        </>
      )}

      {completedModules.length > 0 && (
        <>
          <h2 className="text-center mt-4 mb-4">Completed Modules</h2>
          <ModuleList
            modules={completedModules}
            flippedCards={flippedCards}
            handleModuleClick={handleModuleClick}
            navigate={navigate}
            courseId={courseId}
          />
        </>
      )}
    </Container>
  );
};

export default ModuleDashboard;
