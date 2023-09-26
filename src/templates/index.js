import * as React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../components/layout';
import { SEO } from '../components/seo';

const NavLink = props => {
  if (!props.test) {
    return (
      <Link to={'/'+props.url} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded no-underline">
        {props.text}
      </Link>
    );
  } else {
    return '';
  }
};

const IndexPage = ({ data, pageContext }) => {
  const { numPages, currentPage } = pageContext;
  const last = currentPage === numPages;
  const first = currentPage === 1;
  const previousUrl = currentPage - 1 === 1 ? '' : (currentPage - 1).toString();
  const nextUrl = (currentPage + 1).toString();

  return (
    <Layout>
      {
        data.allMarkdownRemark.edges.map(edge => (
          <article className="w-full flex flex-col shadow my-4" key={edge.node.fields.slug}>
          <div className="bg-white flex flex-col justify-start p-6">
            <Link to={edge.node.fields.slug} className="text-2xl font-bold text-pink-600 hover:underline no-underline capitalize">
              {edge.node.fields.title}
            </Link>
            <span className="text-sm pb-3 text-gray-600">{edge.node.fields.date}</span>
            <div dangerouslySetInnerHTML={{ __html: edge.node.excerpt }} className="pb-5 text-gray-700" />
          </div>
        </article>
        ))
      }
      <div className="w-full justify-between flex pt-6">
        <NavLink test={last} url={nextUrl} text="Older" />
        <NavLink test={first} url={previousUrl} text="Newer" />
      </div>
    </Layout>
  );
};

export const query = graphql`
query postsQuery($skip: Int!, $limit: Int!) {
  allMarkdownRemark(
    sort: {fileAbsolutePath:DESC}
    limit: $limit,
    skip: $skip,
    filter: {
      frontmatter: { published: { eq: true }, layout: { eq: "post" } }
    }
  ) {
    edges {
      node {
        excerpt
        fields {
          slug
          title
          date
        }
      }
    }
  }
}`;

export default IndexPage;

export const Head = () => (
  <SEO />
);