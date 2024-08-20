import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

export default function AdminTokenVerification() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You are not authenticated. Redirecting to homepage");
        navigate("/");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/admin/protected-resource`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch protected resource");
        }

        const responseData = await response.json();
        setData(responseData);
      } catch (error) {
        console.error("Error fetching data:", error);
        localStorage.removeItem("token");
        alert("Authentication failed. Redirecting to homepage");
        navigate("/");
      }
    };

    fetchData();
  }, [navigate]);

  return data;
}
