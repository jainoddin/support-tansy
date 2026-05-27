"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AddMediaForm from "@/components/AddMediaForm";
import ImageGrid from "@/components/ImageGrid";
import ImageModal from "@/components/ImageModal";
import { ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

const tabs = ["Images", "Videos"];

export default function Dashboard() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAddMediaOpen, setIsAddMediaOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Images");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch("/api/images");
      const data = await res.json();
      if (res.ok) {
        setImages(data.images);
      } else {
        toast.error("Failed to load images");
      }
    } catch (err) {
      toast.error("Network error while fetching images");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleUploadSuccess = (newImage) => {
    setImages((prev) => [newImage, ...prev]);
    setIsAddMediaOpen(false);
  };

  const handleDeleteImage = async (image) => {
    if (!confirm("Are you sure you want to delete this media?")) return;
    
    try {
      const response = await fetch(`/api/images/${image.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete media");
      }

      toast.success("Media deleted successfully");
      setImages((prev) => prev.filter((img) => img.id !== image.id));
      if (selectedImage?.id === image.id) {
        setSelectedImage(null);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ... (keep the rest the same up to return)

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <Header 
          onAddMedia={() => setIsAddMediaOpen(true)} 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onMenuToggle={() => setIsSidebarOpen(true)}
        />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto relative">
          <div className="max-w-7xl mx-auto">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {tabs.map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      tab === activeTab 
                      ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Title */}
              <h2 className="text-base font-black text-slate-900 dark:text-slate-100 mb-6 uppercase tracking-wider">
                Media Gallery
              </h2>

              {/* Grid */}
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
                </div>
              ) : (
                <ImageGrid 
                  images={images.filter((media) => {
                    const isVideo = media.url.match(/\.(mp4|webm|ogg|mov)$/i);
                    const matchesType = activeTab === "Videos" ? isVideo : !isVideo;
                    const matchesSearch = media.name.toLowerCase().includes(searchQuery.toLowerCase());
                    return matchesType && matchesSearch;
                  })} 
                  onImageClick={setSelectedImage} 
                  onDeleteImage={handleDeleteImage}
                />
              )}
            </div>
        </main>
      </div>

    {/* Add Media Modal */}
      {isAddMediaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl">
            <AddMediaForm 
              onUploadSuccess={handleUploadSuccess} 
              onCancel={() => setIsAddMediaOpen(false)} 
              mediaType={activeTab}
            />
          </div>
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onDelete={(id) => setImages((prev) => prev.filter((img) => img.id !== id))}
        />
      )}
    </div>
  );
}

// Simple internal ChevronLeft component to match layout
function ChevronLeft(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m15 18-6-6 6-6"/>
    </svg>
  );
}
