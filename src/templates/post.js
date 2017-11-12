import React from "react";
import Link from "gatsby-link";

export default ({ data, pathContext }) => {
  const post = data.post;
  return (
    <div>
      <div className="post">
        <h1 className="post-title">{post.fields.title}</h1>
        <span className="post-date">{post.fields.date}</span>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
      <div className="related">
        {pathContext.prev ? (
          <h3>
            Previous:{" "}
            <Link to={pathContext.prev.fields.slug}>
              {pathContext.prev.fields.title}
            </Link>
          </h3>
        ) : null}
        {pathContext.next ? (
          <h3>
            Next:{" "}
            <Link to={pathContext.next.fields.slug}>
              {pathContext.next.fields.title}
            </Link>
          </h3>
        ) : null}
      </div>
    </div>
  );
};

export const query = graphql`
  query BlogPostQuery($slug: String!) {
    post: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      fields {
        title
        date
        url
      }
    }
  }
`;
