import React, { useState, useRef } from "react";
import { Upload, File, CheckCircle, AlertCircle, X, Zap, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../lib/api-client.js"
import { UPLOAD_PDF } from "../utils/constants.js"

// Mock navigation function - replace with your actual router



const UploadComponent: React.FC = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigateToChat = () => {
        navigate("/chat"); // ✅ now it works
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type === 'application/pdf') {
                setFile(selectedFile);
                setUploadStatus('idle');
                setErrorMessage('');
            } else {
                setErrorMessage('Please select a valid PDF file');
                setUploadStatus('error');
            }
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            const droppedFile = files[0];
            if (droppedFile.type === 'application/pdf') {
                setFile(droppedFile);
                setUploadStatus('idle');
                setErrorMessage('');
            } else {
                setErrorMessage('Please select a valid PDF file');
                setUploadStatus('error');
            }
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            setErrorMessage('Please select a PDF file');
            setUploadStatus('error');
            return;
        }

        setIsUploading(true);
        setUploadStatus('idle');

        const formData = new FormData();
        formData.append("pdf", file);

        try {
            // Simulating API call - replace with your actual API client
            const response = await apiClient.post(UPLOAD_PDF, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });
            const { collectionName } = response.data;

            if (collectionName) {
                localStorage.setItem("collectionName", collectionName);
                navigate("/chat");
            }

            console.log("Upload Success:", file.name);
            setUploadStatus('success');
            setErrorMessage('');

            // Redirect to chat after successful upload
            setTimeout(() => {
                navigateToChat();
            }, 1500); // Wait 1.5 seconds to show success message

        } catch (err) {
            console.error("Upload failed:", err);
            setErrorMessage('Failed to upload file. Please try again.');
            setUploadStatus('error');
        } finally {
            setIsUploading(false);
        }
    };

    const removeFile = () => {
        setFile(null);
        setUploadStatus('idle');
        setErrorMessage('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-6 flex items-center justify-center relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent"></div>
            <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.1) 1px, transparent 0)`,
                backgroundSize: '20px 20px'
            }}></div>

            <div className="max-w-2xl w-full relative z-10">
                <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 p-8 relative overflow-hidden">
                    {/* Glowing border effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-50"></div>

                    <div className="relative z-10">
                        <div className="mb-8 text-center">
                            <div className="flex items-center justify-center mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                                    <div className="relative p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-xl">
                                        <FileText className="w-10 h-10 text-white" />
                                    </div>
                                </div>
                            </div>
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent mb-4">
                                PDF Upload Station
                            </h2>
                            <p className="text-gray-300 text-lg">Secure document processing with enterprise-grade encryption</p>
                        </div>

                        {/* Upload Area */}
                        <div
                            className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-500 transform ${isDragOver
                                ? 'border-cyan-400 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 scale-105 shadow-2xl shadow-cyan-500/20'
                                : file
                                    ? 'border-emerald-400 bg-gradient-to-br from-emerald-500/10 to-green-500/10 shadow-xl shadow-emerald-500/20'
                                    : uploadStatus === 'error'
                                        ? 'border-red-400 bg-gradient-to-br from-red-500/10 to-pink-500/10 shadow-xl shadow-red-500/20'
                                        : 'border-gray-600 bg-gradient-to-br from-gray-800/50 to-slate-800/50 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-cyan-500/10 hover:shadow-xl hover:shadow-blue-500/20'
                                } ${isUploading ? 'pointer-events-none opacity-60' : 'cursor-pointer group'}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => !file && fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            {!file ? (
                                <div className="flex flex-col items-center">
                                    <div className={`relative mb-8 transition-all duration-300 ${isDragOver ? 'scale-110' : 'group-hover:scale-105'
                                        }`}>
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-md opacity-30"></div>
                                        <div className={`relative p-6 rounded-full transition-all duration-300 ${isDragOver
                                            ? 'bg-gradient-to-r from-cyan-400 to-blue-400 shadow-lg shadow-cyan-400/30'
                                            : 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-md group-hover:shadow-lg group-hover:shadow-blue-500/30'
                                            }`}>
                                            <Upload className="w-16 h-16 text-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">
                                        {isDragOver ? 'Release to Upload' : 'Drop PDF Here'}
                                    </h3>
                                    <p className="text-gray-400 text-base mb-6">
                                        or <span className="text-blue-400 font-medium">browse files</span> from your device
                                    </p>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <span>PDF only</span>
                                        <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                                        <span>Max 10MB</span>
                                        <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                                        <span>Encrypted transfer</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between bg-gray-800/60 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 rounded-xl blur-md opacity-30"></div>
                                            <div className="relative p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl">
                                                <File className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold text-white text-lg truncate max-w-xs">{file.name}</p>
                                            <p className="text-gray-400 text-sm">{formatFileSize(file.size)} • Ready for upload</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile();
                                        }}
                                        className="p-2 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-110 group"
                                    >
                                        <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
                                    </button>
                                </div>
                            )}

                            {isUploading && (
                                <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                                    <div className="flex flex-col items-center space-y-6">
                                        <div className="relative">
                                            {/* Outer ring */}
                                            <div className="w-20 h-20 border-4 border-gray-700 rounded-full"></div>
                                            {/* Animated ring */}
                                            <div className="absolute inset-0 w-20 h-20 border-4 border-t-blue-500 border-r-cyan-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                                            {/* Inner icon */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Zap className="w-8 h-8 text-blue-400 animate-pulse" />
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-white font-semibold text-xl mb-2">Processing Upload</p>
                                            <p className="text-gray-400">Encrypting and transferring your document...</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Status Messages */}
                        {uploadStatus === 'success' && (
                            <div className="mt-8 p-6 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-2xl backdrop-blur-sm relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 animate-pulse"></div>
                                <div className="relative flex items-center space-x-4">
                                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full">
                                        <CheckCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-lg">Upload Successful</p>
                                        <p className="text-gray-300">Redirecting to chat interface...</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {uploadStatus === 'error' && errorMessage && (
                            <div className="mt-8 p-6 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-2xl backdrop-blur-sm relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 animate-pulse"></div>
                                <div className="relative flex items-center space-x-4">
                                    <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full">
                                        <AlertCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-lg">Upload Failed</p>
                                        <p className="text-gray-300">{errorMessage}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Upload Button */}
                        <div className="mt-10 flex justify-center">
                            <button
                                onClick={handleSubmit}
                                disabled={!file || isUploading}
                                className={`relative px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center space-x-3 transform overflow-hidden ${!file || isUploading
                                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 active:scale-95 shadow-xl'
                                    }`}
                            >
                                {!file && !isUploading && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 animate-pulse"></div>
                                )}
                                <div className="relative flex items-center space-x-3">
                                    <Upload className="w-6 h-6" />
                                    <span>{isUploading ? 'Uploading...' : 'Upload Document'}</span>
                                </div>
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <p className="text-gray-500 text-sm">
                                Enterprise-grade security • End-to-end encryption • GDPR compliant
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadComponent;