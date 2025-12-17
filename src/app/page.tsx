'use client';

import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            AI Assistant
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Powered by Flowise RAG Chatbot
          </p>
        </div>
        <ChatInterface />
      </div>
    </main>
  );
}

