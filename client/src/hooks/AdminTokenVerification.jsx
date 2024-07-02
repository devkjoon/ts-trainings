import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminTokenVerification() {

    const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/admin/protected-resource',{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch protected resource');
        }
        const responseData = await response.json();
        setData(responseData);
      } catch (error) {
        console.error('Error fetching data:', error);
        navigate('/student/dashboard');
      }
    };
    fetchData();
  }, [navigate]);
}