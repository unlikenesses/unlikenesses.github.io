import React from "react";
import { Link, StaticQuery, graphql } from "gatsby";
import "prismjs/themes/prism-tomorrow.css";
import "../css/tailwind.css";
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
      <div className="nunito">
        <div className="container w-2/3 mx-auto flex flex-wrap py-6">
          <header className="pl-3 pb-6">
              <Link to="/" className="font-bold text-gray-700 uppercase hover:text-gray-700 text-5xl no-underline">
                Unlikenesses <span className="text-xl">A PHP Developer</span>
              </Link>
              <nav>
                <a
                  className="no-underline mr-3 text-gray-600 hover:text-gray-700"
                  href="https://twitter.com/unlikenesses"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
                <a
                  className="no-underline mr-3 text-gray-600 hover:text-gray-700"
                  href="https://github.com/unlikenesses"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                <a
                  className="no-underline text-gray-600 hover:text-gray-700"
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
        <footer className="container w-2/3 mx-auto flex flex-wrap py-4 px-5 justify-between text-gray-600">
          <p>Unlikenesses</p>
          <p>Built with <a href="https://www.gatsbyjs.org" target="_blank">GatsbyJS</a> and <a href="https://tailwindcss.com" target="_blank">Tailwind CSS</a></p>
        </footer>
      </div>
    )}
  />
);

