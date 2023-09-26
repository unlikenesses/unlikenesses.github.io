const path = require('path'); 
const { createFilePath } = require('gatsby-source-filesystem');

exports.onCreateNode = ({ node, getNode, actions }) => {
	const { createNodeField } = actions;
	if (node.internal.type === 'MarkdownRemark') {
		const slug = createFilePath({ node, getNode, basePath: 'posts'});
		createNodeField({
			node,
			name: 'slug',
			value: slug,
		});
		let title = node.frontmatter.title;
	    let date = node.frontmatter.date;
	    if (title === '' || date === null) {
			let nameArr = slug.replace(/\//g, '').split('-');
			date = nameArr.splice(0, 3).join('-');
			title = nameArr.join(' ').replace('.md', '');
	    }
	    createNodeField({
			node,
			name: 'title',
			value: title,
	    });
	    if (node.frontmatter.layout !== 'page') {
	      	let formattedDate = new Date(date).toLocaleDateString('en-gb', {
	      		year: 'numeric',
			    month: 'long',
			    day: 'numeric',
			    timeZone: 'utc',
	      	});
			createNodeField({
				node,
				name: 'date',
				value: formattedDate,
			});
			createNodeField({
				node,
				name: 'url',
				value: 'https://unlikenesses.com' + slug,
			});
		}
	}
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const result = await graphql(`
      {
        allMarkdownRemark(
          sort: {fileAbsolutePath: DESC}
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
          }
        }
      }
    `);

  const posts = result.data.allMarkdownRemark.edges;
  posts.forEach((post, index) => {
  	const previous = index === posts.length - 1 ? null : posts[index + 1].node;
    const next = index === 0 ? null : posts[index - 1].node;
    createPage({
      path: post.node.fields.slug,
      component: path.resolve('./src/pages/{markdownRemark.fields__slug}.js'),
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    });
  });



  const perPage = 4;
  const numPages = Math.ceil(posts.length / perPage);
  Array.from({ length: numPages }).forEach((_, i) => {
  	createPage({
  		path: i === 0 ? `/` : `/${i + 1}`,
  		component: path.resolve('./src/templates/index.js'),
  		context: {
  			limit: perPage,
  			skip: i * perPage,
  			numPages,
  			currentPage: i + 1,
  		},
  	});
  });
};
