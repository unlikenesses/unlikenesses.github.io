import React from "react";
import Link from "gatsby-link";
import Sidebar from "./sidebar";
import "prismjs/themes/prism-tomorrow.css";
import "../css/poole.css";
import "../css/hyde.css";
import "../css/mailchimp.css";

export default ({ children, data }) => (
  <div className="theme-base-08">
    <Sidebar
      title={data.site.siteMetadata.title}
      description={data.site.siteMetadata.description}
      pages={data.allMarkdownRemark.edges}
    />
    <div className="content container">{children()}</div>
  </div>
);

export const query = graphql`
  query SidebarQuery {
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
`;
