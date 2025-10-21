import React, { useState, FormEvent } from 'react';
import { LogIn } from 'lucide-react';

interface LoginPageProps {
  onLogin: (name: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-xl rounded-lg px-8 pt-8 pb-8 mb-4 border border-gray-200 dark:border-gray-700">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Welcome</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Please enter your name to continue</p>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="username">
              Name
            </label>
            <input
              className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              id="username"
              type="text"
              placeholder="e.g., Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center gap-2 disabled:bg-primary-400"
              type="submit"
              disabled={!name.trim()}
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;