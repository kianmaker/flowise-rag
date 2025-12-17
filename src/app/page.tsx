'use client';

import ChatInterface from '@/components/ChatInterface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShirt, faComments } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  return (
    <main className="main-container">
      <div className="main-content">
        <div className="main-header">
          <FontAwesomeIcon icon={faShirt} className="main-icon" />
          <h1 className="main-title">
            KIAN2 Clothing
          </h1>
          <p className="main-subtitle">
            <FontAwesomeIcon icon={faComments} className="subtitle-icon" />
            Your Fashion Assistant - Powered by Flowise RAG
          </p>
        </div>
        <ChatInterface />
      </div>
    </main>
  );
}

