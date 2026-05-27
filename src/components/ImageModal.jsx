"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Copy, Download, Trash2, Calendar, Link as LinkIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ImageModal({ image, onClose, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!image) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(image.url);
    toast.success("URL copied to clipboard");
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = image.name || 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Download started");
    } catch (err) {
      toast.error("Failed to download image");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/images/${image.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete image");
      }

      toast.success("Image deleted successfully");
      if (onDelete) onDelete(image.id);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message);
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button (Mobile Top Right) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md md:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Preview Area */}
        <div className="relative w-full md:w-3/5 lg:w-2/3 bg-gray-100 dark:bg-gray-950 flex items-center justify-center min-h-[300px]">
          {image.url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
            <video
              src={image.url}
              className="w-full max-h-[90vh] object-contain"
              controls
              autoPlay
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

        {/* Details Panel */}
        <div className="w-full md:w-2/5 lg:w-1/3 p-6 flex flex-col max-h-[50vh] md:max-h-none overflow-y-auto border-l border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-start mb-6 hidden md:flex">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate pr-4">
              Image Details
            </h3>
            <button 
              onClick={onClose}
              className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6 flex-1">
            {/* Name */}
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Filename</p>
              <p className="text-sm text-gray-900 dark:text-gray-200 font-medium break-all">
                {image.name}
              </p>
            </div>

            {/* Date */}
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                <Calendar className="w-4 h-4 mr-1.5" />
                Uploaded On
              </p>
              <p className="text-sm text-gray-900 dark:text-gray-200">
                {new Date(image.createdAt).toLocaleDateString(undefined, { 
                  year: 'numeric', month: 'short', day: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              </p>
            </div>

            {/* URL */}
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                <LinkIcon className="w-4 h-4 mr-1.5" />
                Public URL
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <input
                  type="text"
                  readOnly
                  value={image.url}
                  className="flex-1 bg-gray-50 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none"
                />
                <button
                  onClick={handleCopyUrl}
                  className="p-2.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg transition-colors border border-blue-100 dark:border-blue-900/50"
                  title="Copy URL"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-3 pt-6 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={handleDownload}
              className="w-full py-2.5 px-4 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white rounded-xl font-medium transition-colors flex justify-center items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Media
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-xl font-medium transition-colors flex justify-center items-center disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              {isDeleting ? "Deleting..." : "Delete Media"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
