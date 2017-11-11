import React from "react";
import Link from "gatsby-link";
import ReactDisqusComments from "react-disqus-comments";

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
          <div>
            <h3>
              Previous:{" "}
              <Link to={pathContext.prev.fields.slug}>
                {pathContext.prev.fields.title}
              </Link>
            </h3>
          </div>
        ) : null}
        {pathContext.next ? (
          <div>
            <h3>
              Next:{" "}
              <Link to={pathContext.next.fields.slug}>
                {pathContext.next.fields.title}
              </Link>
            </h3>
          </div>
        ) : null}
      </div>
      <ReactDisqusComments
        shortname="unlikenesses"
        identifier="react-disqus-thread"
        title="React Disqus thread component"
      />
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
      }
    }
  }
`;
