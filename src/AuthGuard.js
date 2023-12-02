// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, onAuthStateChanged } from './firebase';

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Redirect to the home route if no user is signed in
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return <>{children}</>;
};

export default AuthGuard;
