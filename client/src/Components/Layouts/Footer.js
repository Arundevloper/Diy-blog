import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer p-4">
      <h1 className="text-center footer-text">
        All Right Reserved &copy; DIY Blogs
      </h1>
      <p className="text-center mt-3 footer-links">
        <Link to="/about" className="footer-link">
          About
        </Link>{" "}
        |
        <Link to="/contact" className="footer-link">
          Contact
        </Link>{" "}
        |
        <Link to="/policy" className="footer-link">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
};

export default Footer;
