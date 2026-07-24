const axios = require('axios');

class MoberForwarder {
  constructor() {
    this.baseURL = process.env.MAIN_BACKEND_URL;
    this.apiKey = process.env.MAIN_BACKEND_API_KEY;
  }

  async forwardToMober(data) {
    try {
      const url = `${this.baseURL}/api/sensors`;
      console.log(`🔄 Forwarding to Mober: ${url}`);
      
      const response = await axios.post(
        url,
        data,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );
      
      console.log(`✅ Successfully forwarded to Mober: ${data.device_code}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to forward to Mober:`, error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received - is Mober server running?');
      }
      throw error;
    }
  }
}

module.exports = new MoberForwarder();
