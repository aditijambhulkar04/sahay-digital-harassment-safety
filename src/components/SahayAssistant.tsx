import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldCheck, X, Send, Info } from 'lucide-react';
import { useSahay } from '../context/SahayContext';
import { useI18n } from '../i18n';
import {
  ASSISTANT_UI_TEXT,
  AssistantTopicKey,
  buildLocalizedReply,
  generateSahayAssistantReply,
  getPageContextBanner,
} from '../services/sahayAssistantService';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  topicKey?: AssistantTopicKey;
  routeKey?: string;
}

export const SahayAssistant: React.FC = () => {
  const { lang } = useI18n();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'sahay-welcome-msg',
      role: 'assistant',
      text: ASSISTANT_UI_TEXT.en.firstMessage,
      topicKey: 'greeting',
      routeKey: 'landing',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const ui = ASSISTANT_UI_TEXT[lang] || ASSISTANT_UI_TEXT.en;
  const pageContextNote = getPageContextBanner(location.pathname, lang);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, lang]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const handleSendText = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsSending(true);

    try {
      const response = await generateSahayAssistantReply({
        userMessage: trimmed,
        language: lang,
        currentPathname: location.pathname,
      });

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: response.replyText,
        topicKey: response.topicKey,
        routeKey: response.routeKey,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleSendText(inputValue);
  };

  // Shift button slightly higher when Guided Demo bottom dock is open so it never covers controls
   const bottomOffsetClass = 'bottom-5';
  return (
    <div className="no-print">
      {/* Floating Button in Bottom-Right Corner */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={ui.buttonLabel}
          className={`fixed ${bottomOffsetClass} right-5 z-40 inline-flex items-center gap-2.5 px-4 py-2.5 bg-teal-800 text-white text-xs font-semibold rounded-xl shadow-lg border border-teal-700 hover:bg-teal-900 transition-colors cursor-pointer`}
        >
          <span className="w-6 h-6 rounded-lg bg-teal-900/80 border border-teal-600/60 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-100" aria-hidden="true" />
          </span>
          <span>{ui.buttonLabel}</span>
        </button>
      )}

      {/* Chat Panel (Mobile Bottom Sheet / Desktop Right-Side Panel) */}
      {isOpen && (
        <>
          {/* Subtle mobile-only backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/25 z-40 sm:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <aside
            role="dialog"
            aria-label={ui.headerTitle}
            className={`fixed inset-x-0 bottom-0 z-50 h-[82vh] max-h-[82vh] sm:inset-auto sm:right-5 ${
             'bottom-5'
            } sm:w-[390px] sm:h-[580px] sm:max-h-[calc(100vh-2.5rem)] bg-white border border-slate-300 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden`}
          >
            {/* Header */}
            <div className="px-4 py-3.5 bg-slate-900 text-white flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-teal-800 border border-teal-600/50 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-teal-100" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-white truncate">{ui.headerTitle}</h2>
                  <p className="text-xs text-slate-300 truncate">{ui.headerSubtitle}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={ui.closeLabel}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Safe Page Context Awareness Banner */}
            <div className="px-4 py-2 bg-teal-50/90 border-b border-teal-200/80 flex items-start gap-2 text-xs text-teal-950 shrink-0">
              <Info className="w-3.5 h-3.5 text-teal-800 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="leading-snug">{pageContextNote}</p>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {messages.map((msg) => {
                const displayText =
                  msg.role === 'assistant' && msg.topicKey
                    ? buildLocalizedReply(msg.topicKey, msg.routeKey || 'landing', lang)
                    : msg.text;

                return (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[86%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                        msg.role === 'user'
                          ? 'bg-teal-800 text-white'
                          : 'bg-white border border-slate-200 text-slate-800 shadow-2xs'
                      }`}
                    >
                      {displayText}
                    </div>
                  </div>
                );
              })}

              {isSending && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 text-slate-500 rounded-xl px-3.5 py-2 text-xs italic">
                    {ui.typingIndicator}
                  </div>
                </div>
              )}

              {/* Suggested Questions */}
              <div className="pt-2 space-y-1.5">
                <p className="text-[11px] font-medium text-slate-500">{ui.suggestedHeading}:</p>
                <div className="flex flex-wrap gap-1.5">
                  {ui.suggestedQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => void handleSendText(question)}
                      className="text-left px-2.5 py-1.5 bg-white border border-slate-300 hover:border-teal-700 hover:bg-teal-50/60 text-slate-800 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              <div ref={messagesEndRef} />
            </div>

            {/* Privacy Reassurance & Message Input */}
            <div className="p-3 bg-white border-t border-slate-200 space-y-2 shrink-0">
              <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={ui.inputPlaceholder}
                  aria-label={ui.inputPlaceholder}
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-800 text-slate-900 bg-slate-50/50"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isSending}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 disabled:opacity-50 transition-colors cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{ui.sendButton}</span>
                </button>
              </form>
              <p className="text-[10px] text-slate-500 leading-tight">{ui.privacyNote}</p>
            </div>
          </aside>
        </>
      )}
    </div>
  );
};
