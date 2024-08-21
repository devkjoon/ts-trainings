import React, { useEffect, useState } from 'react';
import {
	Container,
	Button,
	Row,
	Col,
	Table,
	Alert,
	Collapse,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

import API_URL from '../../config';

import AdminTokenVerification from '../../hooks/AdminTokenVerification';
import AssignCourseModal from '../../components/Modals/AssignCourse';
import NewStudentModal from '../../components/Modals/AddNewStudent';
import EditStudentModal from '../../components/Modals/EditStudent';

import '../../assets/css/StudentList.css';

export default function StudentList() {
	const [students, setStudents] = useState([]);
	const [companies, setCompanies] = useState([]);
	const [showAssignModal, setShowAssignModal] = useState(false);
	const [showNewStudentModal, setShowNewStudentModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [studentToEdit, setStudentToEdit] = useState(null);
	const [selectedStudent, setSelectedStudent] = useState(null);
	const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
	const [isLoading, setIsLoading] = useState(false);
	const [open, setOpen] = useState({});

	const [firstname, setFirstname] = useState('');
	const [lastname, setLastname] = useState('');
	const [email, setEmail] = useState('');
	const [company, setCompany] = useState('');

	AdminTokenVerification();

	useEffect(() => {
		const fetchStudents = async () => {
			try {
				const response = await fetch(`${API_URL}/student`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				});

				if (!response.ok) {
					throw new Error('Failed to fetch students');
				}

				const data = await response.json();
				setStudents(data.students);
			} catch (error) {
				console.error('Error fetching students:', error);
			}
		};

		const fetchCompanies = async () => {
			try {
				const response = await fetch(`${API_URL}/company`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				});

				if (!response.ok) {
					throw new Error('Failed to fetch companies');
				}
				const data = await response.json();
				setCompanies(data.companies);
			} catch (error) {
				console.error('Error fetching companies:', error);
			}
		};

		fetchStudents();
		fetchCompanies();
	}, []);

	const handleStudentCreation = async (event) => {
		event.preventDefault();
		setIsLoading(true); // Show spinner

		try {
			const response = await fetch(`${API_URL}/student/newStudent`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: Bearer`${localStorage.getItem('token')}`,
				},
				body: JSON.stringify({ firstname, lastname, email, company }),
			});

			const result = await response.json();
			if (result.success) {
				setStudents((prevStudents) => [...prevStudents, result.student]);
				showAlert('New student added successfully', 'success');
				handleCloseNewStudentModal();
			} else {
				showAlert(
					result.message || 'Unsuccessful, please try again later',
					'danger'
				);
			}
		} catch (error) {
			console.error('Error adding new student:', error);
			showAlert('Failed to add student. Please try again later.', 'danger');
		} finally {
			setIsLoading(false);
		}
	};

	const toggleCollapse = (id) => {
		setOpen((prevOpen) => ({
			...prevOpen,
			[id]: !prevOpen[id],
		}));
	};

	const handleDeleteStudent = async (id) => {
		const token = localStorage.getItem('token');
		if (
			!window.confirm(
				'Are you sure you want to delete this student? This action cannot be undone.'
			)
		)
			return;

		try {
			const response = await fetch(`${API_URL}/student/${id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			if (!response.ok) throw new Error('Failed to delete student');
			setStudents((prevStudents) =>
				prevStudents.filter((student) => student._id !== id)
			);
			showAlert('Deleted student', 'success');
		} catch (error) {
			console.error('Error deleting student:', error);
			showAlert('Failed to delete student. Please try again later.', 'danger');
		}
	};

	const handleUpdateStudent = async (updatedStudent) => {
    try {
      // Update the student
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
      console.log('API Response:', result); // Debugging purpose
  
      if (result.success) {
        // Fetch the updated list of students including courses and progress
        const allStudentsResponse = await fetch(`${API_URL}/student`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
  
        const allStudentsData = await allStudentsResponse.json();
        console.log('All Students Data:', allStudentsData); // Debugging purpose
  
        // Update the state with the new list of students
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
		<Container>
			<Row>
				<Col sm={12}>
					<h1 className='mt-4 mb-3'>Student List</h1>
				</Col>
				<Col className='m-auto p-auto'>
					<Button
						className='company-button mb-2'
						variant='outline-info'
						onClick={handleShowNewStudentModal}>
						Add New Company
					</Button>
				</Col>
			</Row>
			<div className='table-container'>
				{alert.show && (
					<Alert
						variant={alert.variant}
						onClose={() => setAlert({ show: false })}
						dismissible>
						{alert.message}
					</Alert>
				)}
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
								{console.log(student)}
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
															<td>
																<strong>First Name:</strong>
															</td>
															<td>{student.firstname}</td>
														</tr>
														<tr>
															<td>
																<strong>Last Name:</strong>
															</td>
															<td>{student.lastname}</td>
														</tr>
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
															<td>
																{student.company && student.company.name
																	? student.company.name
																	: 'No Company'}
															</td>
														</tr>
														<tr className='courses-assigned-row'>
															<td>
																<strong>Courses Assigned:</strong>
															</td>
															<td>
																{student.courseProgress?.map((course) => (
																	<div
																		key={course.courseId}
																		className='courses-assigned-content'>
																		<span className='course-name'>
																			{course.courseName}
																		</span>
																		<span className='course-progress'>
																			{course.progress}% Complete
																		</span>
																	</div>
																)) || 'Loading...'}
															</td>
														</tr>
														<tr>
															<td>
																<strong>Actions:</strong>
															</td>
															<td className='actions-cell'>
																<Button
																	variant='outline-info'
																	onClick={() =>
																		handleShowAssignModal(student._id)
																	}>
																	Assign Course
																</Button>
																<Button
																	variant='outline-warning'
																	onClick={() => handleShowEditModal(student)}>
																	Edit
																</Button>
																<Button
																	variant='outline-danger'
																	onClick={() =>
																		handleDeleteStudent(student._id)
																	}>
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
				/>
			)}

			{studentToEdit && (
				<EditStudentModal
					show={showEditModal}
					handleClose={handleCloseEditModal}
					student={studentToEdit}
					handleUpdateStudent={handleUpdateStudent}
					showAlert={showAlert}
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
