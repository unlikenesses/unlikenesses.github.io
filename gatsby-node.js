const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");
const createPaginatedPages = require("gatsby-paginate");
const moment = require("moment");

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
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
      createNodeField({
        node,
        name: "url",
        value: "http://unlikenesses.com" + slug
      });
    }
  }
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return new Promise((resolve, reject) => {
    graphql(`
      {
        posts: allMarkdownRemark(
          sort: { fields: [fileAbsolutePath], order: DESC }
          filter: {
            frontmatter: { published: { eq: true }, layout: { eq: "post" } }
          }
        ) {
          edges {
            node {
              fields {
                title
                date
                slug
              }
              excerpt
            }
            next {
              fields {
                title
                date
                slug
              }
            }
            previous {
              fields {
                title
                date
                slug
              }
            }
          }
        }
        pages: allMarkdownRemark(
          sort: { fields: [fileAbsolutePath], order: DESC }
          filter: { frontmatter: { published: { eq: true }, layout: { eq: "page" } } }
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
    `).then(result => {
      createPaginatedPages({
        edges: result.data.posts.edges,
        createPage: createPage,
        pageTemplate: "src/templates/index.js",
        pageLength: 3
      });
      result.data.posts.edges.map(({ node, next, previous }) => {
        createPage({
          path: node.fields.slug,
          component: path.resolve("./src/templates/post.js"),
          context: {
            slug: node.fields.slug,
            prev: next,
            next: previous
          }
        });
      });
      result.data.pages.edges.map(({ node }) => {
        createPage({
          path: node.fields.slug,
          component: path.resolve("./src/templates/page.js"),
          context: {
            slug: node.fields.slug
          }
        });
      });
      resolve();
    });
  });
};
