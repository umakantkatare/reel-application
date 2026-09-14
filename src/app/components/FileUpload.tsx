"use client";

import { useState } from "react";
import { upload } from "@imagekit/next";

interface FileUploadProps {
  onSuccess: (res: any) => void;
  onProgress: (res: any) => void;
  fileType?: "image" | "video";
}

export default function FileUpload({
  onSuccess,
  onProgress,
  fileType,
}: FileUploadProps) {
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file.");
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError("Video file size should not exceed 100MB.");
        return false;
      }
    } else {
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file.");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image file size should not exceed 5MB.");
        return false;
      }
    }
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !validateFile(file)) return;

    setUploading(true);
    setError(null);
    try {
      const authResponse = await fetch("/api/auth/imagekit-auth");
      const authData = await authResponse.json();
      console.log("auth-date", authData);
      const { ImagekitAuthParams } = authData;
      console.log("ImagekitAuthParams", ImagekitAuthParams);
      const response = await upload({
        file,
        fileName: file.name,
        folder: fileType === "video" ? "/reels" : "/images",
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
        signature: ImagekitAuthParams.signature,
        expire: ImagekitAuthParams.expire,
        token: ImagekitAuthParams.token,
        onProgress: (e) => {
          if (e.lengthComputable && onProgress) {
            const progress = (e.loaded / e.total) * 100;
            onProgress(Math.round(progress));
          }
        },
      });
      console.log("Upload response", response);
      onSuccess(response);
    } catch (error) {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
        Upload {fileType === "video" ? "Video" : "Image"}
      </label>

      <div
        className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all
        ${
          uploading
            ? "cursor-not-allowed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
            : "border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-500 dark:hover:bg-gray-800"
        }`}
      >
        <input
          type="file"
          accept={fileType === "video" ? "video/*" : "image/*"}
          onChange={handleFileChange}
          disabled={uploading}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        />

        {uploading ? (
          <>
            <div className="mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />

            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Uploading...
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Please wait while your file is being uploaded
            </p>
          </>
        ) : (
          <>
            <div className="mb-3 rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30">
              📁
            </div>

            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Click to upload
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {fileType === "video"
                ? "Upload a video file"
                : "Upload an image file"}
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
