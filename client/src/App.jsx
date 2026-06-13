import { useState, useEffect, useRef } from "react";

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #080b14; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #2a2060; border-radius: 10px; }

    @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideInLeft { from { opacity: 0; transform: translateX(-16px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes slideInRight { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
    @keyframes ticker { from { transform: translateX(100%); } to { transform: translateX(-100%); } }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes typing { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-5px); opacity: 1; } }
    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    @keyframes bounceIn { 0% { transform: scale(0.85); opacity: 0; } 60% { transform: scale(1.02); } 100% { transform: scale(1); opacity: 1; } }

    .slide-up { animation: slideUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards; }
    .input-glow:focus { border-color: #7850ff !important; box-shadow: 0 0 0 3px rgba(120,80,255,0.15) !important; outline: none; }
    .chip-hover { transition: all 0.18s ease; }
    .chip-hover:hover { border-color: #7850ff !important; color: #a888ff !important; background: rgba(120,80,255,0.08) !important; }
    .btn-hover { transition: all 0.18s ease; }
    .btn-hover:hover { opacity: 0.85; transform: translateY(-1px); }
  `}</style>
);

const C = {
  bg:         "#080b14",
  surface:    "#0d1120",
  surfaceHi:  "#111828",
  border:     "rgba(255,255,255,0.07)",
  borderHi:   "rgba(120,80,255,0.3)",
  violet:     "#7850ff",
  violetSoft: "#9d7aff",
  violetDim:  "rgba(120,80,255,0.12)",
  text:       "#dde6f5",
  textMuted:  "#4a5680",
  textDim:    "#2a3350",
  userBubble: "rgba(120,80,255,0.18)",
  botBubble:  "rgba(255,255,255,0.04)",
  glass:      "rgba(255,255,255,0.03)",
};

// ─── FLOATING BG ──────────────────────────────────────────────────────────────
const FloatingBg = () => (
  <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
    <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(120,80,255,0.07) 0%, transparent 70%)", top: -100, left: -100 }} />
    <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(80,120,255,0.05) 0%, transparent 70%)", bottom: 100, right: -50 }} />
  </div>
);

// ─── TICKER ───────────────────────────────────────────────────────────────────
const Ticker = () => (
  <div style={{ background: C.violet, padding: "5px 0", overflow: "hidden" }}>
    <div style={{ whiteSpace: "nowrap", animation: "ticker 20s linear infinite", display: "inline-block", color: "#ede8ff", fontWeight: 500, fontSize: 11, letterSpacing: 0.3 }}>
      🏥 Zizixshu_care — Patna, Bihar ka apna health AI &nbsp;·&nbsp; 🤒 Symptoms batao, solution pao &nbsp;·&nbsp; 💊 Doctor se milna mat bhulna &nbsp;·&nbsp; 🤖 AI-powered · Free · Fast · Desi &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </div>
  </div>
);

// ─── LOGIN ────────────────────────────────────────────────────────────────────
const Login = ({ onLogin, onGoRegister }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    try {
      const res = await fetch("http://https://zizixshu-care-server.onrender.com/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) { setError(err.message || "Kuch gadbad ho gayi yaar!"); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", position: "relative" }}>
      <GlobalStyle /><FloatingBg /><Ticker />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", zIndex: 1 }}>
        <div className="slide-up" style={{ width: "100%", maxWidth: 400 }}>

          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: C.violetDim, border: `1.5px solid ${C.borderHi}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 16px", animation: "float 3s ease-in-out infinite" }}>🏥</div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 800, color: C.text, letterSpacing: -0.5 }}>Zizixshu_care</h1>
            <p style={{ color: C.textMuted, fontSize: 13, marginTop: 6 }}>📍 Patna, Bihar ka apna AI Doctor</p>
          </div>

          <div style={{ background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: 20, padding: "32px 28px", backdropFilter: "blur(20px)" }}>
            <h2 style={{ color: C.text, fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Wapas aa gaye! 🎉</h2>
            <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 24 }}>Login karo aur sehat ki baat karo</p>

            {error && <div style={{ background: "rgba(220,60,60,0.1)", border: "0.5px solid rgba(220,60,60,0.3)", color: "#e07070", padding: "10px 14px", borderRadius: 10, marginBottom: 16, fontSize: 13 }}>😬 {error}</div>}

            {[["Email", "email", "email", "tera@email.com"], ["Password", "password", "password", "Secret password"]].map(([label, type, key, ph]) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={{ color: C.textMuted, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>{label}</label>
                <input className="input-glow" style={inputStyle} type={type} placeholder={ph}
                  value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()} />
              </div>
            ))}

            <button className="btn-hover" onClick={handleSubmit} disabled={loading}
              style={{ width: "100%", padding: "13px", border: "none", borderRadius: 12, background: C.violet, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif", marginTop: 4 }}>
              {loading ? <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</span> : "Login →"}
            </button>

            <div style={{ textAlign: "center", marginTop: 18, color: C.textMuted, fontSize: 13 }}>
              Naya hai?{" "}
              <span onClick={onGoRegister} style={{ color: C.violetSoft, fontWeight: 600, cursor: "pointer" }}>Register karo</span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
            {["🆓 Free", "⚡ Fast", "🔒 Secure", "🤖 AI"].map(b => (
              <span key={b} style={{ background: C.surface, border: `0.5px solid ${C.border}`, color: C.textMuted, padding: "4px 12px", borderRadius: 20, fontSize: 11 }}>{b}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── REGISTER ─────────────────────────────────────────────────────────────────
const Register = ({ onGoLogin }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(""); setSuccess(""); setLoading(true);
    try {
      const res = await fetch("http://https://zizixshu-care-server.onrender.com/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Registered! Ab login karo! 🎉");
      setTimeout(onGoLogin, 1500);
    } catch (err) { setError(err.message || "Kuch gadbad ho gayi!"); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", position: "relative" }}>
      <GlobalStyle /><FloatingBg /><Ticker />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", zIndex: 1 }}>
        <div className="slide-up" style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 48, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>🩺</div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 800, color: C.text }}>Parivaar mein swagat!</h1>
            <p style={{ color: C.textMuted, fontSize: 13, marginTop: 4 }}>Zizixshu_care family join karo 💚</p>
          </div>
          <div style={{ background: C.surface, border: `0.5px solid ${C.border}`, borderRadius: 20, padding: "32px 28px" }}>
            <h2 style={{ color: C.text, fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Naya account 🆕</h2>
            {error && <div style={{ background: "rgba(220,60,60,0.1)", border: "0.5px solid rgba(220,60,60,0.3)", color: "#e07070", padding: "10px 14px", borderRadius: 10, marginBottom: 14, fontSize: 13 }}>😬 {error}</div>}
            {success && <div style={{ background: "rgba(120,80,255,0.1)", border: `0.5px solid ${C.borderHi}`, color: C.violetSoft, padding: "10px 14px", borderRadius: 10, marginBottom: 14, fontSize: 13 }}>✅ {success}</div>}
            {[["Naam", "text", "name", "Apna naam likho"], ["Email", "email", "email", "tera@email.com"], ["Password", "password", "password", "Strong password"]].map(([label, type, key, ph]) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={{ color: C.textMuted, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>{label}</label>
                <input className="input-glow" style={inputStyle} type={type} placeholder={ph} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
            <button className="btn-hover" onClick={handleSubmit} disabled={loading}
              style={{ width: "100%", padding: "13px", border: "none", borderRadius: 12, background: C.violet, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif", marginTop: 4 }}>
              {loading ? "⏳ Ho raha hai..." : "Register →"}
            </button>
            <div style={{ textAlign: "center", marginTop: 18, color: C.textMuted, fontSize: 13 }}>
              Already member?{" "}
              <span onClick={onGoLogin} style={{ color: C.violetSoft, fontWeight: 600, cursor: "pointer" }}>Login karo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── TYPING ───────────────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: C.botBubble, backdropFilter: "blur(12px)", border: `0.5px solid ${C.border}`, borderRadius: "14px 14px 14px 3px", width: "fit-content" }}>
    <span style={{ fontSize: 14 }}>🤖</span>
    <div style={{ display: "flex", gap: 3 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.violetSoft, animation: "typing 1.2s ease infinite", animationDelay: `${i * 0.18}s` }} />
      ))}
    </div>
    <span style={{ color: C.textMuted, fontSize: 11 }}>Soch raha hoon...</span>
  </div>
);

// ─── CONFIDENCE PILL ──────────────────────────────────────────────────────────
const ConfidencePill = ({ predictions }) => {
  if (!predictions || predictions.length === 0) return null;
  const top = predictions[0];
  if (top.confidence < 25) return null;
  const color = top.confidence >= 70 ? "#5eead4" : top.confidence >= 45 ? C.violetSoft : "#f97316";
  return (
    <div style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 6, background: `${color}12`, border: `0.5px solid ${color}40`, borderRadius: 20, padding: "4px 10px", animation: "fadeIn 0.4s ease" }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, animation: "pulse 2s ease infinite" }} />
      <span style={{ color: color, fontSize: 11, fontWeight: 500 }}>ML: {top.disease} — {top.confidence}%</span>
    </div>
  );
};

// ─── MEDICINE ALERT ───────────────────────────────────────────────────────────
const MedicineAlert = () => (
  <div style={{ marginTop: 8, maxWidth: "78%", background: "rgba(180,60,60,0.07)", border: "0.5px solid rgba(180,60,60,0.2)", borderRadius: 10, padding: "9px 12px", backdropFilter: "blur(8px)", animation: "bounceIn 0.4s ease" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
      <span style={{ fontSize: 13 }}>⚠️</span>
      <span style={{ color: "#c06060", fontWeight: 600, fontSize: 11, letterSpacing: 0.3 }}>Prescription Alert</span>
    </div>
    <p style={{ color: "#7a4040", fontSize: 11, lineHeight: 1.5 }}>
      Bina doctor ki prescription ke koi bhi medicine mat lo. Sirf general info ke liye hai.
    </p>
  </div>
);

const hasMedicineInfo = (text) => {
  if (!text) return false;
  const keywords = ["tablet", "syrup", "crocin", "dolo", "paracetamol", "ibuprofen",
    "benadryl", "honitus", "domstal", "cetirizine", "combiflam", "saridon",
    "gelusil", "omez", "pan 40", "💊", "🍶", "common medicines"];
  return keywords.some(k => text.toLowerCase().includes(k));
};

// ─── MESSAGE BUBBLE ───────────────────────────────────────────────────────────
const MessageBubble = ({ msg }) => {
  const isUser = msg.role === "user";
  const showAlert = !isUser && hasMedicineInfo(msg.text);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", animation: isUser ? "slideInRight 0.3s ease" : "slideInLeft 0.3s ease", marginBottom: 2 }}>
      {!isUser && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.violetDim, border: `0.5px solid ${C.borderHi}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>🤖</div>
          <span style={{ color: C.violetSoft, fontSize: 11, fontWeight: 500 }}>Zizixshu_care</span>
        </div>
      )}
      <div style={{
        maxWidth: "78%", padding: "11px 15px",
        borderRadius: isUser ? "16px 16px 3px 16px" : "16px 16px 16px 3px",
        background: isUser ? C.userBubble : C.botBubble,
        border: isUser ? `0.5px solid ${C.borderHi}` : `0.5px solid ${C.border}`,
        color: isUser ? "#d8d0ff" : C.text,
        fontSize: 13.5, lineHeight: 1.65, fontWeight: 400,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        boxShadow: isUser ? "inset 0 1px 0 rgba(255,255,255,0.07)" : "inset 0 1px 0 rgba(255,255,255,0.03)",
        whiteSpace: "pre-wrap"
      }}>
        {msg.text}
      </div>
      {!isUser && msg.predictions && <ConfidencePill predictions={msg.predictions} />}
      {showAlert && <MedicineAlert />}
      <span style={{ color: C.textDim, fontSize: 10, marginTop: 4, paddingLeft: isUser ? 0 : 2, paddingRight: isUser ? 2 : 0 }}>
        {new Date(msg.time || Date.now()).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>
  );
};

// ─── CHAT ─────────────────────────────────────────────────────────────────────
const Chat = ({ user, onLogout }) => {
  const [messages, setMessages] = useState([{
    role: "bot",
    text: `Hello! 👋 Main hoon Zizixshu_care — tera apna health AI from Patna, Bihar!\n\nApna naam batao yaar, phir symptoms batao — main hoon na! 💪\n\n(Hindi ya English — dono chalega! 🇮🇳)`,
    time: Date.now(), predictions: null
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const token = localStorage.getItem("token");

  const quickSymptoms = [
    { icon: "🤒", label: "Fever", val: "Fever / Bukhar" },
    { icon: "🤧", label: "Cough", val: "Khansi / Cough" },
    { icon: "🤕", label: "Headache", val: "Sir dard / Headache" },
    { icon: "🤢", label: "Nausea", val: "Ji machlana / Nausea" },
    { icon: "😴", label: "Fatigue", val: "Thakan / Fatigue" },
    { icon: "💪", label: "Body ache", val: "Badan dard / Body ache" },
  ];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: msg, time: Date.now() }]);
    setLoading(true);
    try {
      const history = messages.slice(-10).map(m => ({ role: m.role === "bot" ? "assistant" : "user", text: m.text }));
      const res = await fetch("http://https://zizixshu-care-server.onrender.com/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: msg, history })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "bot", text: data.reply, time: Date.now(), predictions: data.ml_predictions || null }]);
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: "⚠️ Kuch gadbad ho gayi! Thodi der baad try karo.", time: Date.now(), predictions: null }]);
    }
    setLoading(false);
  };

  const clearChat = async () => {
    try { await fetch("http://https://zizixshu-care-server.onrender.com/api/chat/history", { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }); } catch {}
    setMessages([{ role: "bot", text: "Chat clear ho gayi! 🧹 Nayi shuruat karte hain!", time: Date.now(), predictions: null }]);
  };

  return (
    <div style={{ height: "100vh", background: C.bg, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <GlobalStyle />
      <FloatingBg />

      {/* Header */}
      <div style={{ background: "rgba(13,17,32,0.95)", borderBottom: `0.5px solid ${C.border}`, padding: "11px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 10, backdropFilter: "blur(20px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: C.violetDim, border: `1.5px solid ${C.borderHi}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏥</div>
          <div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text, fontSize: 15, fontWeight: 700, lineHeight: 1.1 }}>Zizixshu_care</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.violet, animation: "pulse 2s ease infinite" }} />
              <span style={{ color: C.textMuted, fontSize: 11 }}>Online · Patna, Bihar</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={clearChat} className="btn-hover" style={{ background: C.glass, border: `0.5px solid ${C.border}`, color: C.textMuted, padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>🧹 Clear</button>
          <button onClick={onLogout} className="btn-hover" style={{ background: "rgba(180,60,60,0.08)", border: "0.5px solid rgba(180,60,60,0.2)", color: "#c06060", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>Logout</button>
        </div>
      </div>

      <Ticker />

      {/* Welcome */}
      <div style={{ background: "rgba(120,80,255,0.05)", borderBottom: `0.5px solid rgba(120,80,255,0.1)`, padding: "7px 18px", display: "flex", alignItems: "center", gap: 8, zIndex: 1 }}>
        <span style={{ fontSize: 14 }}>👤</span>
        <span style={{ color: C.violetSoft, fontWeight: 600, fontSize: 12 }}>Swagat hai, {user?.name || "Dost"}!</span>
        <span style={{ color: C.textMuted, fontSize: 12 }}>Apni sehat ki baat karo 💚</span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 16px", display: "flex", flexDirection: "column", gap: 14, position: "relative", zIndex: 1 }}>
        {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Quick chips */}
      <div style={{ padding: "8px 16px 6px", display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", zIndex: 1, background: "rgba(8,11,20,0.8)", borderTop: `0.5px solid ${C.border}` }}>
        {quickSymptoms.map(s => (
          <button key={s.val} onClick={() => sendMessage(s.val)} className="chip-hover"
            style={{ background: C.glass, border: `0.5px solid ${C.border}`, color: C.textMuted, padding: "5px 12px", borderRadius: 20, cursor: "pointer", fontSize: 11, fontWeight: 500, whiteSpace: "nowrap", flexShrink: 0, fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: "10px 14px 14px", background: "rgba(13,17,32,0.95)", borderTop: `0.5px solid ${C.border}`, display: "flex", gap: 8, alignItems: "center", backdropFilter: "blur(20px)", zIndex: 1 }}>
        <input className="input-glow"
          style={{ flex: 1, background: C.glass, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: "11px 16px", color: C.text, fontSize: 13.5, fontFamily: "'Inter', sans-serif", outline: "none", transition: "border 0.2s, box-shadow 0.2s" }}
          placeholder="Apne symptoms batao..."
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()} />
        <button className="btn-hover" onClick={() => sendMessage()} disabled={loading || !input.trim()}
          style={{ background: input.trim() ? C.violet : "rgba(255,255,255,0.06)", border: "none", borderRadius: 12, width: 44, height: 44, cursor: input.trim() ? "pointer" : "default", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
          {loading ? <span style={{ animation: "spin 1s linear infinite", display: "inline-block", fontSize: 14 }}>⏳</span> : "➤"}
        </button>
      </div>

      {/* Disclaimer */}
      <div style={{ background: "rgba(8,11,20,0.9)", borderTop: `0.5px solid ${C.border}`, padding: "5px 16px", textAlign: "center", zIndex: 1 }}>
        <span style={{ color: C.textDim, fontSize: 10 }}>⚠️ AI prediction hai — real doctor ki jagah nahi le sakta. Doctor se zaroor milein.</span>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%", padding: "11px 14px", marginBottom: 0,
  border: `0.5px solid rgba(255,255,255,0.08)`, borderRadius: 10, fontSize: 13.5,
  background: "rgba(255,255,255,0.03)", color: "#dde6f5",
  fontFamily: "'Inter', sans-serif", transition: "border 0.2s, box-shadow 0.2s", display: "block"
};

export default function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } });
  useEffect(() => { if (localStorage.getItem("token") && user) setPage("chat"); }, []);
  const handleLogin = (u) => { setUser(u); setPage("chat"); };
  const handleLogout = () => { localStorage.clear(); setUser(null); setPage("login"); };
  if (page === "chat" && user) return <Chat user={user} onLogout={handleLogout} />;
  if (page === "register") return <Register onGoLogin={() => setPage("login")} />;
  return <Login onLogin={handleLogin} onGoRegister={() => setPage("register")} />;
}