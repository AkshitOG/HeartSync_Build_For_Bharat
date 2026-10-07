"use client";

import React, { useState } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { HRHeader } from "@/components/HRHeader";
import { queryHRDeskService, HRDeskQueryResult } from "@/lib/hrDeskService";

interface ChatMessage {
  id: string;
  sender: "user" | "desk";
  timestamp: string;
  query?: string;
  result?: HRDeskQueryResult;
  text?: string;
}

export default function AIHRDeskPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-welcome",
      sender: "desk",
      timestamp: "Just now",
      text: "Hello! I am your AI HR Intelligence Desk. I provide deterministic, evidence-grounded answers to any question regarding workforce capacity, attendance patterns, burnout risks, or priority actions across our 48 employees. How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isQuerying, setIsQuerying] = useState(false);

  const suggestedQueries = [
    "Which department is overloaded?",
    "Who is at risk of burnout?",
    "What is the Monday attendance pattern?",
    "Summarize today's urgent issues",
    "Which team has the highest workload?",
    "Which employees need HR attention?"
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || isQuerying) return;

    const userMsgId = `user-${Date.now()}`;
    const deskMsgId = `desk-${Date.now()}`;
    const timeNow = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    // Append user message
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: "user",
        timestamp: timeNow,
        text: textToSend
      }
    ]);
    setInput("");
    setIsQuerying(true);

    try {
      const result = await queryHRDeskService(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          id: deskMsgId,
          sender: "desk",
          timestamp: timeNow,
          query: textToSend,
          result
        }
      ]);
    } catch (err) {
      console.error("AI Desk error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: deskMsgId,
          sender: "desk",
          timestamp: timeNow,
          text: "I encountered an error querying workforce telemetry. Please try again."
        }
      ]);
    } finally {
      setIsQuerying(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearConversation = () => {
    setMessages([
      {
        id: "cleared-welcome",
        sender: "desk",
        timestamp: "Just now",
        text: "Conversation reset. You can ask any new workforce query or select a suggested topic below."
      }
    ]);
  };

  return (
    <AuthGuard requiredRole="hr">
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
        <HRHeader activeSection="ai-desk" />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-in flex flex-col">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#0a0f1d] border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white shadow-sm shrink-0">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] font-semibold text-teal-300 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Deterministic Workforce Intelligence Engine
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                AI HR Intelligence Desk
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Direct evidence-backed natural language decision support grounded in live employee telemetry, attendance, and workload signals.
              </p>
            </div>

            <button
              type="button"
              onClick={clearConversation}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition cursor-pointer self-start sm:self-auto shrink-0 flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Conversation
            </button>
          </div>

          {/* Quick Query Pills */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2 font-mono">
              Suggested Workforce Inquiries
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map((sq, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(sq)}
                  disabled={isQuerying}
                  className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 border border-slate-200 text-slate-700 transition cursor-pointer shadow-xs font-medium disabled:opacity-50"
                >
                  &ldquo;{sq}&rdquo;
                </button>
              ))}
            </div>
          </div>

          {/* Conversation History */}
          <div className="flex-1 space-y-4 overflow-y-auto">
            {messages.map((msg) => {
              if (msg.sender === "user") {
                return (
                  <div key={msg.id} className="flex justify-end animate-fade-in">
                    <div className="max-w-2xl bg-teal-600 text-white rounded-2xl rounded-br-xs px-5 py-3 shadow-sm">
                      <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                      <span className="text-[10px] text-teal-100 mt-1 block text-right font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              }

              // Desk sender
              if (msg.result) {
                const res = msg.result;
                return (
                  <div key={msg.id} className="flex justify-start animate-fade-in">
                    <div className="max-w-3xl w-full bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-5 shadow-xs space-y-4">
                      {/* Query Header & Confidence */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="h-6 w-6 rounded-lg bg-teal-600 text-white text-xs font-extrabold flex items-center justify-center">
                            HR
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            Telemetry Response
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            {res.dataSource}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-bold">
                            {res.confidence}
                          </span>
                        </div>
                      </div>

                      {/* Direct Answer */}
                      <div>
                        <strong className="text-xs uppercase tracking-wider text-teal-700 block mb-1">
                          Direct Answer:
                        </strong>
                        <p className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                          {res.answer}
                        </p>
                      </div>

                      {/* Evidence & Action Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                        <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 shadow-xs">
                          <strong className="text-[11px] uppercase tracking-wider text-slate-600 block mb-2 font-bold">
                            Evidence Trail:
                          </strong>
                          {Array.isArray(res.evidence) ? (
                            <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                              {res.evidence.map((ev, i) => (
                                <li key={i} className="leading-relaxed">{ev}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-slate-700 leading-relaxed">{res.evidence}</p>
                          )}
                        </div>

                        <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 shadow-xs">
                          <strong className="text-[11px] uppercase tracking-wider text-emerald-800 block mb-2 font-bold">
                            Recommended Action:
                          </strong>
                          {Array.isArray(res.recommended_action) ? (
                            <ul className="text-xs text-emerald-950 space-y-1.5 list-disc list-inside font-medium">
                              {res.recommended_action.map((act, i) => (
                                <li key={i} className="leading-relaxed">{act}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-emerald-950 leading-relaxed">{res.recommended_action}</p>
                          )}
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-400 font-mono pt-1 text-right">
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                );
              }

              // Simple text message
              return (
                <div key={msg.id} className="flex justify-start animate-fade-in">
                  <div className="max-w-2xl bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-4 shadow-xs">
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{msg.text}</p>
                    <span className="text-[10px] text-slate-400 mt-2 block font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isQuerying && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-slate-600 font-medium">
                    Consulting workforce telemetry &amp; organizational logs...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-xs shrink-0">
            <div className="flex gap-2 items-end">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                placeholder="Ask any workforce question (Enter to submit, Shift+Enter for newline)..."
                className="flex-1 resize-none bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={isQuerying || !input.trim()}
                className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-bold text-xs transition cursor-pointer shadow-xs shrink-0 flex items-center gap-1.5"
              >
                <span>Ask</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
            <div className="flex justify-between items-center mt-2 px-1 text-[11px] text-slate-400">
              <span>Supports natural language queries regarding 48 workforce members</span>
              <span className="font-mono">Enter ↵</span>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
