import React from "react";
import Link from "gatsby-link";
import Sidebar from "./sidebar";
import "prismjs/themes/prism-tomorrow.css";
import "../css/poole.css";
import "../css/syntax.css";
import "../css/hyde.css";

export default ({ children, data }) => (
  <div className="theme-base-08">
    <Sidebar title={data.site.siteMetadata.title} />
    <div className="content container">{children()}</div>
  </div>
);

export const query = graphql`
  query AboutQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
