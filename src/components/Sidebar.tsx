
import React from 'react';
import { Home, Users, Car, MessageSquare, Database } from 'lucide-react';

const Sidebar: React.FC = () => {
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
          <SidebarItem icon={<Home size={20} />} text="Dashboard" active={false} />
          <SidebarItem icon={<Users size={20} />} text="CRM V2" active={true} />
          <SidebarItem icon={<Car size={20} />} text="Car Warehouse" active={false} />
          <SidebarItem icon={<MessageSquare size={20} />} text="Comment" active={false} />
        </nav>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, active }) => {
  return (
    <a 
      href="#" 
      className={`flex items-center p-2 rounded-md ${
        active ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-200'
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span className="font-medium">{text}</span>
    </a>
  );
};

export default Sidebar;
