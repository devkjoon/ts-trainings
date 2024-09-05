import React, { useState } from 'react';
import { Table, Row, Col, Button, Collapse } from 'react-bootstrap';

const StudentTable = ({
  students,
  courses,
  handleShowAssignModal,
  handleShowEditModal,
  handleDeleteStudent,
  handleSendLoginCode,
}) => {
  const [open, setOpen] = useState({});

  const toggleCollapse = (id) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [id]: !prevOpen[id],
    }));
  };

  const getCourseTitle = (courseId) => {
    const course = courses.find((c) => c._id === courseId);
    return course ? course.title : 'Unknown Course';
  };

  return (
    <div className="table-responsive">
      <Table striped bordered hover className="custom-table">
        <thead>
          <tr>
            <th className="main-column">Name</th>
            <th className="main-column">Login Code</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <React.Fragment key={student._id}>
              <tr onClick={() => toggleCollapse(student._id)}>
                <td className="main-column">
                  <span className="label-prefix">Student: </span>
                  <span className="data-text">{`${student.firstname} ${student.lastname}`}</span>
                </td>
                <td className="main-column">
                  <span className="label-prefix">Login Code: </span>
                  <span className="data-text">{student.loginCode}</span>
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="p-0">
                  <Collapse in={open[student._id]}>
                    <div className="p-2">
                      <div className="table-responsive">
                        <Table bordered>
                          <tbody>
                            <tr>
                              <td>
                                <strong>Email:</strong>
                              </td>
                              <td>{student.email}</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Company:</strong>
                              </td>
                              <td>{student.company ? student.company.name : 'N/A'}</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Enrolled Courses:</strong>
                              </td>
                              <td>
                                {student.courseProgress && student.courseProgress.length > 0 ? (
                                  <ul className="list-unstyled mb-0">
                                    {student.courseProgress.map((course, index) => (
                                      <li
                                        key={index}
                                        className="d-flex justify-content-between align-items-center"
                                      >
                                        <span>{getCourseTitle(course.courseId)}</span>
                                        <span>Progress: {course.progress}%</span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  'No enrolled courses'
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Completed Courses:</strong>
                              </td>
                              <td>
                                {student.completedCourses && student.completedCourses.length > 0 ? (
                                  <ul className="list-unstyled mb-0">
                                    {student.completedCourses.map((course, index) => (
                                      <li key={index}>{getCourseTitle(course.courseId)}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  'No completed courses'
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Actions:</strong>
                              </td>
                              <td className="actions-cell">
                                <Row>
                                  <Col>
                                    <Button
                                      variant="outline-primary"
                                      onClick={() => handleShowAssignModal(student._id)}
                                    >
                                      Assign Course
                                    </Button>
                                  </Col>
                                  <Col>
                                    <Button
                                      variant="outline-warning"
                                      onClick={() => handleShowEditModal(student)}
                                    >
                                      Edit Student
                                    </Button>
                                  </Col>
                                  <Col>
                                    <Button
                                      variant="outline-danger"
                                      onClick={() => handleDeleteStudent(student._id)}
                                    >
                                      Delete Student
                                    </Button>
                                  </Col>
                                  <Col>
                                    <Button
                                      variant="outline-info"
                                      onClick={() =>
                                        handleSendLoginCode(student._id, student.email)
                                      }
                                    >
                                      Send Login Code
                                    </Button>
                                  </Col>
                                </Row>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </Collapse>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default StudentTable;
