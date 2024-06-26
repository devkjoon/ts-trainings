import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Section from './Section';
import { useParams } from 'react-router-dom';

const Course = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${courseId}`);
        const data = await response.json();
        setCourse(data.course);
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <h1 className="text-center mt-4 mb-4">{course.title}</h1>
      <p>{course.description}</p>
      {course.sections.map((section) => (
        <Section key={section.id} section={section} />
      ))}
    </Container>
  );
};

export default Course;
