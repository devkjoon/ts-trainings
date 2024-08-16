import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import API_URL from '../../config';

const QuizForm = ({ quiz, moduleId, onSubmitResult }) => {
  const [answers, setAnswers] = useState(new Array(quiz.questions.length).fill(null));

  const handleAnswerChange = (idx, value) => {
    const newAnswers = [...answers];
    newAnswers[idx] = parseInt(value, 10);
    setAnswers(newAnswers);
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/module/${moduleId}/submit-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers, studentId: localStorage.getItem('studentId') }),
      });

      const result = await response.json();
      onSubmitResult(result.message);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      onSubmitResult('An error occurred while submitting the quiz. Please try again.');
    }
  };

  return (
    <Form onSubmit={handleQuizSubmit} className="mt-3 test-form">
      <Row>
        <Col md={12} className="px-3">
          {quiz.questions.map((q, idx) => (
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
      <div className='mt-3 text-center module-btn-container'>
        <Button className="mx-2 test-btn" variant="outline-info" type="submit">
          Submit Test
        </Button>
      </div>
    </Form>
  );
};

export default QuizForm;
