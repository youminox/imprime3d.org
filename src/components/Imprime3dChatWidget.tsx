"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type FormEvent,
} from "react";
import { CHAT_ENDPOINT, OPEN_CHAT_EVENT } from "@/lib/chat-constants";

const STORAGE_VISITOR_KEY = "i3d_chat_visitor_v1";
const STORAGE_SESSION_KEY = "i3d_chat_session_v1";
const STORAGE_MESSAGES_KEY = "i3d_chat_messages_v1";

export interface ChatArticleCard {
  slug: string;
  title: string;
  category: string;
  categoryName: string;
  url: string;
  image: string;
  readTime: string;
  excerpt: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendedArticles?: ChatArticleCard[];
  suggestedOptions?: string[];
  createdAt: string;
}

const INITIAL_QUICK_OPTIONS = [
  "🖨️ ¿Qué impresora 3D FDM o de resina me recomiendas comprar?",
  "🔥 ¿Cómo evitar el warping y que se despegue la primera capa?",
  "⚙️ Mi impresora no extruye o tiene la boquilla atascada",
  "🧵 Qué temperaturas usar para PLA, PETG, ABS y TPU flexible",
  "🎯 Mejores ajustes en Cura para piezas precisas y sin hilos",
  "🧰 Cómo hacer el mantenimiento y lubricación de ejes y correas",
  "💡 Ideas y diseños 3D rentables para imprimir y vender",
];

const DEFAULT_WELCOME =
  "¡Hola! 👋 Soy tu Asesor Técnico IA de Imprime3D.org. Pregúntame qué impresora 3D FDM o de resina comprar, cómo evitar el warping, cómo desatascar el extrusor, qué temperaturas usar para PLA/PETG/ABS/TPU o cualquier duda sobre nuestras 505 guías.";

