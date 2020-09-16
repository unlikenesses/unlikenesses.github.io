import React from "react";
import Layout from "../components/layout";
import { Link } from "gatsby";
import { graphql } from "gatsby";

const RelatedPost = ({ type, slug, title, date }) => (
  <Link to={slug} className="w-1/2 bg-white shadow hover:shadow-md text-left p-6 no-underline">
    <p className="text-lg text-gray-700 font-bold flex items-center">{type}:</p>
    <p className="pt-2 capitalize">{title} <small>{date}</small></p>
  </Link>
);

export default ({ data, pageContext }) => {
  const post = data.post;
  return (
    <Layout>
      <article className="w-full flex flex-col my-4">
        <div className="bg-white flex flex-col justify-start py-6">
          <h1 className="text-4xl font-bold text-gray-700 capitalize">{post.fields.title}</h1>
          <span className="text-sm pb-8 text-gray-600">{post.fields.date}</span>
          <div dangerouslySetInnerHTML={{ __html: post.html }} className="text-gray-700 text-lg" />
        </div>
      </article>
      <div className="w-full flex pt-6">
          {pageContext.prev ? (
            <RelatedPost type="Previous" slug={pageContext.prev.fields.slug} title={pageContext.prev.fields.title} date={pageContext.prev.fields.date} />
          ) : null}
          {pageContext.next ? (
            <RelatedPost type="Next" slug={pageContext.next.fields.slug} title={pageContext.next.fields.title} date={pageContext.next.fields.date} />
          ) : null}
      </div>
    </Layout>
  );
};

export const query = graphql`
  query($slug: String!) {
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
