import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    student_id: "",
    course: "",
    year: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const cleaned = {
      full_name: formData.full_name.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      student_id: formData.student_id.trim(),
      course: formData.course.trim(),
      year: formData.year,
    };

    if (
      !cleaned.full_name ||
      !cleaned.email ||
      !cleaned.password ||
      !cleaned.student_id ||
      !cleaned.course ||
      !cleaned.year
    ) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "${process.env.REACT_APP_API_URL}/api/auth/student/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...cleaned,
            year: Number(cleaned.year),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to register.");
        setLoading(false);
        return;
      }

      setMessage(data.message || "Registration successful.");
      setFormData({
        full_name: "",
        email: "",
        password: "",
        student_id: "",
        course: "",
        year: "",
      });

      setLoading(false);

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError("Unable to connect to server.");
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">Student Registration</h1>
          <p className="register-subtitle">
            Create your account and wait for approval before login.
          </p>
        </div>

        <form className="register-form" onSubmit={handleRegister}>
          <div className="register-form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-form-group">
            <label>Student ID</label>
            <input
              type="text"
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-form-group">
            <label>Course</label>
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-form-group">
            <label>Year</label>
            <input
              type="number"
              name="year"
              min="1"
              max="6"
              value={formData.year}
              onChange={handleChange}
              required
            />
          </div>

          {message && <div className="register-success">{message}</div>}
          {error && <div className="register-error">{error}</div>}

          <button
            type="submit"
            className="register-btn"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="register-footer">
          Already have an account? <Link to="/">Go to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;