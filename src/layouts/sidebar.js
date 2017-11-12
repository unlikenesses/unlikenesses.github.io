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

      <div id="mc_embed_signup">
        <form
          action="//unlikenesses.us16.list-manage.com/subscribe/post?u=10d0fb49bc331ab8668b0fa14&amp;id=786a57e78d"
          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          className="validate"
          target="_blank"
          noValidate
        >
          <div id="mc_embed_signup_scroll">
            <label htmlFor="mce-EMAIL">Subscribe for updates</label>
            <input
              type="email"
              name="EMAIL"
              className="email"
              id="mce-EMAIL"
              placeholder="email address"
              required
            />
            {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups */}
            <div
              style={{ position: "absolute", left: "-5000px" }}
              aria-hidden="true"
            >
              <input
                type="text"
                name="b_10d0fb49bc331ab8668b0fa14_786a57e78d"
                tabIndex="-1"
              />
            </div>
            <div className="clear">
              <input
                type="submit"
                value="Subscribe"
                name="subscribe"
                id="mc-embedded-subscribe"
                className="button"
              />
            </div>
          </div>
        </form>
      </div>

      <p>&copy; {moment().format("YYYY")}</p>
    </div>
  </div>
);
