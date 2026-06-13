import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.error || "Login nahi hua yaar! 😅");
    }
    setLoading(false);
  };

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <div style={styles.logo}>🏥</div>
        <h1 style={styles.brand}>Zizixshu_care</h1>
        <p style={styles.tagline}>Tera apna health AI — Patna, Bihar 💚</p>

        {error && <div style={styles.error}>{error}</div>}

        <input style={styles.input} type="email" name="email"
          placeholder="📧 Email address" value={form.email} onChange={handleChange} />
        <input style={styles.input} type="password" name="password"
          placeholder="🔒 Password" value={form.password} onChange={handleChange}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />

        <button style={styles.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? "Aa raha hoon... ⏳" : "Login Karo 🚀"}
        </button>

        <p style={styles.link}>
          Naya hai kya?{" "}
          <Link to="/register" style={{ color: "#00b894", fontWeight: "bold" }}>
            Register karo! 🎉
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  bg: { minHeight: "100vh", background: "linear-gradient(135deg, #0a3d2e, #00b894)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" },
  card: { background: "white", borderRadius: 24, padding: "40px 35px", width: 370, boxShadow: "0 25px 60px rgba(0,0,0,0.25)", textAlign: "center" },
  logo: { fontSize: 52, marginBottom: 8 },
  brand: { margin: "0 0 6px", color: "#0a3d2e", fontSize: 28, fontWeight: "900", letterSpacing: 1 },
  tagline: { color: "#888", marginBottom: 28, fontSize: 13 },
  error: { background: "#ffe0e0", color: "#c0392b", padding: "10px 15px", borderRadius: 10, marginBottom: 15, fontSize: 14 },
  input: { width: "100%", padding: "13px 16px", marginBottom: 14, border: "2px solid #eee", borderRadius: 12, fontSize: 15, boxSizing: "border-box", outline: "none", transition: "border 0.2s" },
  btn: { width: "100%", padding: "14px", background: "linear-gradient(135deg, #0a3d2e, #00b894)", color: "white", border: "none", borderRadius: 12, fontSize: 16, fontWeight: "bold", cursor: "pointer", marginTop: 4 },
  link: { marginTop: 22, fontSize: 14, color: "#666" }
};
