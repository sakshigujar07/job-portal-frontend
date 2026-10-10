import { useState } from "react";
import api from "../api";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Navbar from "../Navbar";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("jobseeker");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      await api.post("/users", {
        name,
        email,
        password,
        role,
        contact,
        address,
      });
      setSuccess(true);
      const returnTo = location.state?.returnTo;
      setTimeout(
        () => navigate("/login", returnTo ? { state: { returnTo } } : {}),
        1500
      );
    } catch (err) {
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (typeof data === "object") {
          const messages = Object.values(data).join(", ");
          setError(messages);
        } else {
          setError(String(data));
        }
      } else {
        setError("Registration failed. Try again.");
      }
    }
  };

  // ---- styles ----
  const pageWrap = {
    minHeight: "calc(100vh - 60px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: "20px",
    paddingBottom: "20px",
  };

  const card = {
    width: "460px",
    maxWidth: "90%",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
    padding: "24px 40px",
  };

  const pageHeading = {
    textAlign: "center",
    fontSize: "38px",
    fontWeight: "bold",
    margin: "30px 0 22px",
  };

  const sectionLabel = {
    fontSize: "12px",
    fontWeight: "bold",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    margin: "12px 0 6px",
  };

  const firstSectionLabel = { ...sectionLabel, marginTop: "0" };

  const fieldGroup = { marginBottom: "12px" };

  const label = {
    display: "block",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "5px",
  };

  const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    boxSizing: "border-box",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px",
    background: "#ffffff",
  };

  const passwordInputStyle = { ...inputStyle, paddingRight: "44px" };

  const eyeButton = {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    padding: "2px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    color: "#555",
  };

  const selectStyle = { ...inputStyle };

  const divider = {
    border: "none",
    borderTop: "1px solid #eee",
    margin: "10px 0 0",
  };

  const buttonStyle = {
    width: "100%",
    padding: "11px",
    marginTop: "16px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  };

  const footerText = {
    textAlign: "center",
    marginTop: "12px",
    fontSize: "14px",
    color: "#555",
  };

  const EyeIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
      <line x1="3" y1="3" x2="21" y2="21" />
    </svg>
  );

  return (
    <div>
      <Navbar />
      <div style={pageWrap}>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1 style={pageHeading}>Job Portal Register</h1>
          <div style={card}>
            <form onSubmit={handleSubmit}>
              {/* Basic Info */}
              <div style={firstSectionLabel}>Basic Info</div>
              <div style={fieldGroup}>
                <label style={label}>Name</label>
                <input
                  style={inputStyle}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div style={fieldGroup}>
                <label style={label}>Email</label>
                <input
                  style={inputStyle}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div style={fieldGroup}>
                <label style={label}>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    style={passwordInputStyle}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    style={eyeButton}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <hr style={divider} />

              {/* Contact Info */}
              <div style={sectionLabel}>Contact Info</div>
              <div style={fieldGroup}>
                <label style={label}>Contact</label>
                <input
                  style={inputStyle}
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
              <div style={fieldGroup}>
                <label style={label}>Address</label>
                <input
                  style={inputStyle}
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <hr style={divider} />

              {/* Role */}
              <div style={sectionLabel}>Account Type</div>
              <div style={fieldGroup}>
                <label style={label}>Role</label>
                <select
                  style={selectStyle}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="jobseeker">Jobseeker</option>
                  <option value="employer">Employer</option>
                </select>
              </div>

              {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
              {success && (
                <p style={{ color: "green", fontSize: "14px" }}>
                  Registered! Redirecting to login...
                </p>
              )}

              <button style={buttonStyle} type="submit">
                Register
              </button>
            </form>
            <p style={footerText}>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;