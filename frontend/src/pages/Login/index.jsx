import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useDispatch } from 'react-redux';
import { loginUser, signupUser } from '@/services/auth.api';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

export default function Login() {
    const dispatch = useDispatch();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        if (localStorage.getItem('user')) {
          const backTo = location.state?.from?.pathname || '/';
          toast.error('Bạn đã đăng nhập, đăng xuất nếu muốn đăng nhập lại');
          navigate(backTo);
        }
    }, [navigate]);

    //Bấm nút login
    const handleLogin = async ({ email, password }) => {
        try {
            const res = await dispatch(loginUser(email, password));
            toast.success('Login successfully');
            navigate(location.state?.from?.pathname || '/');
        } catch (err) {
            const message = "Login fail";
            toast.error(message);
        }
    };

    const handleSignup = async ({ email, password }) => {
        try {
          const res = await dispatch(signupUser(email, password));
          toast.success(res?.message || 'Login successfully');
          navigate(location.state?.from?.pathname || '/');
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || "Đăng nhập thất bại";
            toast.error(message);
        }
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');

      if (!email || !password) {
          setError('Please fill in all fields');
          return;
      } 

      if (isLogin) {
        await handleLogin({email, password})
      } 
      else {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          return;
        }
        await handleSignup({email, password})
      }
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
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-center text-muted-foreground mb-6">
              {isLogin ? 'Sign in to your account' : 'Sign up to get started'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              {!isLogin && (
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

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive rounded-lg">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full">
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Button>

            </form>

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
          </div>
        </Card>
      </div>
    );
}
