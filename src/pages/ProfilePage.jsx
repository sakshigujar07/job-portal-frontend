import { useState, useEffect } from "react";
import api from "../api";
import Navbar from "../Navbar";
import {
  ACCENT,
  TEXT_MUTED,
  cardStyle,
  pageHeading,
  inputStyle,
  buttonStyle,
  errorMsgStyle,
  successMsgStyle,
} from "../theme";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function ProfilePage() {
  const [fullName, setFullName] = useState("");
  const [skills, setSkills] = useState("");
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [education, setEducation] = useState("");
  const [profileId, setProfileId] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      const response = await api.get(
        "/profiles/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfileId(response.data.id);
      setFullName(response.data.fullName || "");
      setSkills(response.data.skills || "");
      setBio(response.data.bio || "");
      setExperience(
        response.data.experience === null || response.data.experience === undefined
          ? ""
          : String(response.data.experience)
      );
      setCurrentLocation(response.data.currentLocation || "");
      setExpectedSalary(response.data.expectedSalary || "");
      setEducation(response.data.education || "");
      setHasProfile(true);
      setIsFormOpen(false);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setHasProfile(false);
        setIsFormOpen(true);
      } else {
        setError("Failed to load profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const payload = {
      fullName,
      skills,
      bio,
      experience: experience === "" ? null : Number(experience),
      currentLocation,
      expectedSalary,
      education,
    };

    try {
      if (hasProfile) {
        await api.put(
          `/profiles/update/${profileId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess("Profile updated successfully.");
      } else {
        const response = await api.post(
          "/profiles/create",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfileId(response.data.id);
        setHasProfile(true);
        setSuccess("Profile created successfully.");
      }
      setIsFormOpen(false);
    } catch (err) {
      if (err.response && err.response.data) {
        const data = err.response.data;
        setError(typeof data === "object" ? Object.values(data).join(", ") : String(data));
      } else {
        setError("Something went wrong.");
      }
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete your profile? This cannot be undone.");
    if (!confirmed) return;

    setError("");
    setSuccess("");
    try {
      await api.delete(
        `/profiles/delete/${profileId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHasProfile(false);
      setProfileId(null);
      setFullName("");
      setSkills("");
      setBio("");
      setExperience("");
      setCurrentLocation("");
      setExpectedSalary("");
      setEducation("");
      setIsFormOpen(true);
      setSuccess("Profile deleted successfully.");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(String(err.response.data));
      } else {
        setError("Failed to delete profile.");
      }
    }
  };

  const editButtonStyle = {
    padding: "6px 14px",
    fontSize: "13px",
    fontWeight: "bold",
    borderRadius: "6px",
    border: `1px solid ${ACCENT}`,
    background: "#fff",
    color: ACCENT,
    cursor: "pointer",
  };

  const deleteButtonStyle = {
    padding: "6px 14px",
    fontSize: "13px",
    fontWeight: "bold",
    borderRadius: "6px",
    border: "1px solid #c62828",
    background: "#fff",
    color: "#c62828",
    cursor: "pointer",
  };

  const fieldLabel = {
    display: "block",
    fontSize: "13px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "4px",
  };

  const fieldGroup = { marginBottom: "14px" };

  if (loading)
    return (
      <div>
        <Navbar />
        <p style={{ color: TEXT_MUTED, textAlign: "center", marginTop: "30px" }}>Loading...</p>
      </div>
    );

  const headlineParts = [education, currentLocation].filter(Boolean);

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 15px" }}>
        {!isFormOpen && <h1 style={pageHeading}>My Profile</h1>}

        {success && !isFormOpen && (
          <p style={{ ...successMsgStyle, textAlign: "center", display: "inline-block" }}>{success}</p>
        )}

        {!isFormOpen && hasProfile && (
          <div style={{ ...cardStyle, padding: "24px", position: "relative", marginTop: "16px" }}>
            <div style={{ position: "absolute", top: "16px", right: "16px", display: "flex", gap: "8px" }}>
              <button
                onClick={() => { setIsFormOpen(true); setSuccess(""); }}
                style={editButtonStyle}
              >
                Edit
              </button>
              <button onClick={handleDelete} style={deleteButtonStyle}>
                Delete
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "#dbe4ff",
                  color: "#1a3a8f",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  fontWeight: "bold",
                  flexShrink: 0,
                }}
              >
                {getInitials(fullName)}
              </div>
              <div>
                <h2 style={{ margin: 0, color: "#111" }}>{fullName}</h2>
                {headlineParts.length > 0 && (
                  <p style={{ margin: "4px 0 0", color: TEXT_MUTED }}>{headlineParts.join(" · ")}</p>
                )}
              </div>
            </div>

            <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <strong style={{ color: "#333" }}>Experience</strong>
                <p style={{ margin: "2px 0", color: TEXT_MUTED }}>
                  {experience === "" ? "—" : `${experience} year${experience === "1" ? "" : "s"}`}
                </p>
              </div>
              <div>
                <strong style={{ color: "#333" }}>Expected Salary</strong>
                <p style={{ margin: "2px 0", color: TEXT_MUTED }}>{expectedSalary || "—"}</p>
              </div>
            </div>

            <div style={{ marginTop: "16px" }}>
              <strong style={{ color: "#333" }}>Skills</strong>
              <p style={{ margin: "4px 0", color: TEXT_MUTED }}>{skills || "—"}</p>
            </div>

            <div style={{ marginTop: "16px" }}>
              <strong style={{ color: "#333" }}>Bio</strong>
              <p style={{ margin: "4px 0", whiteSpace: "pre-wrap", color: TEXT_MUTED }}>{bio || "—"}</p>
            </div>
          </div>
        )}

        {isFormOpen && (
          <div style={{ ...cardStyle, marginTop: "16px" }}>
            <h2 style={{ margin: "0 0 16px", color: "#111" }}>{hasProfile ? "Edit Profile" : "Create Profile"}</h2>
            <form onSubmit={handleSubmit}>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ ...inputStyle, width: "100%" }}
                  required
                />
              </div>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Skills</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  style={{ ...inputStyle, width: "100%" }}
                  required
                />
              </div>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  style={{ ...inputStyle, width: "100%" }}
                  rows={4}
                  required
                />
              </div>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Experience (years)</label>
                <input
                  type="number"
                  min="0"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  style={{ ...inputStyle, width: "100%" }}
                />
              </div>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Current Location</label>
                <input
                  type="text"
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                  style={{ ...inputStyle, width: "100%" }}
                />
              </div>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Expected Salary / CTC</label>
                <input
                  type="text"
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value)}
                  style={{ ...inputStyle, width: "100%" }}
                  placeholder="e.g. 3-5 LPA"
                />
              </div>
              <div style={fieldGroup}>
                <label style={fieldLabel}>Education</label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  style={{ ...inputStyle, width: "100%" }}
                  placeholder="e.g. Bachelor's degree - College name"
                />
              </div>
              {error && <p style={errorMsgStyle}>{error}</p>}
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="submit" style={buttonStyle}>
                  {hasProfile ? "Update Profile" : "Create Profile"}
                </button>
                {hasProfile && (
                  <button
                    type="button"
                    onClick={() => { setIsFormOpen(false); setError(""); }}
                    style={{ ...editButtonStyle, borderColor: "#ccc", color: "#555" }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;