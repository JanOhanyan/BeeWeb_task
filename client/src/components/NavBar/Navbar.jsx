import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Avatar, Dropdown, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./navbar.css";
import { useNavigate } from "react-router-dom";

const { SubMenu } = Menu;
const selectedColor = "black";

const items = [
  { label: <Link to="/"> Home </Link>, key: "home" },
  { label: <Link to="/workspace" > Workspace </Link>, key: "workspace" },
];

const NavBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = async () => {
    try {
    const response = await fetch(`http://localhost:3001/auth/logout`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include'
    });

    if(response.statusCode === 400) {
      throw new Error('Invalid');
    }
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken")
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
    if(currentPath === "/workspace") {
      navigate("/");
    }
    }catch(e){
      console.log("Error", e.message);
    }
  };

  let selectedKey =
    items.find((item) => {
      if (item.key === "about") {
        return currentPath.startsWith("/about");
      }
      return (
        item.label.props.to === currentPath ||
        (item.children &&
          item.children.some((child) => child.label.props.to === currentPath))
      );
    })?.key || "home";

  const loggedInMenu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogout}>
        logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="navbar-container">
      <Menu
        mode="horizontal"
        selectedKeys={[selectedKey]}
        style={{ border: "none", flex: 1 }}>
        {items.map((item) => (
          <React.Fragment key={item.key}>
            {item.children ? (
              <SubMenu title={item.label}>
                {item.children.map((child) => (
                  <Menu.Item key={child.key}>
                    <Link to={child.label.props.to}>
                      {child.label.props.children}
                    </Link>
                  </Menu.Item>
                ))}
              </SubMenu>
            ) : (
              <Menu.Item key={item.key}>
                <Link
                  to={item.label.props.to}
                  style={{
                    color: selectedKey === item.key ? selectedColor : "black",
                    textDecoration: "none",
                  }}>
                  {item.label.props.children}
                </Link>
              </Menu.Item>
            )}
          </React.Fragment>
        ))}
      </Menu>
      <div className="avatar-container">
        {isLoggedIn ? (
          <Dropdown overlay={loggedInMenu} placement="bottomRight">
            <Avatar
              style={{
                width: "40px",
                height: "40px",
                cursor: "pointer",
              }}
              icon={<UserOutlined />}
            />
          </Dropdown>
        ) : (
          <Button type="primary">
            <Link to="/login" style={{ color: "white" }}>
              Login
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
