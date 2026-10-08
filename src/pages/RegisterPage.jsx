import { useState } from "react";
import api from "../api";
import { useNavigate, useLocation, Link } from "react-router-dom";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    width: "380px",
    background: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    padding: "20px 28px",
  };

  const pageHeading = {
    textAlign: "center",
    fontSize: "36px",
    fontWeight: "bold",
    margin: "30px 0 20px",
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

  const fieldGroup = { marginBottom: "9px" };

  const label = {
    display: "block",
    fontSize: "13px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "4px",
  };

  const inputStyle = {
    width: "100%",
    padding: "7px 10px",
    boxSizing: "border-box",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
  };

  const selectStyle = { ...inputStyle };

  const divider = {
    border: "none",
    borderTop: "1px solid #eee",
    margin: "10px 0 0",
  };

  const buttonStyle = {
    width: "100%",
    padding: "9px",
    marginTop: "14px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    cursor: "pointer",
  };

  const footerText = {
    textAlign: "center",
    marginTop: "10px",
    fontSize: "13px",
    color: "#555",
  };

  return (
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
            <input
              style={inputStyle}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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

          {error && <p style={{ color: "red", fontSize: "13px" }}>{error}</p>}
          {success && (
            <p style={{ color: "green", fontSize: "13px" }}>
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
  );
}

export default RegisterPage;