export default function Imprime3dChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [showTeaser, setShowTeaser] = useState(true);
  const [visitorId, setVisitorId] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState(DEFAULT_WELCOME);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingPromptRef = useRef<string | null>(null);

  useEffect(() => {
    try {
      let vid = localStorage.getItem(STORAGE_VISITOR_KEY);
      if (!vid) {
        vid =
          "i3d-" +
          Math.random().toString(36).slice(2, 10) +
          "-" +
          Date.now().toString(36);
        localStorage.setItem(STORAGE_VISITOR_KEY, vid);
      }
      setVisitorId(vid);

      const savedSession = localStorage.getItem(STORAGE_SESSION_KEY);
      if (savedSession) setSessionId(savedSession);

      const savedMessages = localStorage.getItem(STORAGE_MESSAGES_KEY);
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // ignore storage errors
    }

    fetch(CHAT_ENDPOINT, { method: "GET" })
      .then((r) => r.json())
      .then((data) => {
        if (typeof data?.is_enabled === "boolean") {
          setIsEnabled(data.is_enabled);
        }
        if (data?.welcome_message) {
          setWelcomeMessage(data.welcome_message);
        }
      })
      .catch(() => {
        // fallback to default enabled
      });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    }
  }, [messages, isOpen, isLoading]);

  const persistMessages = useCallback(
    (nextMessages: ChatMessage[], nextSessionId?: string | null) => {
      setMessages(nextMessages);
      try {
        localStorage.setItem(
          STORAGE_MESSAGES_KEY,
          JSON.stringify(nextMessages.slice(-24))
        );
        if (nextSessionId) {
          localStorage.setItem(STORAGE_SESSION_KEY, nextSessionId);
        }
      } catch {
        // ignore
      }
    },
    []
  );

  const trackArticleClick = (
    targetUrl: string,
    article?: { slug?: string; title?: string; category?: string }
  ) => {
    try {
      fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "track_click",
          session_id: sessionId,
          visitor_id: visitorId,
          article_slug: article?.slug || null,
          article_title: article?.title || null,
          category: article?.category || null,
          target_url: targetUrl,
          page_url:
            typeof window !== "undefined"
              ? window.location.href
              : "https://imprime3d.org/",
        }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // ignore
    }
  };

  const sendMessage = useCallback(
    async (textToSend: string) => {
      const trimmed = textToSend.trim();
      if (!trimmed || isLoading) return;

      const userMsg: ChatMessage = {
        id: "u-" + Date.now(),
        role: "user",
        content: trimmed,
        createdAt: new Date().toISOString(),
      };

      const updatedWithUser = [...messages, userMsg];
      persistMessages(updatedWithUser, sessionId);
      setInput("");
      setIsLoading(true);

      try {
        const historyPayload = updatedWithUser.slice(-8).map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch(CHAT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "chat",
            session_id: sessionId,
            visitor_id: visitorId,
            message: trimmed,
            history: historyPayload.slice(0, -1),
            page_url:
              typeof window !== "undefined"
                ? window.location.href
                : "https://imprime3d.org/",
            user_agent:
              typeof navigator !== "undefined" ? navigator.userAgent : "",
          }),
        });

        const data = await res.json();
        const newSessId = data.session_id || sessionId;
        if (newSessId && newSessId !== sessionId) {
          setSessionId(newSessId);
        }

        const assistantMsg: ChatMessage = {
          id: "a-" + Date.now(),
          role: "assistant",
          content:
            data.reply ||
            "Te recomiendo revisar nuestras guías de compra y calibración 3D en [Imprime en 3D](https://imprime3d.org/guias/).",
          recommendedArticles: Array.isArray(data.recommended_articles)
            ? data.recommended_articles
            : [],
          suggestedOptions: Array.isArray(data.suggested_options)
            ? data.suggested_options
            : [],
          createdAt: new Date().toISOString(),
        };

        persistMessages([...updatedWithUser, assistantMsg], newSessId);
      } catch {
        const fallbackMsg: ChatMessage = {
          id: "a-err-" + Date.now(),
          role: "assistant",
          content:
            "En este momento hubo una demora en la conexión. Puedes explorar nuestras 505 guías de impresión 3D en [Imprime en 3D](https://imprime3d.org/guias/).",
          suggestedOptions: ["Intentar de nuevo"],
          createdAt: new Date().toISOString(),
        };
        persistMessages([...updatedWithUser, fallbackMsg], sessionId);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, persistMessages, sessionId, visitorId]
  );

  useEffect(() => {
    const handleOpenEvent = (ev: Event) => {
      const customEv = ev as CustomEvent<{ prompt?: string }>;
      setIsOpen(true);
      setShowTeaser(false);
      if (customEv.detail?.prompt) {
        pendingPromptRef.current = customEv.detail.prompt;
      }
    };
    window.addEventListener(OPEN_CHAT_EVENT, handleOpenEvent);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, handleOpenEvent);
  }, []);

  useEffect(() => {
    if (isOpen && pendingPromptRef.current && !isLoading) {
      const p = pendingPromptRef.current;
      pendingPromptRef.current = null;
      sendMessage(p);
    }
  }, [isOpen, isLoading, sendMessage]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleResetChat = () => {
    setMessages([]);
    setSessionId(null);
    try {
      localStorage.removeItem(STORAGE_MESSAGES_KEY);
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } catch {
      // ignore
    }
  };

  const toLocalOrFullHref = (url: string) => {
    if (
      typeof window !== "undefined" &&
      window.location.hostname === "localhost"
    ) {
      return url.replace(/^https?:\/\/(www\.)?imprime3d\.org/i, "") || "/";
    }
    return url;
  };

  const toImageSrc = (imgUrl: string) => {
    if (!imgUrl)
      return "/images/Que-es-y-como-funciona-una-impresora-3D.jpg";
    return imgUrl.replace(/^https?:\/\/(www\.)?imprime3d\.org/i, "");
  };

  const renderFormattedContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, lineIdx) => {
      if (!line.trim()) {
        return <div key={lineIdx} className="h-2" />;
      }

      const tokenRegex = /(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|\*\*[^*]+\*\*)/g;
      const parts = line.split(tokenRegex);

      return (
        <p key={lineIdx} className="leading-relaxed mb-1.5 last:mb-0">
          {parts.map((part, i) => {
            const linkMatch = part.match(
              /^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/
            );
            if (linkMatch) {
              const [, label, url] = linkMatch;
              return (
                <a
                  key={i}
                  href={toLocalOrFullHref(url)}
                  onClick={() => trackArticleClick(url, { title: label })}
                  className="inline-flex items-center gap-1 font-bold text-[#0284c7] underline decoration-[#06b6d4] decoration-2 underline-offset-2 hover:text-[#0369a1] transition-colors"
                >
                  <span>{label}</span>
                  <span aria-hidden="true">→</span>
                </a>
              );
            }

            const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
            if (boldMatch) {
              return (
                <strong key={i} className="font-bold text-slate-900">
                  {boldMatch[1]}
                </strong>
              );
            }

            return <span key={i}>{part}</span>;
          })}
        </p>
      );
    });
  };

  if (!isEnabled) return null;

  const latestAssistantMsg =
    messages.length > 0 && messages[messages.length - 1].role === "assistant"
      ? messages[messages.length - 1]
      : null;

  return (
    <div className="fixed bottom-[86px] right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div
          className="mb-3 w-[calc(100vw-2rem)] sm:w-[415px] h-[590px] max-h-[80vh] rounded-3xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
          role="dialog"
          aria-label="Asesor Técnico IA Imprime3D.org"
        >
          {/* Header */}
          <div
            className="px-4 py-3.5 text-white flex items-center justify-between gap-3 shrink-0"
            style={{
              background:
                "linear-gradient(135deg, #071324 0%, #0369a1 55%, #0284c7 100%)",
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-10 h-10 rounded-full bg-white/15 border border-cyan-400/40 grid place-items-center shrink-0">
                <span className="text-xl" aria-hidden="true">
                  🖨️
                </span>
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#34d399] border-2 border-[#071324]"
                  title="En línea"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-[15px] leading-tight truncate text-white">
                    Asesor IA · Imprime3D.org
                  </h3>
                  <span className="inline-flex items-center whitespace-nowrap shrink-0 leading-none text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-cyan-100 text-[#0369a1]">
                    En línea
                  </span>
                </div>
                <p className="text-xs text-cyan-200/90 truncate mt-0.5">
                  Impresoras 3D, Filamentos, Calibración y Fallos · 505 guías
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleResetChat}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center text-xs text-white transition-colors cursor-pointer"
                  title="Reiniciar conversación"
                  aria-label="Reiniciar conversación"
                >
                  ↺
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center text-sm font-bold text-white transition-colors cursor-pointer"
                aria-label="Cerrar chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8fafc]"
            data-lenis-prevent
          >
            {/* Welcome Bubble */}
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#071324] text-cyan-400 grid place-items-center text-xs font-bold shrink-0 mt-0.5 border border-cyan-500/40">
                🖨️
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-white border border-slate-200 p-3.5 text-[13.5px] text-slate-900 shadow-sm max-w-[88%]">
                <p className="leading-relaxed">{welcomeMessage}</p>
              </div>
            </div>

            {/* Initial Quick Options */}
            {messages.length === 0 && !isLoading && (
              <div className="pl-9 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Elige qué quieres diagnosticar o consultar:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {INITIAL_QUICK_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => sendMessage(opt)}
                      className="text-left text-xs font-semibold px-3 py-2 rounded-xl bg-white border border-sky-200 text-[#0369a1] hover:bg-[#0284c7] hover:text-white hover:border-[#0284c7] transition-all shadow-sm cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conversation History */}
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-2.5">
                {msg.role === "user" ? (
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-tr-sm bg-[#0284c7] text-white px-3.5 py-2.5 text-[13.5px] max-w-[85%] shadow-sm">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#071324] text-cyan-400 grid place-items-center text-xs font-bold shrink-0 mt-0.5 border border-cyan-500/40">
                      🖨️
                    </div>
                    <div className="space-y-2.5 max-w-[88%] min-w-0">
                      <div className="rounded-2xl rounded-tl-sm bg-white border border-slate-200 p-3.5 text-[13.5px] text-slate-800 shadow-sm">
                        {renderFormattedContent(msg.content)}
                      </div>

                      {/* Recommended Article Cards */}
                      {msg.recommendedArticles &&
                        msg.recommendedArticles.length > 0 && (
                          <div className="space-y-2">
                            {msg.recommendedArticles.map((art) => (
                              <div
                                key={art.slug}
                                className="rounded-2xl bg-white border border-sky-200 p-3 shadow-sm hover:border-[#0284c7] transition-all"
                              >
                                <div className="flex items-center gap-3">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={toImageSrc(art.image)}
                                    alt={art.title}
                                    className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                                    loading="lazy"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284c7] block truncate">
                                      {art.categoryName} · ⏱️ {art.readTime}
                                    </span>
                                    <h4 className="font-extrabold text-xs sm:text-[13px] text-slate-900 line-clamp-2 leading-snug">
                                      {art.title}
                                    </h4>
                                  </div>
                                </div>
                                <a
                                  href={toLocalOrFullHref(art.url)}
                                  onClick={() =>
                                    trackArticleClick(art.url, {
                                      slug: art.slug,
                                      title: art.title,
                                      category: art.category,
                                    })
                                  }
                                  className="mt-2.5 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#071324] via-[#0369a1] to-[#0284c7] hover:from-[#0b1d36] hover:to-[#0369a1] text-cyan-100 font-extrabold text-xs py-2 px-3 transition-colors shadow-sm"
                                >
                                  <span>Leer guía en Imprime3D.org</span>
                                  <span aria-hidden="true">→</span>
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Suggested Follow-up Options */}
            {latestAssistantMsg &&
              latestAssistantMsg.suggestedOptions &&
              latestAssistantMsg.suggestedOptions.length > 0 &&
              !isLoading && (
                <div className="pl-9 flex flex-wrap gap-1.5 pt-1">
                  {latestAssistantMsg.suggestedOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => sendMessage(opt)}
                      className="text-left text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-[#0284c7]/40 text-[#0369a1] hover:bg-[#0284c7] hover:text-white transition-colors cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#071324] text-cyan-400 grid place-items-center text-xs font-bold shrink-0">
                  🖨️
                </div>
                <div className="rounded-2xl bg-white border border-slate-200 px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#0284c7] animate-bounce" />
                  <span
                    className="inline-block w-2 h-2 rounded-full bg-[#06b6d4] animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="inline-block w-2 h-2 rounded-full bg-[#071324] animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                  <span className="ml-1 font-medium">
                    Consultando las 505 guías técnicas 3D...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta sobre impresoras 3D, warping, PLA/PETG o fallos..."
              disabled={isLoading}
              className="flex-1 rounded-full border border-slate-300 bg-[#f8fafc] px-4 py-2.5 text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0284c7]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-full bg-[#0284c7] hover:bg-[#0369a1] disabled:opacity-45 text-white grid place-items-center shrink-0 transition-colors cursor-pointer"
              aria-label="Enviar consulta"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating Callout Pill + Main Trigger Button */}
      <div className="flex items-center gap-2.5">
        {!isOpen && showTeaser && (
          <div className="hidden sm:flex items-center gap-2 rounded-2xl bg-white border border-sky-200 shadow-lg px-3.5 py-2 text-xs font-semibold text-slate-900">
            <button
              type="button"
              onClick={() => {
                setIsOpen(true);
                setShowTeaser(false);
              }}
              className="flex items-center gap-2 text-left cursor-pointer"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-[#06b6d4] animate-pulse" />
              <span>
                ¿Dudas de impresión 3D, warping o filamentos?{" "}
                <strong className="text-[#0284c7]">
                  Pregúntale a la IA →
                </strong>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setShowTeaser(false)}
              className="text-slate-400 hover:text-slate-800 ml-1 text-[11px] cursor-pointer"
              aria-label="Ocultar aviso"
            >
              ✕
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            setShowTeaser(false);
          }}
          className="group relative flex items-center gap-2.5 rounded-full px-4 py-3 sm:px-5 sm:py-3.5 text-white font-extrabold text-sm shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
          style={{
            background:
              "linear-gradient(135deg, #071324 0%, #0369a1 52%, #06b6d4 100%)",
            boxShadow: "0 14px 30px -6px rgba(2, 132, 199, 0.65)",
          }}
          aria-label={
            isOpen
              ? "Cerrar Asesor IA de Imprime3D.org"
              : "Abrir Asesor IA de Imprime3D.org"
          }
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38bdf8] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#38bdf8]" />
          </span>
          <span>{isOpen ? "Cerrar Asesor IA" : "Asesor IA 3D"}</span>
          <span className="text-base" aria-hidden="true">
            🖨️
          </span>
        </button>
      </div>
    </div>
  );
}
