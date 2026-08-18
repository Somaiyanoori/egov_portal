import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileText, Image as ImageIcon, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  accept?: Record<string, string[]>;
}

export function FileUpload({
  files,
  onChange,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "application/pdf": [".pdf"],
  },
}: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0].code === "file-too-large") {
          setError(`File too large. Max size is ${maxSize / 1024 / 1024}MB`);
        } else if (rejection.errors[0].code === "file-invalid-type") {
          setError("Invalid file type. Only JPG, PNG, PDF allowed.");
        } else {
          setError(rejection.errors[0].message);
        }
        return;
      }

      const totalFiles = [...files, ...acceptedFiles];
      if (totalFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }

      onChange(totalFiles);
    },
    [files, onChange, maxFiles, maxSize],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: true,
  });

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return ImageIcon;
    if (file.type === "application/pdf") return FileText;
    return File;
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1024 / 1024).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
          isDragActive
            ? "border-[color:var(--primary)] bg-[color:var(--primary)]/5"
            : "border-[color:var(--border)] hover:border-[color:var(--primary)]/50 hover:bg-[color:var(--accent)]/50",
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div
            className={cn(
              "h-14 w-14 rounded-full flex items-center justify-center transition-colors",
              isDragActive
                ? "bg-[color:var(--primary)]/20"
                : "bg-[color:var(--accent)]",
            )}
          >
            <Upload
              className={cn(
                "h-6 w-6 transition-colors",
                isDragActive
                  ? "text-[color:var(--primary)]"
                  : "text-[color:var(--muted-foreground)]",
              )}
            />
          </div>
          <div>
            <p className="text-sm font-medium">
              {isDragActive
                ? "Drop files here"
                : "Click to upload or drag & drop"}
            </p>
            <p className="text-xs text-[color:var(--muted-foreground)] mt-1">
              JPG, PNG or PDF (max {maxSize / 1024 / 1024}MB per file, up to{" "}
              {maxFiles} files)
            </p>
          </div>
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-[color:var(--destructive)]"
        >
          {error}
        </motion.p>
      )}

      {/* File list */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {files.map((file, idx) => {
              const Icon = getFileIcon(file);
              return (
                <motion.div
                  key={`${file.name}-${idx}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-3 p-3 rounded-lg border border-[color:var(--border)] bg-[color:var(--card)]"
                >
                  <div className="h-10 w-10 rounded-lg bg-[color:var(--accent)] flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-[color:var(--muted-foreground)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-[color:var(--muted-foreground)]">
                      {formatBytes(file.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="h-8 w-8 rounded-lg hover:bg-[color:var(--destructive)]/10 hover:text-[color:var(--destructive)] flex items-center justify-center transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
