import axios from 'axios';

export interface ChatMessage {
  question: string;
  history?: Array<{
    question: string;
    answer: string;
  }>;
}

export interface ChatResponse {
  text: string;
  sourceDocuments?: Array<{
    pageContent: string;
    metadata: {
      [key: string]: any;
    };
  }>;
}

class FlowiseService {
  private apiUrl: string;
  private chatflowId: string;
  private apiKey: string | undefined;

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_FLOWISE_API_URL || 'http://localhost:3000';
    this.chatflowId = process.env.NEXT_PUBLIC_FLOWISE_CHATFLOW_ID || '';
    this.apiKey = process.env.NEXT_PUBLIC_FLOWISE_API_KEY;
  }

  /**
   * Send a chat message to Flowise API
   */
  async sendMessage(
    message: string,
    history: Array<{ question: string; answer: string }> = []
  ): Promise<ChatResponse> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add API key if provided
      if (this.apiKey) {
        headers['x-api-key'] = this.apiKey;
      }

      const response = await axios.post(
        `${this.apiUrl}/api/v1/prediction/${this.chatflowId}`,
        {
          question: message,
          history: history,
          overrideConfig: {},
        },
        {
          headers,
        }
      );

      return {
        text: response.data.text || response.data,
        sourceDocuments: response.data.sourceDocuments,
      };
    } catch (error: any) {
      console.error('Flowise API Error:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to get response from AI assistant'
      );
    }
  }

  /**
   * Check if Flowise API is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      const headers: Record<string, string> = {};
      
      // Add API key if provided
      if (this.apiKey) {
        headers['x-api-key'] = this.apiKey;
      }

      const response = await axios.get(`${this.apiUrl}/api/v1/health`, { headers });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

export const flowiseService = new FlowiseService();

