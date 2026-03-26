import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import { CVProvider, useCV } from './CVContext';
import { Header } from './components/Header';
import { Form } from './components/Form';
import { Preview, CVPreviewContent } from './components/Preview';
import { cn } from './lib/utils';

const AppContent: React.FC = () => {
  const { isLivePreview } = useCV();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={cn(
        "flex-1 w-full mx-auto px-4 py-8 transition-all duration-500",
        isLivePreview ? "max-w-[100vw] px-6" : "max-w-4xl"
      )}>
        <div className={cn(
          "grid gap-8",
          isLivePreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
        )}>
          <div className={cn(
            "transition-all duration-500",
            isLivePreview ? "h-[calc(100vh-120px)] overflow-y-auto pr-4 custom-scrollbar" : ""
          )}>
            <Form />
          </div>
          
          {isLivePreview && (
            <div className="hidden lg:block h-[calc(100vh-120px)] sticky top-[88px]">
              <CVPreviewContent className="rounded-xl shadow-2xl border border-border-card overflow-hidden" />
            </div>
          )}
        </div>
      </main>
      <Preview />
    </div>
  );
};

export default function App() {
  return (
    <CVProvider>
      <AppContent />
      <Analytics />
    </CVProvider>
  );
}
