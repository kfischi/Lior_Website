"use client";

import { useReducer, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X, Send, Lock } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface State {
  isOpen: boolean;
  messages: Message[];
  input: string;
  isLoading: boolean;
  isComplete: boolean;
}

type Action =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "SET_INPUT"; payload: string }
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_COMPLETE" };

// ─── Reducer ─────────────────────────────────────────────────────────────────

const initialState: State = {
  isOpen: false,
  messages: [],
  input: "",
  isLoading: false,
  isComplete: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "OPEN":
      return { ...state, isOpen: true };
    case "CLOSE":
      return { ...state, isOpen: false };
    case "SET_INPUT":
      return { ...state, input: action.payload };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_COMPLETE":
      return { ...state, isComplete: true };
    default:
      return state;
  }
}

// ─── Opening message ──────────────────────────────────────────────────────────

const OPENING_MESSAGE: Message = {
  id: "init-0",
  role: "assistant",
  content:
    "שלום. אני מערכת הקבלה של משרד עורכי הדין.\nאני כאן כדי לסייע לך בצורה חסויה ומהירה.\nכל מידע שתשתף איתי מוצפן ומועבר ישירות לצוות המשפטי.\n\nכדי שנוכל לסייע לך בצורה הטובה ביותר, אשאל אותך מספר שאלות קצרות.\n\nראשית — מה שמך המלא?",
  timestamp: new Date(),
};

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex gap-1.5 items-center py-3 px-4 bg-noir-elevated w-fit"
      style={{ borderRight: "2px solid #8b0000" }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 bg-noir-gold rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

// ─── Single message bubble ─────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: Message }) {
  const isAssistant = msg.role === "assistant";
  const time = msg.timestamp.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      className={`flex ${isAssistant ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="max-w-[85%] flex flex-col gap-1">
        <div
          className="px-4 py-3"
          style={
            isAssistant
              ? {
                  background: "#1a1a1a",
                  borderRight: "2px solid #8b0000",
                  textAlign: "right",
                }
              : {
                  background: "transparent",
                  border: "1px solid #2a2a2a",
                  textAlign: "right",
                }
          }
        >
          <p
            className="font-heebo text-sm text-noir-text/90 leading-relaxed whitespace-pre-line"
          >
            {msg.content}
          </p>
        </div>
        <p
          className="font-heebo text-[10px] text-noir-muted"
          style={{ textAlign: isAssistant ? "right" : "left" }}
        >
          {time}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AIChat() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sessionId = useRef(
    `session_${Date.now()}_${Math.random().toString(36).slice(2)}`
  );

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.messages, state.isLoading]);

  // Send opening message when chat opens for the first time
  useEffect(() => {
    if (state.isOpen && state.messages.length === 0) {
      setTimeout(() => {
        dispatch({ type: "ADD_MESSAGE", payload: OPENING_MESSAGE });
      }, 400);
    }
  }, [state.isOpen, state.messages.length]);

  // Focus textarea on open
  useEffect(() => {
    if (state.isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  }, [state.isOpen]);

  const sendMessage = useCallback(async () => {
    const content = state.input.trim();
    if (!content || state.isLoading || state.isComplete) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    dispatch({ type: "ADD_MESSAGE", payload: userMsg });
    dispatch({ type: "SET_INPUT", payload: "" });
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const history = [...state.messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, sessionId: sessionId.current }),
      });

      const data = await res.json();

      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      dispatch({ type: "ADD_MESSAGE", payload: assistantMsg });

      if (data.complete) {
        dispatch({ type: "SET_COMPLETE" });
      }
    } catch {
      dispatch({
        type: "ADD_MESSAGE",
        payload: {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "אירעה שגיאה. אנא נסה שוב או התקשר אלינו ישירות.",
          timestamp: new Date(),
        },
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.input, state.isLoading, state.isComplete, state.messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Trigger button */}
      <motion.button
        id="ai-chat-trigger"
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2.5 px-5 py-3 font-heebo text-sm"
        style={{
          background: "#0d0d0d",
          border: "1px solid rgba(212,175,55,0.3)",
          color: "#d4af37",
        }}
        onClick={() => dispatch({ type: state.isOpen ? "CLOSE" : "OPEN" })}
        whileHover={{ borderColor: "rgba(212,175,55,0.6)" }}
        transition={{ duration: 0.2 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Pulsing red dot */}
        <div className="relative">
          <Lock size={14} />
          <motion.div
            className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-noir-accent"
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(139,0,0,0.8)",
                "0 0 0 4px rgba(139,0,0,0)",
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
        <span>שוחח עם המערכת שלנו</span>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {state.isOpen && (
          <motion.div
            className="fixed bottom-20 left-6 z-50"
            style={{
              width: 380,
              height: 560,
              background: "#0d0d0d",
              border: "1px solid rgba(212,175,55,0.2)",
              boxShadow: "0 0 60px rgba(0,0,0,0.8), 0 0 20px rgba(139,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
            }}
            dir="rtl"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Gold top border */}
            <div className="h-0.5 w-full bg-noir-gold flex-shrink-0" />

            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ borderBottom: "1px solid rgba(212,175,55,0.1)" }}
            >
              <button
                onClick={() => dispatch({ type: "CLOSE" })}
                className="text-noir-muted hover:text-noir-text transition-colors bg-transparent border-none p-1"
                aria-label="סגור"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col items-end gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-playfair text-sm font-semibold text-noir-text">
                    מערכת קבלה משפטית
                  </span>
                  <ShieldCheck size={16} className="text-noir-gold" />
                </div>
                <p
                  className="font-heebo text-[10px] text-noir-gold/50 tracking-[0.2em] uppercase"
                >
                  מוצפן | חסוי | מאובטח
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 chat-scroll">
              {state.messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}

              {state.isLoading && (
                <div className="flex justify-end">
                  <TypingIndicator />
                </div>
              )}

              {state.isComplete && (
                <motion.div
                  className="text-center py-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 font-heebo text-xs text-noir-gold"
                    style={{ border: "1px solid rgba(212,175,55,0.3)" }}
                  >
                    <ShieldCheck size={12} />
                    הפנייה התקבלה — ניצור איתך קשר בהקדם
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div
              className="flex-shrink-0 px-4 py-3 flex items-end gap-3"
              style={{ borderTop: "1px solid rgba(212,175,55,0.15)" }}
            >
              <motion.button
                onClick={sendMessage}
                disabled={!state.input.trim() || state.isLoading || state.isComplete}
                className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-noir-gold disabled:text-noir-muted transition-colors bg-transparent border-none"
                whileHover={{ scale: state.input.trim() ? 1.1 : 1 }}
                transition={{ duration: 0.15 }}
                aria-label="שלח"
              >
                <Send size={16} />
              </motion.button>

              <textarea
                ref={textareaRef}
                value={state.input}
                onChange={(e) =>
                  dispatch({ type: "SET_INPUT", payload: e.target.value })
                }
                onKeyDown={handleKeyDown}
                disabled={state.isLoading || state.isComplete}
                placeholder="הקלד את הודעתך..."
                rows={1}
                className="flex-1 bg-transparent text-noir-text font-heebo text-sm placeholder-noir-muted outline-none border-none leading-relaxed"
                style={{
                  minHeight: 36,
                  maxHeight: 90,
                  resize: "none",
                  direction: "rtl",
                  textAlign: "right",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
