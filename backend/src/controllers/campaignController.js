const Campaign = require('../models/Campaign');
const Contact = require('../models/Contact');
const batches = require('../services/batchStore');
const { sendDynamicEmail } = require('../services/brevoService');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const createCampaign = async (req, res) => {
  try {
    const { name, subject, htmlTemplate } = req.body;
    
    const newCampaign = new Campaign({
      name,
      subject,
      htmlTemplate
    });
    
    await newCampaign.save();
    res.status(201).json(newCampaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { batchId } = req.body; // Now requiring a batchId!
    
    if (!batchId) {
      return res.status(400).json({ error: 'batchId is required to send a campaign' });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    // Only find contacts matching this batchId from memory
    let contacts = batches.get(batchId);
    if (!contacts || contacts.length === 0) {
      return res.status(400).json({ error: 'No contacts found for this batch. Please upload the CSV again.' });
    }
    
    let limitWarning = null;
    if (contacts.length > 100) {
      limitWarning = `This batch has ${contacts.length} contacts, but this sender is limited to 100 emails at a time. Only the first 100 contacts will receive the email.`;
      contacts = contacts.slice(0, 100);
    }
    
    campaign.status = 'sending';
    await campaign.save();
    
    res.json({ 
      message: limitWarning || `Campaign sending started for ${contacts.length} contacts in batch.`,
      warning: limitWarning
    });
    
    let successCount = 0;
    
    for (const contact of contacts) {
      try {
        await sendDynamicEmail(contact, campaign); // contact is already a plain object
        successCount++;
        
        await Campaign.findByIdAndUpdate(campaignId, { $inc: { totalSent: 1 } });
        await delay(200);
      } catch (err) {
        console.error(`Failed to send email to ${contact.email}:`, err.message);
      }
    }
    
    await Campaign.findByIdAndUpdate(campaignId, { status: 'completed' });
    
    // Clean up memory
    batches.delete(batchId);
    console.log(`Campaign ${campaign.name} completed for batch ${batchId}. Sent ${successCount} emails. Memory cleared.`);
    
  } catch (error) {
    console.error('Error in sendCampaign:', error);
  }
};

module.exports = {
  createCampaign,
  sendCampaign
};
