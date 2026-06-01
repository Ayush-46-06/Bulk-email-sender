import React, { useState } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, Download } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ContactUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    const toastId = toast.loading('Uploading contacts...');

    try {
      const res = await axios.post('/api/contacts/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success(res.data.message || 'Contacts uploaded successfully!', { id: toastId });
      setFile(null);
      
      if (onUploadSuccess && res.data.batchId) {
        onUploadSuccess(res.data.batchId, res.data.tags || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to upload contacts", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="glass-panel p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-royal-blue text-white font-bold flex items-center justify-center shadow-md">
            1
          </div>
          <h3 className="text-xl font-bold text-royal-dark">Step 1: Import Contacts</h3>
        </div>
        <a 
          href="/template.csv" 
          download 
          className="text-royal-blue hover:text-royal-dark text-sm font-medium flex items-center gap-1.5 bg-royal-light/50 hover:bg-royal-light px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap border border-royal-light"
        >
          <Download className="w-4 h-4" />
          Download Template
        </a>
      </div>
      
      <div 
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all duration-200 
          ${file ? 'border-royal-blue bg-royal-light/30' : 'border-border hover:border-royal-blue/50 hover:bg-royal-light/10'}`}
      >
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 text-royal-blue shadow-sm border border-border">
          {file ? <CheckCircle className="w-8 h-8 text-green-500" /> : <UploadCloud className="w-8 h-8" />}
        </div>
        
        {file ? (
          <div className="text-center">
            <p className="text-text-main font-medium">{file.name}</p>
            <p className="text-xs text-text-muted mt-1">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-text-main font-medium">Drag and drop your CSV here</p>
            <p className="text-sm text-text-muted mt-2">Limit 50MB per file. CSV accepted.</p>
          </div>
        )}
        
        <div className="mt-6">
          <input 
            type="file" 
            id="csv-upload" 
            accept=".csv" 
            className="hidden" 
            onChange={handleFileChange}
          />
          <label 
            htmlFor="csv-upload"
            className="cursor-pointer bg-white text-royal-blue border border-royal-light hover:bg-royal-light/50 px-6 py-2 rounded-full font-bold shadow-sm transition-colors text-sm"
          >
            {file ? 'Change File' : 'Browse Files'}
          </label>
        </div>
      </div>
      
      {file && !isUploading && (
        <div className="mt-6 flex justify-end">
          <button 
            onClick={handleUpload}
            className="btn-primary"
          >
            Upload Contacts
          </button>
        </div>
      )}
      {isUploading && (
         <div className="mt-6 flex justify-end">
         <button disabled className="btn-primary">
           Importing...
         </button>
       </div>
      )}
    </div>
  );
};

export default ContactUpload;
