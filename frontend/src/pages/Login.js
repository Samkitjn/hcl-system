import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import InteractiveShapes from "./AnimatedShapes";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (token && storedRole === "management") {
      navigate("/management/dashboard");
    } else if (token && storedRole === "student") {
      navigate("/student/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url =
        role === "management"
          ? '${process.env.REACT_APP_API_URL}/api/auth/management/login'
          : '${process.env.REACT_APP_API_URL}/api/auth/student/login';

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);

      setLoading(false);

      if (data.user.role === "management") {
        navigate("/management/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (err) {
      setError("Server error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <InteractiveShapes />

      <div className="login-right">
        <div className="login-form-container">
          <h1 className="login-title">Welcome back!</h1>
          <p className="login-subtitle">Please enter your details</p>

          <div className="role-switch">
            <button
              type="button"
              className={`role-btn ${role === "student" ? "active" : ""}`}
              onClick={() => setRole("student")}
            >
              Student
            </button>
            <button
              type="button"
              className={`role-btn ${role === "management" ? "active" : ""}`}
              onClick={() => setRole("management")}
            >
              Management
            </button>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>
                {role === "student" ? "Student Email" : "Management Email"}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember for 30 days</span>
              </label>
              <a href="#forgot" className="forgot-password">
                Forgot password?
              </a>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" disabled={loading} className="login-btn">
              {loading
                ? "Logging in..."
                : `Log in as ${role === "student" ? "Student" : "Management"}`}
            </button>

            <div className="divider">or</div>

            <button type="button" className="google-btn">
              Continue with Google
            </button>
          </form>

          <p className="signup-text">
            {role === "student" ? (
              <>
                Do not have an account? <Link to="/register">Register</Link>
              </>
            ) : (
              "Management access portal"
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;