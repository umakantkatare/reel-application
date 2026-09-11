"use client";

import { useRef } from "react";
import { FileType, useImageKitUpload } from "../hooks/useImageKitUpload";

interface FileUploaderProps {
  fileType: FileType;
}

export default function FileUploader({ fileType }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadFile, cancelUpload, progress, isUploading, error } =
    useImageKitUpload(fileType);

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      return;
    }

    try {
      const response = await uploadFile(file);

      console.log("Upload response:", response);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        disabled={isUploading}
        accept={
          fileType === "video" ? "video/*" : "image/jpeg,image/png,image/webp"
        }
      />

      <button type="button" onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload"}
      </button>

      {error && <p>{error}</p>}

      {isUploading && (
        <div>
          <p>Upload progress: {Math.round(progress)}%</p>

          <progress value={progress} max={100} />

          <button type="button" onClick={cancelUpload}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
