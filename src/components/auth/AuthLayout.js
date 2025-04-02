import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Login from './Login';
import Register from './Register';
import { Toaster } from 'react-hot-toast';

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

const AuthLayout = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [[page, direction], setPage] = useState([0, 0]);

  const toggleForm = () => {
    const newPage = page === 0 ? 1 : 0;
    const newDirection = page < newPage ? 1 : -1;
    setPage([newPage, newDirection]);
    setIsLogin(!isLogin);
  };

  const handleAuthSuccess = (data) => {
    authLogin(data.token);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-dark-card rounded-2xl shadow-2xl overflow-hidden flex">
        {/* Left side - Image and branding */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/20">
            <img
              src="/images/login.jpg"
              alt="Authentication background"
              className="w-full h-full object-cover mix-blend-overlay"
            />
          </div>
          <div className="relative z-10 p-12 flex flex-col justify-between h-full text-white">
            <div>
              <h1 className="text-4xl font-bold mb-4">
                Welcome to Your
                <br />
                Travel Assistant
              </h1>
              <p className="text-lg opacity-90">
                Discover amazing accommodations and create unforgettable memories with our AI-powered travel companion.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-sm opacity-80">
                "Travel is the only thing you buy that makes you richer."
              </p>
              <p className="text-xs opacity-70">
                – Anonymous
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Auth forms */}
        <div className="w-full lg:w-1/2 bg-dark-card p-8">
          <div className="relative overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              {isLogin ? (
                <motion.div
                  key="login"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                >
                  <Login
                    onToggleForm={toggleForm}
                    onLoginSuccess={handleAuthSuccess}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                >
                  <Register
                    onToggleForm={toggleForm}
                    onRegisterSuccess={handleAuthSuccess}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#059669',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#DC2626',
            },
          },
        }}
      />
    </div>
  );
};

export default AuthLayout;
