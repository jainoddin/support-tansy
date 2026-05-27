"use client";

import { Search, Plus, Menu } from "lucide-react";
import Image from "next/image";

export default function Header({ onAddMedia, searchQuery, onSearchChange, onMenuToggle }) {
  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20 w-full">
      <div className="flex items-center flex-1 max-w-2xl mr-2 sm:mr-4">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuToggle}
          className="mr-3 p-1.5 rounded-md md:hidden text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Search */}
        <div className="relative flex items-center w-full h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-hidden px-3 sm:px-4">
          <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search here"
            value={searchQuery || ""}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 min-w-0"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button 
          onClick={onAddMedia}
          className="flex items-center bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4 sm:mr-1.5" />
          <span className="hidden sm:inline">Add Media</span>
        </button>
        
        <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-green-500 cursor-pointer p-0.5">
           <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden relative">
             <Image 
                src="https://pub-68a98c57e70a4a1fa317739dd20098b9.r2.dev/d9d0539b-06b7-4d53-a6c5-9ef71b7404c5.png" 
                alt="Profile" 
                fill
                className="object-cover"
                unoptimized
             />
           </div>
        </div>
      </div>
    </header>
  );
}
