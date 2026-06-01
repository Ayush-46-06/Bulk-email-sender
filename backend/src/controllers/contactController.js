const fs = require('fs');
const csv = require('csv-parser');
const { getGender } = require('gender-detection-from-name');
const crypto = require('crypto');
const batches = require('../services/batchStore');

const uploadContacts = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const results = [];
  const errors = [];
  let headers = [];
  const batchId = crypto.randomUUID();
  const { Readable } = require('stream');
  Readable.from(req.file.buffer)
    .pipe(csv({
      mapHeaders: ({ header }) => header.trim().replace(/^[\u200B-\u200D\uFEFF]/g, '')
    }))
    .on('headers', (headerList) => {
      headers = headerList;
      // We will always inject salutation as a tag since we generate it
      if (!headers.includes('salutation')) {
        headers.push('salutation');
      }
    })
    .on('data', (data) => {
      if (data.email) {
        const contactData = { ...data }; // Copy all dynamic attributes
        
        contactData.email = data.email.trim();
        contactData.name = data.name ? data.name.trim() : '';
        contactData.companyName = data.companyName ? data.companyName.trim() : '';
        contactData.batchId = batchId;
        
        // Auto-generate salutation if name is provided
        if (contactData.name) {
          const firstName = contactData.name.split(' ')[0];
          const gender = getGender(firstName);
          if (gender === 'male') {
            contactData.salutation = 'Mr.';
          } else if (gender === 'female') {
            contactData.salutation = 'Ms.';
          } else {
            contactData.salutation = ''; // Could not guess
          }
        }
        
        results.push(contactData);
      }
    })
    .on('end', async () => {
      if (results.length === 0) {

        return res.status(400).json({ error: 'No valid contacts found. Please make sure your CSV has an "email" column.' });
      }

      // Store in memory instead of DB
      batches.set(batchId, results);
      
      // Clean up uploaded file

      
      res.json({
        message: 'CSV processing complete',
        totalProcessed: results.length,
        insertedOrUpdated: results.length,
        batchId: batchId,
        tags: headers,
        errors
      });
    });
};

const getContacts = async (req, res) => {
  // Keeping this empty or returning empty since we no longer save contacts
  res.json([]);
};

module.exports = {
  uploadContacts,
  getContacts
};
