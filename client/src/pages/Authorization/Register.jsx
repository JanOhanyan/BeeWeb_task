import React, { useState } from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";

const { Title } = Typography;

const Register = () => {
  const navigate = useNavigate();

  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registered, setRegistered] = useState(false);

  const handleRegister = async (values) => {
    try {
      
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: 'include'
      });
      
      if (!response.ok) {
        if(response.status === 409) {
          throw new Error("User already exists");
        }
        throw new Error("Network response was not ok");
      }
      setRegistered(true);

      navigate("/login");
    } catch (error) {
      alert(error.message);
      console.error("Registration failed:", error);
    }
  };

  const validateUsername = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please enter your full name"));
    }
    if (value.length < 3) {
      return Promise.reject(new Error("Full name must be at least 3 characters long"));
    }
    return Promise.resolve();
  };

  const validateEmail = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please enter your email"));
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      return Promise.reject(new Error("Invalid email address"));
    }
    return Promise.resolve();
  };

  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please enter your password"));
    }
    if (value.length < 8 || !/[A-Z]/.test(value) || !/\d/.test(value)) {
      return Promise.reject(
        new Error(
          "Password must be at least 8 characters long, contain at least one uppercase letter and one number"
        )
      );
    }
    return Promise.resolve();
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <div className="card-content">
          <div className="form-container">
            <Title level={2}>Registration</Title>
            <Form onFinish={handleRegister} layout="vertical">
              <Form.Item
                label="Full Name"
                name="fullName"
                rules={[{ validator: validateUsername }]}
                required>
                <Input
                  placeholder="Full Name"
                  className="input"
                  value={userName}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ validator: validateEmail }]}
                required>
                <Input
                  type="email"
                  placeholder="Email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ validator: validatePassword }]}
                required>
                <Input.Password
                  placeholder="Password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                {registered ? (
                  <Link to={"/login"}>
                    <div>Registration successful, redirecting to login...</div>
                  </Link>
                ) : (
                  <Button type="primary" htmlType="submit" block>
                    Register
                  </Button>
                )}
              </Form.Item>
            </Form>
            <div style={{ marginTop: "16px" }}>
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Register;
