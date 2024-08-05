import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Alert, Spinner } from 'react-bootstrap';

import '../../assets/css/ModuleViewer.css'

const ModuleViewer = () => {
  const { courseId, moduleId } = useParams();
  const [module, setModule] = useState(null);
  const [allModules, setAllModules] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const navigate = useNavigate();

  const quizRef = useRef(null);
  const videoRef = useRef(null);
  const alertRef = useRef(null);

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

        const allModulesResponse = await fetch(`http://localhost:5000/courses/${courseId}/modules`);
        if (!allModulesResponse.ok) {
          throw new Error('Failed to fetch all modules');
        }
        const allModulesData = await allModulesResponse.json();
        setAllModules(allModulesData.modules);
      } catch (error) {
        console.error('Error fetching module:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [courseId, moduleId]);

  useEffect(() => {
    if (quizResult) {
      if (alertRef.current) {
        alertRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [quizResult]);
  
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

      if (result.success) {
        setQuizPassed(true);
      }
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

  const handleReturnToDashboard = () => {
    if (courseId) {
      navigate(`/student/courses/${courseId}/modules`);
    } else {
      console.error("Course ID is undefined")
    }
  };

  const toggleQuizVisibility = () => {
    setShowQuiz(!showQuiz);
    setTimeout(() => {
      if (quizRef.current) {
        quizRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const scrollToVideo = () => {
    if (videoRef.current) {
      videoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
        <video ref={videoRef} width="600" controls>
          <source src={module.resource.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else if (module?.resource?.type === 'powerpoint') {
      return <iframe ref={videoRef} src={module.resource.url} width="600" height="400" title={module.title}></iframe>;
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
      <h2 className="text-center mt-4 mb-4">{module?.title}</h2>
      <Row>
        <Col md={module?.resource?.type ? 5 : 12}>
          <h4>Objectives</h4>
          {module?.description && (
            <ul style={{ fontStyle: 'italic', paddingLeft: '20px', textAlign: 'left' }}>
              {module.description.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
        </Col>
        {module?.resource?.type && (
          <Col md={7} className="d-flex justify-content-center">
            {renderResource()}
          </Col>
        )}
      </Row>

      {module?.quiz && !showQuiz && (
        <div className="mt-3 text-center">
          <Button className="mx-2 module-btn" variant="outline-warning" onClick={handleReturnToDashboard}>
            Module Dashboard
          </Button>
          <Button className="mx-2 module-btn" variant="outline-info" onClick={toggleQuizVisibility}>
            Take Test
          </Button>
        </div>
      )}

      {showQuiz && module?.quiz && (
        <Form ref={quizRef} onSubmit={handleQuizSubmit} className="mt-3 test-form">
          <Row>
            <Col md={12} className="px-3">
              {module.quiz.questions.map((q, idx) => (
                <Form.Group key={idx} controlId={`question-${idx}`} style={{ textAlign: 'left' }}>
                  <Form.Label style={{ display: 'block', textAlign: 'left' }}>
                    <span className="font-weight-bold">{`${idx + 1}:`}</span> {q.question}
                  </Form.Label>
                  <div style={{ paddingLeft: '20px', marginLeft: '10px' }}>
                    {q.options.map((option, optionIdx) => (
                      <Form.Check
                        type="radio"
                        name={`question-${idx}`}
                        key={optionIdx}
                        label={option}
                        value={optionIdx}
                        checked={answers[idx] === optionIdx}
                        onChange={(e) => handleAnswerChange(idx, e.target.value)}
                        className="my-2"
                      />
                    ))}
                  </div>
                </Form.Group>
              ))}
            </Col>
          </Row>

          <div className='mt-3 text-center test-btn-container'>
            {quizPassed ? (
              <>
              <Button className="mx-2 test-btn" variant="outline-info" onClick={handleReturnToDashboard} >
              Return to Module Dashboard
            </Button>
              </>
            ) : (
              <>
              <Button className="mx-2 test-btn" variant="outline-warning" onClick={scrollToVideo} >
              Review Video
            </Button>
            <Button className="mx-2 test-btn" variant="outline-info" type="submit" >
              Submit Test
            </Button>
              </>
            )}
          </div>
        </Form>
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