import React, { useState } from 'react';
import Layout from './components/Layout';
import ContactUpload from './components/ContactUpload';
import CampaignCreator from './components/CampaignCreator';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [batchId, setBatchId] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);

  return (
    <Layout>
      <div className="space-y-6">
        <ContactUpload 
          onUploadSuccess={(newBatchId, tags) => {
            setBatchId(newBatchId);
            setAvailableTags(tags);
          }} 
        />
        
        <CampaignCreator batchId={batchId} availableTags={availableTags} />
      </div>
    </Layout>
  );
}

export default App;
