import React from "react";

export default ({ title }) => (
  <div className="sidebar">
    <div className="container sidebar-sticky">
      <div className="sidebar-about">
        <h1>
          <a href="{{ site.baseurl }}">{title}</a>
        </h1>
        <p className="lead">site</p>
      </div>

      <nav className="sidebar-nav">
        <a
          className="sidebar-nav-item{% if page.url == site.baseurl %} active{% endif %}"
          href="/"
        >
          Blog
        </a>

        <a
          className="sidebar-nav-item"
          href="https://twitter.com/unlikenesses"
          target="_blank"
        >
          Twitter
        </a>
        <a
          className="sidebar-nav-item"
          href="https://github.com/unlikenesses"
          target="_blank"
        >
          Github
        </a>
        <a
          className="sidebar-nav-item"
          href="http://codepen.io/unlikenesses/"
          target="_blank"
        >
          Codepen
        </a>
      </nav>

      <p>&copy; fsd</p>
    </div>
  </div>
);
