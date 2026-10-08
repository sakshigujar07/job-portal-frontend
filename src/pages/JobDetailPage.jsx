import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../Navbar";
import {
  ACCENT,
  TEXT_MUTED,
  BORDER,
  cardStyle,
  buttonStyle,
  linkStyle,
  errorMsgStyle,
  successMsgStyle,
} from "../theme";

function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [linkedCompany, setLinkedCompany] = useState(null);
  const [error, setError] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [applyStatus, setApplyStatus] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(
          `/jobs/${id}`,
          token ? { headers: { Authorization: `Bearer ${token}` } } : {}
        );
        setJob(response.data);

        if (response.data.companyId) {
          try {
            const companyResponse = await api.get(
              `/companies/${response.data.companyId}`,
              token ? { headers: { Authorization: `Bearer ${token}` } } : {}
            );
            setLinkedCompany(companyResponse.data);
          } catch (companyErr) {
            // Non-fatal - fall back to the job's raw companyName below
            setLinkedCompany(null);
          }
        }
      } catch (err) {
        setError("Failed to load job details.");
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    setApplyStatus("");

    if (!token) {
      navigate("/login", { state: { returnTo: `/jobs/${id}` } });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("jobId", id);
      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      await api.post("/applications", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setApplyStatus("Applied successfully!");
    } catch (err) {
      const data = err.response?.data;
      const message =
        typeof data === "string"
          ? data
          : data?.message || "Something went wrong. Please try again.";
      setApplyStatus("Apply failed: " + message);
    }
  };

  if (error) {
    return (
      <div>
        <Navbar />
        <p style={{ ...errorMsgStyle, maxWidth: "700px", margin: "30px auto", textAlign: "center" }}>
          {error}
        </p>
      </div>
    );
  }

  if (!job) {
    return (
      <div>
        <Navbar />
        <p style={{ color: TEXT_MUTED, textAlign: "center", marginTop: "30px" }}>Loading...</p>
      </div>
    );
  }

  const isSuccess = applyStatus.startsWith("Applied successfully");
  const companyDisplayName = linkedCompany ? linkedCompany.name : job.companyName;

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: "700px", margin: "40px auto 30px", padding: "0 20px", fontFamily: "Arial" }}>
        <Link to="/jobs" style={linkStyle}>&larr; Back to Jobs</Link>
        <h1
          style={{
            marginTop: "15px",
            wordBreak: "break-word",
            overflowWrap: "break-word",
            lineHeight: 1.25,
            color: "#111",
          }}
        >
          {job.title}
        </h1>
        <p style={{ color: TEXT_MUTED, marginBottom: "6px" }}>
          <strong style={{ color: "#111" }}>{companyDisplayName}</strong> — {job.location}
        </p>
        <p style={{ color: TEXT_MUTED }}>Salary: {job.salary}</p>

        <div style={{ ...cardStyle, marginTop: "15px" }}>
          <h3 style={{ marginTop: 0, color: "#111" }}>Basic Job Information</h3>
          <p style={{ margin: "6px 0", color: "#333" }}><strong>Vacancy:</strong> {job.vacancy ?? "Not specified"}</p>
          <p style={{ margin: "6px 0", color: "#333" }}><strong>Employment Type:</strong> {job.employmentType || "Not specified"}</p>
          <p style={{ margin: "6px 0", color: "#333" }}><strong>Work Arrangement:</strong> {job.workArrangement || "Not specified"}</p>
          <p style={{ margin: "6px 0", color: "#333" }}><strong>Application Deadline:</strong> {job.applicationDeadline || "Not specified"}</p>
          <p style={{ margin: "6px 0", color: "#333" }}><strong>Posted On:</strong> {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : "Not specified"}</p>
          {job.notes && <p style={{ margin: "6px 0", color: "#333" }}><strong>Notes:</strong> {job.notes}</p>}
        </div>

        {(linkedCompany?.description || job.companyDescription) && (
          <div style={{ ...cardStyle, background: "#eef4ff", marginTop: "15px" }}>
            <h3 style={{ marginTop: 0, color: "#111" }}>About the Company</h3>
            <p style={{ color: "#333" }}>{linkedCompany?.description || job.companyDescription}</p>
            {linkedCompany?.website && (
              <p style={{ color: "#333", marginTop: "8px" }}>
                <a href={linkedCompany.website} target="_blank" rel="noreferrer">{linkedCompany.website}</a>
              </p>
            )}
          </div>
        )}

        <h3 style={{ marginTop: "20px", color: "#111" }}>Job Description</h3>
        <p style={{ color: "#333" }}>{job.description}</p>

        <hr style={{ margin: "20px 0", border: "none", borderTop: `1px solid ${BORDER}` }} />

        <div style={cardStyle}>
          <h3 style={{ marginTop: 0, color: "#111" }}>Apply for this job</h3>
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "13px", fontWeight: "bold", color: "#555" }}>
              Resume (PDF/DOC, optional):
            </label>
            <br />
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResumeFile(e.target.files[0])}
              style={{ marginTop: "6px" }}
            />
          </div>
          <button onClick={handleApply} style={buttonStyle}>
            Apply
          </button>
          {applyStatus && (
            <p style={{ ...(isSuccess ? successMsgStyle : errorMsgStyle), marginTop: "12px", display: "inline-block" }}>
              {applyStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobDetailPage;