import React from "react";
import { Link, StaticQuery, graphql } from "gatsby";
import moment from "moment";
import "prismjs/themes/prism-tomorrow.css";
import "../css/styles.css";
import "../css/prism.css";

export default ({ children }) => (
  <StaticQuery
    query={graphql`
      {
        site {
          siteMetadata {
            title
            description
          }
        }
        allMarkdownRemark(
          sort: { fields:  [frontmatter___title]}
          filter: { frontmatter: { layout: { eq: "page" } } }
        ) {
          edges {
            node {
              fields {
                title
                slug
              }
            }
          }
        }
      }
    `}
    render={data => (
      <div className="bg-gray-100 nunito">
        <div className="container mx-auto flex flex-wrap py-6">
          <header className="pl-5 pb-6">
              <Link to="/" className="font-bold text-gray-800 uppercase hover:text-gray-700 text-5xl no-underline">
                Unlikenesses <span className="text-xl">A PHP Developer</span>
              </Link>
              <nav>
                <a
                  className="no-underline mr-3 text-gray-800"
                  href="https://twitter.com/unlikenesses"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
                <a
                  className="no-underline mr-3 text-gray-800"
                  href="https://github.com/unlikenesses"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                <a
                  className="no-underline text-gray-800"
                  href="http://codepen.io/unlikenesses/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CodePen
                </a>
              </nav>
          </header>
          <section className="w-full flex flex-col items-center px-3">
            {children}
          </section>
        </div>
        <footer className="container mx-auto flex flex-wrap py-4 pl-5">
          <p>&copy; {moment().format("YYYY")} Unlikenesses</p>
        </footer>
      </div>
    )}
  />
);

