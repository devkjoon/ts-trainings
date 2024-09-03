import React, { useState } from 'react';
import { Container, Button, Row, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import API_URL from '../../config';

import AdminTokenVerification from '../../hooks/AdminTokenVerification';
import useStudentData from '../../hooks/StudentList/useStudentData';
import FilterComponent from '../../components/StudentList/FilterComponent';
import AssignCourseModal from '../../components/Modals/AssignCourse';
import NewStudentModal from '../../components/Modals/StudentList/NewStudent';
import EditStudentModal from '../../components/Modals/StudentList/EditStudent';
import StudentTable from '../../components/StudentList/StudentTable';

import '../../assets/css/StudentList.css';
import '../../assets/css/Modals.css';

export default function StudentList() {
    AdminTokenVerification();

    const { students, setStudents, companies, courses, error } = useStudentData();

    const [companyFilter, setCompanyFilter] = useState('');
    const [courseFilter, setCourseFilter] = useState('');
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showNewStudentModal, setShowNewStudentModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [studentToEdit, setStudentToEdit] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
    const [isLoading, setIsLoading] = useState(false);

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');

    const filteredStudents = students.filter(student => {
        let matchesCompany = true;
        let matchesCourse = true;

        if (companyFilter) {
            matchesCompany = student.company && student.company._id === companyFilter;
        }

        if (courseFilter) {
            matchesCourse = student.courseProgress && student.courseProgress.some(course => course.courseId === courseFilter);
        }

        return matchesCompany && matchesCourse;
    });

    if (error) {
        return (
            <Container className="student-list-container">
                <Alert variant="danger">Failed to load student data: {error}</Alert>
            </Container>
        );
    }

    const handleStudentCreation = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/student/newStudent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ firstname, lastname, email, company }),
            });

            const result = await response.json();
            if (result.success) {
                setStudents((prevStudents) => [...prevStudents, result.student]);
                showAlert('New student added successfully', 'success');
                handleCloseNewStudentModal();
            } else {
                showAlert(result.message || 'Unsuccessful, please try again later', 'danger');
            }
        } catch (error) {
            console.error('Error adding new student:', error);
            showAlert('Failed to add student. Please try again later.', 'danger');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteStudent = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) return;

        try {
            const response = await fetch(`${API_URL}/student/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) throw new Error('Failed to delete student');
            setStudents((prevStudents) => prevStudents.filter((student) => student._id !== id));
            showAlert('Deleted student', 'success');
        } catch (error) {
            console.error('Error deleting student:', error);
            showAlert('Failed to delete student. Please try again later.', 'danger');
        }
    };

    const handleUpdateStudent = async (updatedStudent) => {
        try {
            const response = await fetch(`${API_URL}/student/${updatedStudent._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    firstname: updatedStudent.firstname,
                    lastname: updatedStudent.lastname,
                    email: updatedStudent.email,
                    company: updatedStudent.company,
                }),
            });

            const result = await response.json();

            if (result.success) {
                const allStudentsResponse = await fetch(`${API_URL}/student`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                const allStudentsData = await allStudentsResponse.json();
                setStudents(allStudentsData.students);
                showAlert('Student updated successfully', 'success');
                handleCloseEditModal();
            } else {
                showAlert(result.message || 'Failed to update student. Please try again later.', 'danger');
            }
        } catch (error) {
            console.error('Error updating student:', error);
            showAlert('Failed to update student. Please try again later.', 'danger');
        }
    };

    const resetFilters = () => {
        setCompanyFilter('');
        setCourseFilter('');
    };

    const showAlert = (message, variant) => {
        setAlert({ show: true, message, variant });
        setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
    };

    const handleShowAssignModal = (studentId) => {
        setSelectedStudent(studentId);
        setShowAssignModal(true);
    };

    const handleCloseAssignModal = () => {
        setShowAssignModal(false);
        setSelectedStudent(null);
    };

    const handleShowNewStudentModal = () => {
        setShowNewStudentModal(true);
    };

    const handleCloseNewStudentModal = () => {
        setShowNewStudentModal(false);
        resetForm();
    };

    const handleShowEditModal = (student) => {
        setStudentToEdit(student);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setStudentToEdit(null);
    };

    const resetForm = () => {
        setFirstname('');
        setLastname('');
        setEmail('');
        setCompany('');
    };

    return (
        <Container className='student-list-container'>
            <Row>
                <h1 className='mt-4 mb-3'>Student List</h1>
            </Row>
            <FilterComponent
                companies={companies}
                courses={courses}
                companyFilter={companyFilter}
                courseFilter={courseFilter}
                setCompanyFilter={setCompanyFilter}
                setCourseFilter={setCourseFilter}
                resetFilters={resetFilters}
                handleShowNewStudentModal={handleShowNewStudentModal}
            />
            <div className='table-container'>
                {alert.show && (
                    <Alert
                        variant={alert.variant}
                        onClose={() => setAlert({ show: false })}
                        dismissible>
                        {alert.message}
                    </Alert>
                )}
                <StudentTable 
                    students={filteredStudents}
                    handleShowAssignModal={handleShowAssignModal}
                    handleShowEditModal={handleShowEditModal}
                    handleDeleteStudent={handleDeleteStudent}
                />
                <Link to='/admin/dashboard' className='no-underline'>
                    <Button className='button-25 mt-3' variant='outline-info' size='lg'>
                        Back
                    </Button>
                </Link>
            </div>
            {selectedStudent && (
                <AssignCourseModal
                    show={showAssignModal}
                    handleClose={handleCloseAssignModal}
                    studentId={selectedStudent}
                    showAlert={showAlert}
                    companies={companies}
                    courses={courses}
                    setStudents={setStudents}
                />
            )}
            {studentToEdit && (
                <EditStudentModal
                    show={showEditModal}
                    handleClose={handleCloseEditModal}
                    student={studentToEdit}
                    handleUpdateStudent={handleUpdateStudent}
                    showAlert={showAlert}
                    companies={companies}
                />
            )}
            <NewStudentModal
                show={showNewStudentModal}
                handleClose={handleCloseNewStudentModal}
                handleSubmit={handleStudentCreation}
                firstname={firstname}
                setFirstname={setFirstname}
                lastname={lastname}
                setLastname={setLastname}
                email={email}
                setEmail={setEmail}
                company={company}
                setCompany={setCompany}
                companies={companies}
                isLoading={isLoading}
            />
        </Container>
    );
}
