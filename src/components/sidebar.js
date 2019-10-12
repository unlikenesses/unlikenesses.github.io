import React from "react";
import Link from "gatsby-link";
import moment from "moment";

export default ({ title, description, pages }) => (
  <div className="sidebar">
    <div className="container sidebar-sticky">
      <div className="sidebar-about">
        <h1>
          <Link to="/">{title}</Link>
        </h1>
        <p className="lead">{description}</p>
      </div>

      <nav className="sidebar-nav">
        <Link className="sidebar-nav-item" to="/">
          Blog
        </Link>

        {pages.map((page, idx) => {
          return (
            <Link
              className="sidebar-nav-item"
              to={page.node.fields.slug}
              key={idx}
            >
              {page.node.fields.title}
            </Link>
          );
        })}

        <a
          className="sidebar-nav-item"
          href="https://twitter.com/unlikenesses"
          target="_blank"
          rel="noopener noreferrer"
        >
          Twitter
        </a>
        <a
          className="sidebar-nav-item"
          href="https://github.com/unlikenesses"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
        <a
          className="sidebar-nav-item"
          href="http://codepen.io/unlikenesses/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Codepen
        </a>
      </nav>
      <div>
        <a 
          className="twitter-follow-button" 
          href="https://twitter.com/unlikenesses" 
          target="_blank" 
          rel="noopener noreferrer">
          Follow @unlikenesses
        </a>
      </div>
      <p>&copy; {moment().format("YYYY")}</p>
    </div>
  </div>
);
