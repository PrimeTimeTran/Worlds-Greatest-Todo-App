import React from "react";
var style = {
  left: "0",
  bottom: "0",
  width: "100%",
  height: "2rem",
  color: "white",
  padding: "20px",
  position: "fixed",
  textAlign: "center",
  backgroundColor: "#12355B",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

var phantom = {
  width: "100%",
  height: "60px",
  padding: "20px",
  display: "block",
};

const Footer = ({ children }) => {
  return (
    <div>
      <div style={phantom} />
      <div style={style}>
        <h4>
          Built with ️❤️ by{" "}
          <a href="https://github.com/PrimeTimeTran">PrimeTimeTran</a>
        </h4>
      </div>
    </div>
  );
}

export default Footer;
