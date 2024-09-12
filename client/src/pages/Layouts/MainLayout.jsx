import React from "react";
import { Layout } from "antd";
import NavBar from "../../components/NavBar/Navbar";

const { Header, Content } = Layout;

const headerStyle = {
  textAlign: "center",
  color: "#fff",
  height: 80,
  paddingInline: 48,
  lineHeight: "64px",
  backgroundColor: "white",
  paddingLeft: "1000px",
};

const contentStyle = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#FFF",
};


const layoutStyle = {
  borderRadius: 8,
  overflow: "hidden",
  height: "100%",
};

const MainLayout = ({ children }) => (
  <Layout style={layoutStyle}>
    <Header style={headerStyle}>
      <NavBar />
    </Header>
    <Content style={contentStyle}>{children}</Content>
  </Layout>
);

export default MainLayout;
