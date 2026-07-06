import "./login.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../../services/api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const fromSignup = location?.state?.from === "signup";

    if (token && userStr && !fromSignup) {
      try {
        const user = JSON.parse(userStr);
        const role = user?.role;
        if (role === "company") navigate("/company", { replace: true });
        else if (role === "admin") navigate("/admin", { replace: true });
        else navigate("/student", { replace: true });
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, [navigate, location?.state]);

  useEffect(() => {
    const state = location?.state;

    if (state?.email) setEmail(state.email);
    if (state?.from === "signup") {
      setSuccess("Signup successful! Please login to continue.");
    }
  }, [location]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user?.role;
      if (role === "company") navigate("/company", { replace: true });
      else if (role === "admin") navigate("/admin", { replace: true });
      else navigate("/student", { replace: true });
    } catch (error) {
      setErr(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      <div className="loginCard">
        <div className="loginLeft">
          <div className="loginStrip"></div>

          <div className="loginIllustration">
            <img
              src="public/auth-images/login2.jpg"
              alt="login illustration"
            />
          </div>
        </div>

        <div className="loginRight">
          <div className="loginFormBox">
            <h2 className="AuthTitle">Log in</h2>
            <p className="authSub">
              Hello! Sign in to continue to your JobPortal account.
            </p>

            {success ? <div className="authSuccess">{success}</div> : null}

            <form onSubmit={onSubmit} className="authForm" autoComplete="off">
              <div className="authInputWrap">
                <input
                  className="authInput"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>

              <div className="authInputWrap">
                <input
                  className="authInput"
                  type={show ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="authEye"
                  onClick={() => setShow((s) => !s)}
                  aria-label="toggle password"
                >
                  {show ? "🙈" : "👁️"}
                </button>
              </div>

              {err ? <div className="authError">{err}</div> : null}

              <button type="submit" className="authBtn" disabled={loading}>
                {loading ? "Signing In..." : "Sign in"}
              </button>

              <div className="authBottom">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="authLink">
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}