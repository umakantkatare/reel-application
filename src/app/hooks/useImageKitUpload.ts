"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";

import { useRef, useState } from "react";
import { authenticator } from "@/lib/imagekit/authenticator";

export type FileType = "image" | "video";

export const validateFile = (file: File, fileType: FileType): string | null => {
  if (fileType === "video") {
    if (!file.type.startsWith("video/")) {
      return "Please upload a valid video file";
    }

    if (file.size > 100 * 1024 * 1024) {
      return "Video size must be less than 100MB";
    }
  } else {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!validTypes.includes(file.type)) {
      return "Please upload a valid image file (JPEG, PNG, or WebP)";
    }

    if (file.size > 5 * 1024 * 1024) {
      return "File size must be less than 5MB";
    }
  }

  return null;
};

export function useImageKitUpload(fileType: FileType) {
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const uploadFile = async (file: File) => {
    if (!file) {
      setError("File is required");
      return;
    }

    const validationError = validateFile(file, fileType);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setError(null);
      setIsUploading(true);
      setProgress(0);

      const authParams = await authenticator();

      const abortController = new AbortController();

      abortControllerRef.current = abortController;

      const response = await upload({
        ...authParams,

        file,
        fileName: file.name,
        useUniqueFileName: true,

        onProgress: (event) => {
          if (event.total) {
            const percentage = (event.loaded / event.total) * 100;

            setProgress(percentage);
          }
        },

        abortSignal: abortController.signal,
      });

      return response;
    } catch (error) {
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);

        setError("Upload was cancelled");
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);

        setError(error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);

        setError("Network error. Please try again.");
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);

        setError("ImageKit server error. Please try again.");
      } else {
        console.error("Upload error:", error);

        setError("Upload failed. Please try again.");
      }

      throw error;
    } finally {
      setIsUploading(false);
      abortControllerRef.current = null;
    }
  };

  const cancelUpload = () => {
    abortControllerRef.current?.abort();
  };

  return {
    uploadFile,
    cancelUpload,
    progress,
    isUploading,
    error,
  };
}
