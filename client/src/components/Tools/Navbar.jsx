import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, matchPath } from 'react-router-dom';
import '../../assets/css/Navbar.css';
import logo from '../../assets/images/logo.png';

const TopNavbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const storedUserType = localStorage.getItem('userType');
      if (token) {
        setIsLoggedIn(true);
        setUserType(storedUserType);
      } else {
        setIsLoggedIn(false);
        setUserType('');
      }
    };

    checkLoginStatus();

    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location]); // re-run the effect when the location changes

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('studentId');
    // localStorage.clear();
    setIsLoggedIn(false);
    setIsOpen(false);
    navigate('/');
  };

  const handleDashboard = () => {
    if (userType === 'admin') {
      navigate('/admin/dashboard');
      setIsOpen(false);
    } else if (userType === 'student') {
      navigate('/student/dashboard');
      setIsOpen(false);
    } else {
      navigate('/');
      setIsOpen(false);
    }
  };

  const hiddenRoutes = [
    '/',
    '/admin',
    '/admin/registration',
    '/admin/login',
    '/student/login',
    '/admin/reset-password/:token',
  ];

  // Check if the current route is hidden
  const isHiddenRoute = hiddenRoutes.some((route) => matchPath(route, location.pathname));

  // Define dashboard routes for admin and student
  const dashboardRoutes = {
    admin: '/admin/dashboard',
    student: '/student/dashboard',
  };

  // Check if the current path is a dashboard route
  const isDashboardRoute = location.pathname === dashboardRoutes[userType];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogoClick = () => {
    if (isLoggedIn) {
      handleDashboard();
    } else {
      navigate('/');
    }
  };

  return (
    <nav className={`navbar ${isOpen ? 'navbar-open' : ''}`}>
      <div className="navbar-brand" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <img src={logo} alt="Think Safety Trainings" className="navbar-logo" />
        <span className="navbar-company-name">
          <span className="navbar-company-think">Think </span> 
          <span className="navbar-company-safety">Safety</span>
        </span>
      </div>
      {isLoggedIn && (
        <>
          <button className="burger-menu" onClick={toggleMenu}>
            &#9776;
          </button>
          {!isHiddenRoute && (
            <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
              {!isDashboardRoute && (
                <button className="nav-link navbar-links-text" onClick={handleDashboard}>
                  Dashboard
                </button>
              )}
              <button className="nav-link navbar-links-text" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          )}
        </>
      )}
    </nav>
  );
};

export default TopNavbar;
