import React from "react";
import moment from "moment";

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
  getFilename(fileAbsolutePath) {
    const parts = fileAbsolutePath.split("/");
    return parts[parts.length - 1];
  }
  parseFilename(filename) {
    let nameArr = filename.split("-");
    let date = nameArr.splice(0, 3).join("-");
    let title = nameArr.join(" ").replace(".md", "");
    return { date, title };
  }
  render() {
    // console.log(this.props.data);
    console.log(this.props);
    return (
      <div className="posts">
        <h4>{this.props.data.allMarkdownRemark.totalCount} Posts</h4>
        {this.state.posts.map(({ node }) => {
          let title = node.frontmatter.title;
          let date = node.frontmatter.date;
          if (title === "" || date === null) {
            let parsed = this.parseFilename(
              this.getFilename(node.fileAbsolutePath)
            );
            title = parsed.title;
            date = moment(parsed.date).format("DD MMMM, YYYY");
          }
          return (
            <div className="post" key={node.id}>
              <h1 className="post-title">{title}</h1>
              <span className="post-date">{date}</span>
              <div dangerouslySetInnerHTML={{ __html: node.excerpt }} />
              <a href="">Read More ></a>
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
