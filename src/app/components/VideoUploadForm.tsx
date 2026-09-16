"use client";
import React, { useState } from "react";
import FileUpload from "./FileUpload";

interface IVideoUploadForm {
  title: string;
  description: string;
  video: File | null;
  thumbnail: File | null;
}

const VideoUploadForm = () => {
  const [formData, setFormData] = useState<IVideoUploadForm>({
    title: "",
    description: "",
    video: null,
    thumbnail: null,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isMissingFields =
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.video ||
      !formData.thumbnail;

    if (isMissingFields) {
      return;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Upload Video
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Upload your video and thumbnail to the platform.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>

            <input
              id="title"
              type="text"
              placeholder="Enter video title"
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="description"
              placeholder="Enter video description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="video"
              className="block text-sm font-medium text-gray-700"
            >
              Video
            </label>

            <FileUpload
              fileType="video"
              onSuccess={(response) => {
                console.log(response);
              }}
              onProgress={(progress) => {
                console.log(progress);
              }}
            />

            <p className="text-xs text-gray-500">
              Supported formats: MP4, WebM, MOV
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="thumbnail"
              className="block text-sm font-medium text-gray-700"
            >
              Thumbnail
            </label>

            <input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({
                  ...formData,
                  thumbnail: e.target.files?.[0] || null,
                })
              }
              className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-600 file:mr-4 file:border-0 file:bg-gray-900 file:px-4 file:py-3 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800"
            />

            <p className="text-xs text-gray-500">
              Recommended: JPG, PNG or WebP
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black/30 active:scale-[0.99]"
          >
            Upload Video
          </button>
        </form>
      </div>
    </div>
  );
};

export default VideoUploadForm;
