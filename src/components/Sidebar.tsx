import React from 'react';
import { Home, Users, Car, MessageSquare, Database } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-64 min-h-screen bg-slate-100 border-r border-gray-200">
      <div className="p-4">
        <div className="flex items-center mb-8 mt-2">
          <div className="bg-blue-500 text-white p-2 rounded">
            <Database size={24} />
          </div>
          <h1 className="text-xl font-bold ml-2">Dashboard</h1>
        </div>
        
        <nav className="space-y-1">
          <SidebarItem 
            icon={<Home size={20} />} 
            text="Dashboard" 
            active={false}
            onClick={() => navigate('/')}
          />
          <SidebarItem 
            icon={<Users size={20} />} 
            text="CRM V2" 
            active={location.pathname === '/'}
            onClick={() => navigate('/')}
          />
          <SidebarItem 
            icon={<Car size={20} />} 
            text="Car Warehouse" 
            active={false}
            onClick={() => {}}
          />
          <SidebarItem 
            icon={<MessageSquare size={20} />} 
            text="Comment" 
            active={false}
            onClick={() => {}}
          />
        </nav>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, active, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center p-2 rounded-md text-left ${
        active ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-200'
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span className="font-medium">{text}</span>
    </button>
  );
};

export default Sidebar;
