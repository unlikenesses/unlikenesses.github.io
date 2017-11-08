import React from "react";
import Link from "gatsby-link";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: props.data.site.siteMetadata.pagination,
      allPosts: props.data.allMarkdownRemark.edges,
      posts: null
    };
  }
  componentWillMount() {
    let posts = this.state.allPosts.splice(0, this.state.pagination);
    this.setState({ posts });
  }
  render() {
    // console.log(this.props.data);
    // console.log(this.props);
    return (
      <div className="posts">
        <h4>{this.props.data.allMarkdownRemark.totalCount} Posts</h4>
        {this.state.posts.map(({ node }) => {
          return (
            <div className="post" key={node.id}>
              <Link to={node.fields.slug} className="post-title">
                {node.fields.title}
              </Link>
              <span className="post-date">{node.fields.date}</span>
              <div dangerouslySetInnerHTML={{ __html: node.excerpt }} />
              <Link to={node.fields.slug}>Read More ></Link>
            </div>
          );
        })}
      </div>
    );
  }
}

export const query = graphql`
  query IndexQuery {
    allMarkdownRemark(
      sort: { fields: [fileAbsolutePath], order: DESC }
      filter: { frontmatter: { published: { eq: true } } }
    ) {
      totalCount
      edges {
        node {
          id
          fileAbsolutePath
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
          }
          fields {
            slug
            title
            date
          }
          excerpt
        }
      }
    }
    site {
      siteMetadata {
        pagination
      }
    }
  }
`;
