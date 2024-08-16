import React, { useState } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';

const ModalViewer = ({ resources }) => {
  const [showModal, setShowModal] = useState(false);
  const [activeResource, setActiveResource] = useState(null);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setActiveResource(null);
  };

  return (
    <>
      <Button variant="outline-info additional-resources-btn" onClick={handleOpenModal}>
        Additional Resources
      </Button>
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Optional Resources</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {resources.map((resource, index) => (
              <Col md={3} key={index} className="mb-3">
                <div
                  onClick={() => setActiveResource(resource)}
                  style={{
                    cursor: 'pointer',
                    border: '1px solid #ccc',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <iframe
                    src={resource.url}
                    width="100%"
                    height="200px"
                    style={{ borderRadius: '10px', border: 'none' }}
                    title={resource.title}
                    frameBorder="0"
                  ></iframe>
                  <div style={{ padding: '10px', textAlign: 'center', background: '#f8f9fa' }}>
                    {resource.title}
                  </div>
                </div>
              </Col>
            ))}
          </Row>

          {activeResource && (
            <div className="pdf-viewer">
              <iframe
                src={activeResource.url}
                width="100%"
                height="500px"
                style={{ borderRadius: '10px' }}
                title={activeResource.title}
                frameBorder="0"
              ></iframe>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {activeResource && (
            <Button variant="outline-secondary" onClick={() => setActiveResource(null)}>
              Back to List
            </Button>
          )}
          <Button variant="outline-secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalViewer;
