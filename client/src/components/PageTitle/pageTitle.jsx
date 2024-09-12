import React from "react";
import "./pageTitle.css";

const PageTitle = ({ title }) => {
  return (
    <div className="page-title">
      <h1>{title}</h1>
    </div>
  );
};

export default PageTitle;
