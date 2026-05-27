"use client";

import { 
  LayoutDashboard, 
  PawPrint, 
  FileText, 
  Star, 
  HeartHandshake, 
  MapPin, 
  Search, 
  Image as ImageIcon, 
  GitCompare, 
  QrCode, 
  Store, 
  Users, 
  History, 
  ChevronLeft
} from "lucide-react";

const navItems = [
  { icon: ImageIcon, label: "Media", active: true },
];

export default function Sidebar({ onClose }) {
  return (
    <aside className="w-[240px] flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 h-screen overflow-y-auto flex flex-col sticky top-0">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          Tansy
        </h1>
        <button 
          onClick={onClose}
          className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 md:hidden"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <nav className="flex-1 py-4 flex flex-col space-y-0.5">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = item.active;
          return (
            <button
              key={index}
              className={`flex items-center justify-between w-full px-6 py-3 text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-r-3xl mr-4 w-[calc(100%-16px)]" 
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <div className="flex items-center">
                <Icon className={`w-5 h-5 mr-3 ${
                    item.label === 'Pet Breed' ? 'text-red-500' :
                    item.label === 'Pet Names' ? 'text-purple-500' :
                    item.label === 'Influencers' ? 'text-yellow-500' :
                    item.label === 'Pet NGOs' ? 'text-green-500' :
                    item.label === 'Pet Friendly Places' ? 'text-pink-500' :
                    item.label === 'SEO' ? 'text-purple-500' :
                    isActive ? 'text-current' : 'text-blue-500'
                }`} />
                <span>{item.label}</span>
              </div>
              {item.hasDropdown && (
                <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>
          );
        })}
      </nav>

    </aside>
  );
}
