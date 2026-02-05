import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useAuth} from '@/context/auth.context'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [showOTPBox, setShowOTPBox] = useState(false);
  const { login, register, sendOTP, verifyOTP, pendingOTPEmail } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (isLogin) {
      if (login(email, password)) {
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } else {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      // Send OTP to email for verification
      sendOTP(email);
      setShowOTPBox(true);
    }
  };

  const handleOTPSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    if (verifyOTP(email, otp)) {
      if (register(email, password)) {
        navigate('/');
      } else {
        setError('Failed to create account');
      }
    } else {
      setError('Invalid OTP. Please try again');
    }
  };

  const handleResendOTP = () => {
    setError('');
    sendOTP(email);
    setOtp('');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-8">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">TF</span>
            </div>
            <span className="ml-3 text-2xl font-bold text-foreground">TaskFlow</span>
          </div>

          <h2 className="text-2xl font-bold text-center mb-2 text-foreground">
            {isLogin ? 'Welcome Back' : showOTPBox ? 'Verify Email' : 'Create Account'}
          </h2>
          <p className="text-center text-muted-foreground mb-6">
            {isLogin ? 'Sign in to your account' : showOTPBox ? `Enter the OTP sent to ${email}` : 'Sign up to get started'}
          </p>

          <form onSubmit={showOTPBox ? handleOTPSubmit : handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>

            {!isLogin && !showOTPBox && (
              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-foreground mb-2">
                  Confirm Password
                </label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full"
                />
              </div>
            )}

            {showOTPBox && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-foreground mb-2">
                  One-Time Password (OTP)
                </label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center text-2xl tracking-widest"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Enter the 6-digit code sent to your email
                </p>
              </div>
            )}

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full">
              {isLogin ? 'Sign In' : showOTPBox ? 'Verify & Create Account' : 'Send OTP'}
            </Button>

            {showOTPBox && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Didn't receive the OTP?
                </p>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Resend OTP
                </button>
              </div>
            )}
          </form>

          {!showOTPBox && (
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          )}

          {showOTPBox && (
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setShowOTPBox(false);
                  setOtp('');
                  setError('');
                }}
                className="text-sm text-primary hover:underline font-medium"
              >
                Back to registration
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
