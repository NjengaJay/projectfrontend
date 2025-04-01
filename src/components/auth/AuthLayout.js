import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Login from './Login';
import Register from './Register';
import { Toaster } from 'react-hot-toast';

const AuthLayout = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-dark-card rounded-2xl shadow-2xl overflow-hidden flex">
        {/* Left side - Image and branding */}
        <div className="hidden lg:block lg:w-1/2 relative bg-dark-lighter">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent">
            <img
              src="/images/auth-bg.jpg"
              alt="Authentication background"
              className="w-full h-full object-cover opacity-50"
            />
          </div>
          <div className="relative z-10 p-12 flex flex-col justify-between h-full">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Capturing Moments,
                <br />
                Creating Memories
              </h1>
              <p className="text-gray-300 text-lg">
                Your journey begins here. Join us to explore and share amazing experiences.
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Auth forms */}
        <div className="w-full lg:w-1/2 bg-dark-card p-8">
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <Login
                  key="login"
                  onToggleForm={toggleForm}
                  onLoginSuccess={onAuthSuccess}
                />
              ) : (
                <Register
                  key="register"
                  onToggleForm={toggleForm}
                  onRegisterSuccess={onAuthSuccess}
                />
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
