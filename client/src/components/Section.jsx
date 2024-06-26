import React, { useState } from 'react';
import { Container, Button, Form, Alert } from 'react-bootstrap';

const Section = ({ section }) => {
  const { title, description, resource, quiz } = section;
  const [answers, setAnswers] = useState(new Array(quiz.questions.length).fill(null));
  const [quizResult, setQuizResult] = useState(null);

  const handleQuizSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/sections/${section._id}/submit-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers })
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
    newAnswers[idx] = parseInt(value);
    setAnswers(newAnswers);
  };

  return (
    <Container>
      <h2>{title}</h2>
      <p>{description}</p>
      {resource.type === 'video' && (
        <video width="600" controls>
          <source src={resource.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {resource.type === 'powerpoint' && (
        <iframe src={resource.url} width="600" height="400" title={title}></iframe>
      )}
      {quiz && (
        <Form onSubmit={handleQuizSubmit}>
          {quiz.questions.map((q, idx) => (
            <Form.Group key={idx} controlId={`question-${idx}`}>
              <Form.Label>{q.question}</Form.Label>
              {q.options.map((option, optionIdx) => (
                <Form.Check
                  type="radio"
                  name={`question-${idx}`}
                  key={optionIdx}
                  label={option}
                  value={optionIdx}
                  onChange={() => handleAnswerChange(idx, optionIdx)}
                />
              ))}
            </Form.Group>
          ))}
          <Button variant="primary" type="submit">
            Submit Quiz
          </Button>
        </Form>
      )}
      {quizResult && <Alert variant={quizResult === 'Quiz passed!' ? 'success' : 'danger'}>{quizResult}</Alert>}
    </Container>
  );
};

export default Section;
