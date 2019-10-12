import React from "react";
import { StaticQuery, graphql } from "gatsby";
import Sidebar from "./sidebar";
import "prismjs/themes/prism-tomorrow.css";
import "../css/poole.css";
import "../css/hyde.css";
import "../css/mailchimp.css";
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
      <div className="theme-base-08">
        <Sidebar
          title={data.site.siteMetadata.title}
          description={data.site.siteMetadata.description}
          pages={data.allMarkdownRemark.edges}
        />
        <div className="content container">{children}</div>
      </div>
    )}
  />
);

