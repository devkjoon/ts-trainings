import React, { useEffect, useState } from 'react';
import { Container, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import API_URL from '../../config';
import ProgressBar from '../../components/ModuleDashboard/ProgressBar';
import ModuleList from '../../components/ModuleDashboard/ModuleList';

import '../../assets/css/ModuleDashboard.css';

const ModuleDashboard = () => {
  const { courseId } = useParams();
  const [modules, setModules] = useState([]);
  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});
  const navigate = useNavigate();

  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    const fetchCourseAndModules = async () => {
      try {
        const courseResponse = await fetch(`${API_URL}/courses/${courseId}`);
        const courseData = await courseResponse.json();
        setCourse(courseData.course);

        const moduleResponse = await fetch(
          `${API_URL}/courses/${courseId}/modules?sid=${studentId}`
        );
        if (!moduleResponse.ok) {
          throw new Error('Failed to fetch modules');
        }
        const moduleData = await moduleResponse.json();
        setModules(moduleData.modules);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndModules();
  }, [courseId, studentId]);

  const handleModuleClick = (moduleId) => {
    setFlippedCards((prevState) => ({
      ...prevState,
      [moduleId]: !prevState[moduleId],
    }));
  };

  const handleButtonClick = (moduleId) => {
    navigate(`/student/courses/${courseId}/modules/${moduleId}`);
  };

  const incompleteModules = modules.filter((module) => !module.isFinalTest && !module.completed);
  const completedModules = modules.filter((module) => module.completed);
  const finalTestModule = modules.find((module) => module.isFinalTest && !module.completed);

  const progress =
    modules.length > 0 ? Math.round((completedModules.length / modules.length) * 100) : 0;

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

  let alertMessage = 'No modules available for this course.';

  if (incompleteModules.length === 0) {
    if (finalTestModule) {
      if (finalTestModule.completed) {
        alertMessage = 'Congratulations! You have completed this course.';
      } else {
        alertMessage = 'Take the final test to complete the course.';
      }
    } else {
      alertMessage = 'Congratulations! You have completed this course.';
    }
  }

  return (
    <Container>
      <h1 className="text-center mt-4 mb-4">{course.title}</h1>
      <ProgressBar progress={progress} />

      {incompleteModules.length > 0 ? (
        <>
          <h2 className="text-center mt-4 mb-4">Remaining Modules</h2>
          <ModuleList
            modules={incompleteModules}
            flippedCards={flippedCards}
            handleModuleClick={handleModuleClick}
            handleButtonClick={handleButtonClick}
          />
        </>
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
            handleButtonClick={handleButtonClick}
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
            handleButtonClick={handleButtonClick}
          />
        </>
      )}
    </Container>
  );
};

export default ModuleDashboard;
