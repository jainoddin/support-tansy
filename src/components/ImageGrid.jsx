"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MoreVertical, Eye, Trash2, ExternalLink } from "lucide-react";

function ImageCard({ image, onClickView, onClickDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col overflow-visible">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full bg-gray-100 dark:bg-gray-800 rounded-t-xl overflow-hidden cursor-pointer" onClick={() => onClickView(image)}>
        {image.url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
          <video
            src={image.url}
            className="w-full h-full object-cover"
            preload="metadata"
            muted
          />
        ) : (
          <Image
            src={image.url}
            alt={image.name}
            fill
            className="object-contain"
            unoptimized
          />
        )}
      </div>
      
      {/* Details Footer */}
      <div className="p-3 flex items-center justify-between relative bg-white dark:bg-gray-900 rounded-b-xl">
        <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 truncate pr-2">
          {image.name}
        </p>
        
        <div className="relative" ref={menuRef}>
          <button 
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-30 overflow-hidden">
              <button 
                className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => {
                  setMenuOpen(false);
                  onClickView(image);
                }}
              >
                <Eye className="w-4 h-4 mr-2.5 text-slate-600 dark:text-slate-400" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">View</span>
              </button>
              <button 
                className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => {
                  setMenuOpen(false);
                  onClickDelete(image);
                }}
              >
                <Trash2 className="w-4 h-4 mr-2.5 text-slate-600 dark:text-slate-400" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ImageGrid({ images, onImageClick, onDeleteImage }) {
  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
          <ExternalLink className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No images yet</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
          Upload your first image to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 pb-12">
      {images.map((image) => (
        <ImageCard 
          key={image.id} 
          image={image} 
          onClickView={onImageClick} 
          onClickDelete={onDeleteImage}
        />
      ))}
    </div>
  );
}
