"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AddMediaForm({ onUploadSuccess, onCancel, mediaType }) {
  const [uploadMode, setUploadMode] = useState("file"); // "file" or "url"
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploadMode === "file" && !file) {
      toast.error("Please select a file to upload");
      return;
    }
    if (uploadMode === "url" && !url.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }
    
    setUploading(true);

    try {
      let response;
      if (uploadMode === "file") {
        const formData = new FormData();
        formData.append("file", file);
        response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch("/api/upload/url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to upload");

      toast.success("Media added successfully!");
      if (onUploadSuccess) onUploadSuccess(data.image);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Upload {mediaType === "Videos" ? "Video" : "Image"}
        </h2>
      </div>

      <div className="flex space-x-2 mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-full max-w-sm">
        <button
          type="button"
          onClick={() => setUploadMode("file")}
          className={`flex-1 py-1.5 px-3 text-sm font-medium rounded-md transition-colors ${
            uploadMode === "file" 
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" 
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
        >
          From Device
        </button>
        <button
          type="button"
          onClick={() => setUploadMode("url")}
          className={`flex-1 py-1.5 px-3 text-sm font-medium rounded-md transition-colors ${
            uploadMode === "url" 
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" 
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
        >
          From URL
        </button>
      </div>

      <form onSubmit={handleSubmit} className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            {uploadMode === "file" ? `Select ${mediaType === "Videos" ? "Video" : "Image"}` : "Paste URL"}
          </label>
          
          {uploadMode === "file" ? (
            <input
              type="file"
              accept={mediaType === "Videos" ? "video/*" : "image/*"}
              onChange={handleFileChange}
              className="block w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-2.5 px-4 rounded-lg leading-tight focus:outline-none focus:ring-1 focus:ring-rose-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
            />
          ) : (
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={`https://example.com/sample-${mediaType === "Videos" ? "video.mp4" : "image.jpg"}`}
              className="block w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-2.5 px-4 rounded-lg leading-tight focus:outline-none focus:ring-1 focus:ring-rose-500 placeholder-gray-400 text-sm"
              required
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={uploading}
            className="px-6 py-2.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading || (uploadMode === "file" ? !file : !url.trim())}
            className="px-6 py-2.5 rounded-lg text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {uploading ? "Uploading..." : "Upload Media"}
          </button>
        </div>
      </form>
    </div>
  );
}
