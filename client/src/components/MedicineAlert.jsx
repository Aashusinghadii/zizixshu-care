export default function MedicineAlert() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.iconRow}>
        <span style={styles.icon}>🚨</span>
        <span style={styles.title}>PRESCRIPTION ALERT</span>
        <span style={styles.icon}>🚨</span>
      </div>
      <p style={styles.text}>
        Yahan di gayi medicines sirf <strong>general information</strong> ke liye hain!
      </p>
      <p style={styles.text}>
        <strong>⛔ BINA DOCTOR KI PRESCRIPTION KE KOI BHI MEDICINE MAT LO!</strong>
      </p>
      <p style={styles.sub}>
        👨‍⚕️ Apne doctor se milke hi sahi medicine aur dosage lo — ye apki sehat ka sawaal hai!
      </p>
    </div>
  );
}

const styles = {
  wrapper: {
    background: "linear-gradient(135deg, #ff000022, #ff660011)",
    border: "1.5px solid #ff444466",
    borderRadius: 14,
    padding: "12px 16px",
    marginTop: 10,
    animation: "slideInLeft 0.4s ease"
  },
  iconRow: {
    display: "flex", alignItems: "center", gap: 8, marginBottom: 6
  },
  icon: { fontSize: 18 },
  title: {
    color: "#ff6b6b", fontWeight: 900, fontSize: 13,
    letterSpacing: 1, textTransform: "uppercase"
  },
  text: {
    color: "#ffaaaa", fontSize: 13, lineHeight: 1.6, marginBottom: 4
  },
  sub: {
    color: "#ff886688", fontSize: 12, marginTop: 4
  }
};
