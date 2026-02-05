'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// export interface UserProfile {
//   id: string;
//   email: string;
//   password: string;
//   name: string;
//   age: number;
//   job: {
//     domain: string;
//     role: string;
//     level: string;
//   };
//   about: {
//     habits: string;
//     workingHoursPerDay: number;
//     peakProductivityHours: string;
//     moreAboutYourself: string;
//   };
// }

// interface AuthContextType {
//   user: UserProfile | null;
//   isLoggedIn: boolean;
//   login: (email: string, password: string) => boolean;
//   register: (email: string, password: string) => boolean;
//   logout: () => void;
//   updateProfile: (profile: Partial<UserProfile>) => void;
//   sendOTP: (email: string) => void;
//   verifyOTP: (email: string, otp: string) => boolean;
//   pendingOTPEmail: string | null;
// }

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pendingOTPEmail, setPendingOTPEmail] = useState(null);
  const [otpMap, setOtpMap] = useState(new Map());

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('taskflow_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
      }
    }
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('taskflow_users') || '[]');
    const foundUser = users.find((u) => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      setIsLoggedIn(true);
      localStorage.setItem('taskflow_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = (email, password) => {
    const users = JSON.parse(localStorage.getItem('taskflow_users') || '[]');
    
    if (users.some((u) => u.email === email)) {
      return false; // Email already exists
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      password,
      name: '',
      age: 0,
      job: { domain: '', role: '', level: '' },
      about: { habits: '', workingHoursPerDay: 0, peakProductivityHours: '', moreAboutYourself: '' },
    };

    users.push(newUser);
    localStorage.setItem('taskflow_users', JSON.stringify(users));
    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('taskflow_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('taskflow_user');
  };

  const updateProfile = (profile) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...profile };
    setUser(updatedUser);
    localStorage.setItem('taskflow_user', JSON.stringify(updatedUser));

    // Update in users list
    const users = JSON.parse(localStorage.getItem('taskflow_users') || '[]');
    const userIndex = users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('taskflow_users', JSON.stringify(users));
    }
  };

  const sendOTP = (email) => {
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in memory and localStorage for demo purposes
    const newOtpMap = new Map(otpMap);
    newOtpMap.set(email, otp);
    setOtpMap(newOtpMap);
    
    // Store in localStorage as backup
    const otpStorage = JSON.parse(localStorage.getItem('taskflow_otp') || '{}');
    otpStorage[email] = otp;
    localStorage.setItem('taskflow_otp', JSON.stringify(otpStorage));
    
    setPendingOTPEmail(email);
    
    // Log OTP for demo (in production, this would be sent via email)
    console.log(`[v0] OTP sent to ${email}: ${otp}`);
  };

  const verifyOTP = (email, otp) => {
    // Check OTP from memory first, then localStorage
    const storedOtp = otpMap.get(email) || 
      JSON.parse(localStorage.getItem('taskflow_otp') || '{}')[email];
    
    if (storedOtp && storedOtp === otp) {
      // Clear OTP after verification
      const newOtpMap = new Map(otpMap);
      newOtpMap.delete(email);
      setOtpMap(newOtpMap);
      
      const otpStorage = JSON.parse(localStorage.getItem('taskflow_otp') || '{}');
      delete otpStorage[email];
      localStorage.setItem('taskflow_otp', JSON.stringify(otpStorage));
      
      setPendingOTPEmail(null);
      return true;
    }
    return false;
  };
  // Logic chặn tại đây
  useEffect(() => {
    if (isLoggedIn === false) {
      const path = window.location.pathname;
      // Nếu chưa login và không phải đang ở trang login thì đá về login
      // if (path !== '/login') {
      //   window.location.href = '/login'; 
      // }
    }
  }, [isLoggedIn]);

  // Nếu đang kiểm tra trạng thái (isLoggedIn === null), không hiện gì cả để tránh lỗi hook
  if (isLoggedIn === null) return null;
  
  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, register, logout, updateProfile, sendOTP, verifyOTP, pendingOTPEmail }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (undefined === context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
