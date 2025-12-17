'use client';

import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <main className="main-container">
      <div className="main-content">
        <div className="main-header">
          <h1 className="main-title">
            AI Assistant
          </h1>
          <p className="main-subtitle">
            Powered by Flowise RAG Chatbot
          </p>
        </div>
        <ChatInterface />
      </div>
    </main>
  );
}

