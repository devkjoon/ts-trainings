import { useEffect, useState } from 'react';
import API_URL from '../../config';

const useStudentData = () => {
    const [students, setStudents] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const studentResponse = await fetch(`${API_URL}/student`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const studentData = await studentResponse.json();
                setStudents(studentData.students);

                const companyResponse = await fetch(`${API_URL}/company`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const companyData = await companyResponse.json();
                setCompanies(companyData.companies);

                const courseResponse = await fetch(`${API_URL}/courses`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const courseData = await courseResponse.json();
                setCourses(courseData.courses);

            } catch (error) {
                setError('Failed to fetch data');
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return { students, setStudents, companies, courses, error };
};

export default useStudentData;
