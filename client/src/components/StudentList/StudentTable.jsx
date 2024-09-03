import React, { useState } from 'react';
import { Table, Button, Collapse } from 'react-bootstrap';

const StudentTable = ({ students, handleShowAssignModal, handleShowEditModal, handleDeleteStudent }) => {
  const [open, setOpen] = useState({});

  const toggleCollapse = (id) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [id]: !prevOpen[id],
    }));
  };

  return (
      <div className="table-responsive">
        <Table striped bordered hover className='custom-table'>
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
                      <span className='label-prefix'>Student: </span>
                      <span className='data-text'>{`${student.firstname} ${student.lastname}`}</span>
                    </td>
                    <td className="main-column">
                      <span className='label-prefix'>Login Code: </span>
                      <span className='data-text'>{student.loginCode}</span>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan='2' className="p-0">
                      <Collapse in={open[student._id]}>
                        <div className='p-2'>
                          <Table bordered>
                            <tbody>
                              <tr>
                                <td><strong>Email:</strong></td>
                                <td>{student.email}</td>
                              </tr>
                              <tr>
                                <td><strong>Company:</strong></td>
                                <td>{student.company ? student.company.name : 'N/A'}</td>
                              </tr>
                              <tr>
                                <td><strong>Actions:</strong></td>
                                <td className='actions-cell'>
                                  <Button
                                    variant='outline-primary'
                                    onClick={() => handleShowAssignModal(student._id)}>
                                    Assign Course
                                  </Button>
                                  <Button
                                    variant='outline-warning'
                                    onClick={() => handleShowEditModal(student)}>
                                    Edit
                                  </Button>
                                  <Button
                                    variant='outline-danger'
                                    onClick={() => handleDeleteStudent(student._id)}>
                                    Delete
                                  </Button>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
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