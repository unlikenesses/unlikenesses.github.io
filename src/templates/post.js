import React from "react";
import ReactDisqusComments from "react-disqus-comments";

export default ({ data }) => {
  const post = data.markdownRemark;
  return (
    <div>
      <div className="post">
        <h1 className="post-title">{post.fields.title}</h1>
        <span className="post-date">{post.fields.date}</span>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
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
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      fields {
        title
        date
      }
    }
  }
`;
