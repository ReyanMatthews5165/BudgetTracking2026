import { useState, useEffect } from 'react';
import { User } from '@/app/App';
import { LogIn, UserPlus, Mail, Lock, UserCircle, Eye, EyeOff } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Initialize demo account on component mount
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if demo account exists
    const demoExists = users.find((u: any) => u.email === 'demo@student.edu');

    if (!demoExists) {
      // Create demo account
      const demoUser: User = {
        userID: 'user_demo_123',
        name: 'Demo Student',
        email: 'demo@student.edu',
      };

      const demoCredentials = {
        userID: demoUser.userID,
        email: 'demo@student.edu',
        passwordHash: btoa('demo123'),
      };

      users.push(demoCredentials);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem(`userProfile_${demoUser.userID}`, JSON.stringify(demoUser));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (isRegister && !name) {
      setError('Please enter your name');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (isRegister) {
      // Validate password strength for registration
      const hasNumber = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      if (!hasNumber || !hasSpecialChar) {
        setError('Password must include at least 1 number and 1 special character');
        return;
      }
      // Register new user
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user already exists
      const existingUser = users.find((u: any) => u.email === email);
      if (existingUser) {
        setError('User with this email already exists');
        return;
      }

      const newUser: User = {
        userID: `user_${Date.now()}`,
        name,
        email,
      };

      // Store user credentials (in real app, this would be hashed)
      const userCredentials = {
        userID: newUser.userID,
        email,
        passwordHash: btoa(password), // Simple base64 encoding (NOT secure for production)
      };

      users.push(userCredentials);
      localStorage.setItem('users', JSON.stringify(users));

      // Store user profile separately
      localStorage.setItem(`userProfile_${newUser.userID}`, JSON.stringify(newUser));

      // Show success message briefly before logging in
      setSuccessMessage('Account created successfully! Logging you in...');
      setTimeout(() => {
        onLogin(newUser);
      }, 1000);
    } else {
      // Login existing user
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === email && u.passwordHash === btoa(password));

      if (!user) {
        setError('Invalid email or password');
        return;
      }

      // Load user profile
      const userProfile = JSON.parse(localStorage.getItem(`userProfile_${user.userID}`) || '{}');
      
      if (!userProfile.userID) {
        setError('User profile not found');
        return;
      }

      onLogin(userProfile);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(to top, #bfdbfe, #c4b5fd, #fbcfe8)'
    }}>
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <UserCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Budget Tracking
          </h1>
          <p className="text-gray-600">Smart spending for students</p>
        </div>

        {/* Login/Register Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setIsRegister(false);
                setError('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                !isRegister
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsRegister(true);
                setError('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                isRegister
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field (only for registration) */}
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {isRegister
                  ? 'Must be at least 6 characters, include 1 number and 1 special character'
                  : 'Must be at least 6 characters'
                }
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2" role="alert">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Success message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2" role="alert">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {successMessage}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              {isRegister ? (
                <>
                  <UserPlus className="h-5 w-5" />
                  Create Account
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Additional info */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Your data is stored locally in your browser</p>
            <p className="mt-1">No personal information is sent to any server</p>
          </div>
        </div>

        {/* Demo credentials */}
        <div className="mt-4 text-center text-xs text-gray-600 bg-white/50 backdrop-blur rounded-lg p-3">
          <p className="font-medium mb-1">Demo Account (Optional)</p>
          <p>Email: demo@student.edu</p>
          <p>Password: demo123</p>
        </div>
      </div>
    </div>
  );
}
