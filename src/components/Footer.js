import React from "react";
const style = {
  left: "0",
  bottom: "0",
  width: "100%",
  height: "2rem",
  color: "white",
  padding: "10px",
  display: "flex",
  position: "fixed",
  alignItems: "center",
  backgroundColor: "#12355B",
  justifyContent: "space-around",
};

const phantom = {
  width: "100%",
  height: "60px",
  padding: "20px",
  display: "block"
};

const Footer = ({ hitCount }) => {
  return (
    <div>
      <div style={phantom} />
      <div style={style}>
        <h6>
          <a href="https://github.com/PrimeTimeTran/Worlds-greatest-todo-app">
            Contribute
          </a>
        </h6>
        <h6>Hit Count: {hitCount || "Loading"}</h6>
      </div>
    </div>
  );
};

export default Footer;

//
