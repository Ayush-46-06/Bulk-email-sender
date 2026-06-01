import React, { useState } from 'react';
import { Send, Info, Plus } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import DefaultEditor from 'react-simple-wysiwyg';

const CampaignCreator = ({ batchId, availableTags = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    htmlTemplate: '<b>Hi {{salutation}} {{name}},</b><br><br>Welcome to our platform.'
  });
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const insertTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      htmlTemplate: prev.htmlTemplate + ` {{${tag}}} `
    }));
  };

  const handleSend = async () => {
    if (!formData.name || !formData.subject || !formData.htmlTemplate || formData.htmlTemplate === '<p><br></p>') {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (!batchId) {
      toast.error("Please upload a CSV file of contacts first.");
      return;
    }

    setIsSending(true);
    const toastId = toast.loading('Preparing campaign...');

    try {
      const createRes = await axios.post('/api/campaigns', formData);
      const campaignId = createRes.data._id;
      
      toast.loading('Sending emails...', { id: toastId });
      
      const sendRes = await axios.post(`/api/campaigns/${campaignId}/send`, { batchId });
      
      toast.success(sendRes.data.message || 'Campaign started!', { id: toastId });
      
      setFormData({
        name: '',
        subject: '',
        htmlTemplate: '<b>Hi {{salutation}} {{name}},</b><br><br>Welcome to our platform.'
      });
      
      // Refresh the page to clear frontend memory and state
      setTimeout(() => {
        window.location.reload();
      }, 1500); // 1.5 second delay so they can read the success toast
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to send campaign", { id: toastId });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="glass-panel p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="mb-6 flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-royal-blue text-white font-bold flex items-center justify-center shadow-md">
            2
          </div>
          <h3 className="text-xl font-bold text-royal-dark">Step 2: Campaign Setup</h3>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label className="block text-sm font-bold text-text-main mb-2">Campaign Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Summer Sale Newsletter"
              className="input-field"
            />
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-bold text-text-main mb-2">Email Subject</label>
            <input 
              type="text" 
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g., Don't miss out on these deals!"
              className="input-field"
            />
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-royal-blue text-white font-bold flex items-center justify-center shadow-md">
              3
            </div>
            <h3 className="text-xl font-bold text-royal-dark">Step 3: Draft Email</h3>
          </div>
        </div>
        
        <div>
          {availableTags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2 p-3 bg-royal-light/20 rounded-lg border border-border">
              <span className="text-xs text-text-muted flex items-center mr-2"><Info className="w-3.5 h-3.5 mr-1"/> Insert Variables:</span>
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => insertTag(tag)}
                  className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-white hover:bg-royal-light text-royal-dark border border-border font-medium rounded shadow-sm transition-colors"
                  title={`Insert {{${tag}}}`}
                >
                  <Plus className="w-3 h-3" />
                  {tag}
                </button>
              ))}
            </div>
          )}
          
          <div className="wysiwyg-dark-wrapper rounded-lg overflow-hidden border border-border bg-white shadow-inner">
            <DefaultEditor 
              value={formData.htmlTemplate}
              onChange={handleChange}
              name="htmlTemplate"
            />
          </div>
        </div>
      </div>
      
      <div className="pt-2 flex justify-end animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <button 
          onClick={handleSend}
          disabled={isSending}
          className="btn-primary flex items-center gap-2 px-8 py-3 text-lg font-bold shadow-xl"
        >
          {isSending ? 'Sending...' : 'Review & Send Campaign'}
          <Send className="w-5 h-5 ml-2" />
        </button>
      </div>
    </>
  );
};

export default CampaignCreator;
