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
        <Table striped bordered hover className='custom-table'>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Login Code</th>
                </tr>
            </thead>
            <tbody>
                {students.map((student) => (
                    <React.Fragment key={student._id}>
                        <tr onClick={() => toggleCollapse(student._id)}>
                            <td>
                                <span className='label-prefix'>Student: </span>
                                <span className='data-text'>{`${student.firstname} ${student.lastname}`}</span>
                            </td>
                            <td>
                                <span className='label-prefix'>Login Code: </span>
                                <span className='data-text'>{student.loginCode}</span>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan='2' style={{ padding: 0 }}>
                                <Collapse in={open[student._id]}>
                                    <div className='p-2'>
                                        <Table bordered>
                                            <tbody>
                                                <tr>
                                                    <td><strong>First Name:</strong></td>
                                                    <td>{student.firstname}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Last Name:</strong></td>
                                                    <td>{student.lastname}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Email:</strong></td>
                                                    <td>{student.email}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Company:</strong></td>
                                                    <td>{student.company && student.company.name ? student.company.name : 'No Company'}</td>
                                                </tr>
                                                <tr className='courses-assigned-row'>
                                                    <td><strong>Courses Assigned:</strong></td>
                                                    <td>
                                                        {student.courseProgress && student.courseProgress.length > 0 ? (
                                                            student.courseProgress.map((course) => (
                                                                <div key={course.courseId} className='courses-assigned-content'>
                                                                    <span className='course-name'>{course.courseName}</span>
                                                                    <span className='course-progress'>{course.progress}% Complete</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <span>No courses assigned</span>
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Actions:</strong></td>
                                                    <td className='actions-cell'>
                                                        <Button
                                                            variant='outline-info'
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
    );
};

export default StudentTable;