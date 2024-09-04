import React from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import AdminTokenVerification from '../../hooks/AdminTokenVerification';

import '../../assets/css/Dashboard.css';

export default function AdminDashboard() {
  AdminTokenVerification();

  const dashboardItems = [
    { title: 'Students', icon: '👨‍🎓', link: '/admin/students', color: '#ffc107' },
    { title: 'Companies', icon: '🏢', link: '/admin/companies', color: '#17a2b8' },
    { title: 'Analytics', icon: '📊', link: '/admin/analytics', color: '#28a745' },
    { title: 'Course Directory', icon: '📚', link: '/admin/courses', color: '#ffc107' },
  ];

  return (
    <Container fluid className='dashboardContainer'>
      <Row className="g-3 dashboard-row justify-content-center">
        {dashboardItems.map((item, index) => (
          <Col key={index} xs={12} sm={6} lg={3} className="d-flex justify-content-center">
            <Link to={item.link} className='text-decoration-none w-100'>
              <Card className="dashboard-card shadow-sm hover-effect">
                <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                  <div className="icon-container mb-2" style={{ color: item.color }}>
                    {item.icon}
                  </div>
                  <Card.Title className="text-center">{item.title}</Card.Title>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
