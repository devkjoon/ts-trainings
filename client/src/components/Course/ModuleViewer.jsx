import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Form, Alert, Spinner } from 'react-bootstrap';

import '../../assets/css/ModuleViewer.css'

const ModuleViewer = () => {
  const { courseId, moduleId } = useParams();
  const [module, setModule] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const response = await fetch(`http://localhost:5000/module/${moduleId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch module');
        }
        const data = await response.json();
        setModule(data.module);
        setAnswers(new Array(data.module.quiz?.questions.length).fill(null));
      } catch (error) {
        console.error('Error fetching module:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [moduleId]);

  const handleQuizSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/module/${module._id}/submit-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers, studentId: localStorage.getItem('studentId') }),
      });

      const result = await response.json();
      setQuizResult(result.message);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setQuizResult('An error occurred while submitting the quiz. Please try again.');
    }
  };

  const handleAnswerChange = (idx, value) => {
    const newAnswers = [...answers];
    newAnswers[idx] = parseInt(value, 10);
    setAnswers(newAnswers);
  };

  const handleBackToDashboard = () => {
    if (courseId) {
      navigate(`/student/courses/${courseId}/modules`);
    } else {
      console.error("Course ID is undefined")
    }
  };

  const toggleQuizVisibility = () => {
    setShowQuiz(!showQuiz);
  };

  const renderResource = () => {
    if (module?.resource?.type === 'video') {
      // Check if the URL is from YouTube or another supported video platform
      const isYouTube = module.resource.url.includes('youtube.com') || module.resource.url.includes('youtu.be');
      
      if (isYouTube) {
        // Extract the video ID for embedding
        const videoId = module.resource.url.split('v=')[1] || module.resource.url.split('/').pop();
        return (
          <iframe
            width="600"
            height="400"
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={module.title}
          ></iframe>
        );
      }
  
      // If it's a direct MP4 link, use the <video> tag
      return (
        <video width="600" controls>
          <source src={module.resource.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else if (module?.resource?.type === 'powerpoint') {
      return <iframe src={module.resource.url} width="600" height="400" title={module.title}></iframe>;
    }
    return null;
  };

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
      <h2>{module?.title}</h2>
      <p>{module?.description}</p>
      {renderResource()}
      
      {module?.quiz && !showQuiz && (
        <div className="mt-3">
          <Button className='mx-2 module-btn' variant="outline-warning" onClick={handleBackToDashboard}>Module Dashboard</Button>
          <Button className='mx-2 module-btn' variant="outline-info" onClick={toggleQuizVisibility}>Take Test</Button>
        </div>
      )}

      {showQuiz && module?.quiz && (
        <Form onSubmit={handleQuizSubmit} className="mt-3">
          {module.quiz.questions.map((q, idx) => (
            <Form.Group key={idx} controlId={`question-${idx}`}>
              <Form.Label>{q.question}</Form.Label>
              {q.options.map((option, optionIdx) => (
                <Form.Check
                  type="radio"
                  name={`question-${idx}`}
                  key={optionIdx}
                  label={option}
                  value={optionIdx}
                  checked={answers[idx] === optionIdx}
                  onChange={(e) => handleAnswerChange(idx, e.target.value)}
                />
              ))}
            </Form.Group>
          ))}
          <Button variant="primary" type="submit">
            Submit Quiz
          </Button>
        </Form>
      )}

      {quizResult && (
        <Alert variant={quizResult === 'Quiz passed!' ? 'success' : 'danger'}>
          {quizResult}
        </Alert>
      )}
    </Container>
  );
};

export default ModuleViewer;
