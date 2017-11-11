const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");
const createPaginatedPages = require("gatsby-paginate");
const moment = require("moment");

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  const { createNodeField } = boundActionCreators;
  if (node.internal.type === "MarkdownRemark") {
    let basePath = "posts";
    if (node.frontmatter.layout === "page") {
      basePath = "pages";
    }
    const slug = createFilePath({ node, getNode, basePath });
    let title = node.frontmatter.title;
    let date = node.frontmatter.date;
    if (title === "" || date === null) {
      let nameArr = slug.replace(/\//g, "").split("-");
      date = nameArr.splice(0, 3).join("-");
      title = nameArr.join(" ").replace(".md", "");
    }
    createNodeField({
      node,
      name: "slug",
      value: slug
    });
    createNodeField({
      node,
      name: "title",
      value: title
    });
    if (node.frontmatter.layout !== "page") {
      createNodeField({
        node,
        name: "date",
        value: moment(date).format("DD MMMM, YYYY")
      });
    }
  }
};

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;
  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark(
          sort: { fields: [fileAbsolutePath], order: DESC }
          filter: { frontmatter: { published: { eq: true } } }
        ) {
          edges {
            node {
              id
              fields {
                slug
                title
                date
              }
              frontmatter {
                layout
              }
              excerpt
            }
          }
        }
      }
    `).then(result => {
      createPaginatedPages({
        edges: result.data.allMarkdownRemark.edges,
        createPage: createPage,
        pageTemplate: "src/templates/index.js",
        pageLength: 3
      });
      result.data.allMarkdownRemark.edges.map(({ node }) => {
        let component = "post.js";
        if (node.frontmatter.layout === "page") {
          component = "page.js";
        }
        createPage({
          path: node.fields.slug,
          component: path.resolve("./src/templates/" + component),
          context: {
            slug: node.fields.slug
          }
        });
      });
      resolve();
    });
  });
};
