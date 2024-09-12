import React, { useState } from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginSuccessed, setLoginSuccessed] = useState(false);

  const handleLogin = async () => {
    try {
      const { email, password } = formData;

      setLoginSuccessed(true);
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("accessToken", data.accessToken);
      navigate("/");
    } catch (error) {
      alert(error.message);
      console.error("Login failed:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <div className="card-content">
          <div className="form-container">
            <Title level={2}>Login</Title>
            <Form layout="vertical" onSubmit={handleSubmit}>
              <Form.Item
                label="email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                  },
                ]}>
                <Input
                  type="email"
                  placeholder="email"
                  className="input"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Item>
              <Form.Item
                label="password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}>
                <Input.Password
                  placeholder="password"
                  className="input"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Form.Item>
              {loginError && <div className="login-error">{loginError}</div>}

              <Form.Item>
                {loginSuccessed ? (
                  <Link to={"/"}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      onClick={handleSubmit}>
                      login
                    </Button>
                  </Link>
                ) : (
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    onClick={handleSubmit}>
                    login
                  </Button>
                )}
              </Form.Item>
            </Form>
            <div style={{ marginTop: "16px" }}>
            Don't have an account? <Link to="/register">Register</Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
