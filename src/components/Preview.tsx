import React, { useState } from 'react';
import { useCV } from '../CVContext';
import { TRANSLATIONS } from '../constants';
import { CVDocument } from './CVDocument';
import { PDFDownloadLink, PDFViewer, BlobProvider } from '@react-pdf/renderer';
import { FileText, Download, X, Eye, ExternalLink, AlertCircle, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const printPdfFromUrl = (url: string | null) => {
  if (!url) return;

  const printWindow = window.open('', '_blank', 'width=1024,height=768');
  if (!printWindow) {
    window.open(url, '_blank');
    return;
  }

  const cleanup = () => {
    if (!printWindow.closed) {
      printWindow.close();
    }
  };

  printWindow.document.title = 'Print CV';
  printWindow.document.body.style.margin = '0';
  printWindow.document.body.style.background = '#111827';

  const iframe = printWindow.document.createElement('iframe');
  iframe.style.width = '100vw';
  iframe.style.height = '100vh';
  iframe.style.border = '0';
  iframe.src = url;
  printWindow.document.body.appendChild(iframe);

  const triggerPrint = () => {
    printWindow.setTimeout(() => {
      const iframeWindow = iframe.contentWindow;
      if (!iframeWindow) {
        printWindow.location.href = url;
        return;
      }

      try {
        iframeWindow.focus();
        iframeWindow.print();
      } catch {
        printWindow.location.href = url;
      }
    }, 350);
  };

  iframe.onload = () => {
    triggerPrint();
  };

  printWindow.addEventListener(
    'afterprint',
    () => {
      printWindow.setTimeout(cleanup, 150);
    },
    { once: true },
  );

  printWindow.setTimeout(() => {
    if (printWindow.closed) {
      return;
    }

    triggerPrint();
  }, 1500);
};

export const CVPreviewContent: React.FC<{ className?: string }> = ({ className }) => {
  const { data } = useCV();
  const lang = data.meta.language;
  const t = TRANSLATIONS[lang];
  
  return (
    <div className={cn("w-full h-full min-h-[600px] flex flex-col gap-4", className)}>
      <div className="flex-1 relative group">
        <PDFViewer 
          key={JSON.stringify(data.meta.lastModified)} 
          width="100%" 
          height="100%" 
          className="border-none rounded-lg shadow-inner"
        >
          <CVDocument data={data} />
        </PDFViewer>
        
        {/* Fallback info for browsers like Brave */}
        <div className="absolute inset-0 -z-10 flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-gray-600 font-medium mb-2">
            {lang === 'sr-Cyrl' || lang === 'sr-Latn' ? 'Преглед је можда блокиран од стране прегледача.' : 'Preview might be blocked by your browser.'}
          </p>
          <p className="text-sm text-gray-400">
            {lang === 'sr-Cyrl' || lang === 'sr-Latn' ? 'Ако видите празан простор, онемогућите "Shields" или користите дугме испод.' : 'If you see a blank space, disable "Shields" or use the button below.'}
          </p>
        </div>
      </div>

      <BlobProvider document={<CVDocument data={data} />}>
        {({ url, loading }) => (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => url && window.open(url, '_blank')}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-white border border-border-card rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ExternalLink className="w-4 h-4" />
              {lang === 'sr-Cyrl' || lang === 'sr-Latn' ? 'Отвори у новој картици' : 'Open in New Tab'}
            </button>
            <button
              type="button"
              onClick={() => printPdfFromUrl(url)}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-2 px-4 bg-white border border-border-card rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              {lang === 'sr-Cyrl' || lang === 'sr-Latn' ? 'Штампај' : 'Print'}
            </button>
          </div>
        )}
      </BlobProvider>
    </div>
  );
};

export const Preview: React.FC = () => {
  const { data, isLivePreview, errors } = useCV();
  const [isOpen, setIsOpen] = useState(false);
  const lang = data.meta.language;
  const t = TRANSLATIONS[lang];
  
  const hasErrors = Object.keys(errors).length > 0;
  const floatingActionButtonClass = "flex-1 sm:flex-none h-12 sm:w-14 sm:h-14 px-3 sm:px-0 rounded-xl sm:rounded-full shadow-lg flex items-center justify-center gap-2 transition-transform sm:hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <>
      <div
        className={cn(
          "fixed z-40 bottom-4 inset-x-4 sm:bottom-8 sm:inset-x-auto sm:right-8 flex gap-2 sm:flex-col sm:gap-4",
          isLivePreview && "lg:hidden"
        )}
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={cn(
            floatingActionButtonClass,
            "bg-accent text-white"
          )}
          title={t.preview}
        >
          <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="sm:hidden text-xs font-bold">{t.preview}</span>
        </button>

        <BlobProvider document={<CVDocument data={data} />}>
          {({ url, loading }) => (
            <button
              type="button"
              onClick={() => printPdfFromUrl(url)}
              disabled={loading || hasErrors}
              className={cn(
                floatingActionButtonClass,
                "bg-white border border-border-card text-gray-700"
              )}
              title="Print"
            >
              {loading ? <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" /> : <Printer className="w-5 h-5 sm:w-6 sm:h-6" />}
              <span className="sm:hidden text-xs font-bold">Print</span>
            </button>
          )}
        </BlobProvider>

        <PDFDownloadLink
          document={<CVDocument data={data} />}
          fileName={`CV_${data.personalInfo.firstName}_${data.personalInfo.lastName}.pdf`}
          className={cn(
            floatingActionButtonClass,
            "bg-accent-gold text-white",
            hasErrors && "opacity-50 cursor-not-allowed pointer-events-none"
          )}
        >
          {({ loading }) => (
            <>
              {loading ? <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" /> : <Download className="w-5 h-5 sm:w-6 sm:h-6" />}
              <span className="sm:hidden text-xs font-bold">{loading ? '...' : t.downloadPdf}</span>
            </>
          )}
        </PDFDownloadLink>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-5xl h-full rounded-xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-border-card flex items-center justify-between bg-app-bg">
                <div className="flex items-center gap-2 text-accent font-bold">
                  <FileText className="w-5 h-5" />
                  {t.preview}
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 bg-gray-100 overflow-auto p-4 flex justify-center">
                <CVPreviewContent />
              </div>

              <div className="p-4 border-t border-border-card bg-app-bg flex justify-end gap-4">
                <PDFDownloadLink
                  document={<CVDocument data={data} />}
                  fileName={`CV_${data.personalInfo.firstName}_${data.personalInfo.lastName}.pdf`}
                  className={cn(
                    "bg-accent text-white px-6 py-2 rounded-md font-bold flex items-center gap-2 hover:bg-accent/90 transition-colors",
                    hasErrors && "opacity-50 cursor-not-allowed pointer-events-none"
                  )}
                >
                  {({ loading }) => (
                    <>
                      <Download className="w-4 h-4" />
                      {loading ? '...' : t.downloadPdf}
                    </>
                  )}
                </PDFDownloadLink>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Loader2 = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
