import React from "react";
import Link from "gatsby-link";
import moment from "moment";

export default ({ title, description, pages }) => (
  <div className="sidebar">
    <div className="container sidebar-sticky">
      <div className="sidebar-about">
        <h1>
          <a href="{{ site.baseurl }}">{title}</a>
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

      <p>&copy; {moment().format("YYYY")}</p>
    </div>
  </div>
);
