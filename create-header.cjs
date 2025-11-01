const fs = require('fs');

const content = `import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Tax Management System</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                {user.firstName} {user.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
`;

fs.writeFileSync('src/components/Layout/Header.tsx', content, { encoding: 'utf8' });
console.log('Header.tsx created successfully');
