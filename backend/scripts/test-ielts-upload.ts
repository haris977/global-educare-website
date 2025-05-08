import axios from 'axios';
import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:8000/api/tests/ielts/complete';

async function uploadIELTSTest() {
  try {
    console.log('Reading sample IELTS test data...');
    const filePath = path.join(__dirname, 'sample-ielts-test.json');
    const testData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    console.log('Uploading IELTS test to API...');
    const response = await axios.post(API_URL, testData);
    
    console.log('API Response:', JSON.stringify(response.data, null, 2));
    console.log('IELTS test uploaded successfully!');
    
    return response.data;
  } catch (error) {
    console.error('Error uploading IELTS test:');
    if (axios.isAxiosError(error)) {
      console.error('Status:', error.response?.status);
      console.error('Message:', error.response?.data);
    } else {
      console.error(error);
    }
  }
}

uploadIELTSTest(); 