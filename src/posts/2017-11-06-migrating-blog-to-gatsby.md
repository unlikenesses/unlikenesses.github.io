---
published: true
layout: post
comments: true
title: Migrating the blog from Jekyll to Gatsby
date: "2018-01-10"
---

Notes on converting this blog from a [Jekyll](https://jekyllrb.com)-generated site (with the [Hyde](https://github.com/poole/hyde) theme) to the React-based [Gatsby.js](https://www.gatsbyjs.org), retaining the same theme. The source code [can be found here](https://github.com/unlikenesses/unlikenesses.github.io/tree/source).

## Getting started

After installing Gatsby on my machine, the first step is to create a new project using its "hello world" scaffolding:

```
gatsby new blog-gatsby https://github.com/gatsbyjs/gatsby-starter-hello-world
```

The first thing I want to do is check I can display the posts I already have on the Jekyll blog, with its basic look-and-feel, leaving most of the functionality to later. To speed things up, I won't be using Gatsby's built-in [CSS Modules](https://github.com/css-modules/css-modules); instead, I create a `css` folder in `src` and copy my CSS files there. Then I create a `layouts` folder in `src`, and create the basic layout, `index.js`:

```javascript
import React from "react";
import Sidebar from "./sidebar";
import "../css/poole.css";
import "../css/hyde.css";

export default ({ children }) => (
  <div className="theme-base-08">
    <Sidebar />
    <div className="content container">{children()}</div>
  </div>
);
```

This uses the same mark-up as the Hyde theme. My `sidebar` component is, for now, a simplified version of the Hyde sidebar (I don't automatically generate any links there yet). See the repo for [the final sidebar](https://github.com/unlikenesses/unlikenesses.github.io/blob/source/src/layouts/sidebar.js). To get the Google fonts loaded I install the [Gatsby Google fonts module](https://www.npmjs.com/package/gatsby-plugin-google-fonts):

`npm install gatsby-plugin-google-fonts --save`

and put the details in the root `gatsby-config.js` file:

```javascript
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`Roboto+Slab\:700`, `Noto+Serif\:400,400i,700,700i`]
      }
    },
  ]
};
```

## Displaying posts

The next step is to copy across the posts. Create a `posts` folder in `src` and copy the posts across from the Hyde `_posts` folder.

We'll need the [gatsby-source-filesystem](https://www.npmjs.com/package/gatsby-source-filesystem) plugin for accessing the files, and the [gatsby-transformer-remark](https://www.npmjs.com/package/gatsby-transformer-remark) plugin for parsing the markdown:

`npm install --save gatsby-source-filesystem`
`npm install --save gatsby-transformer-remark`

Updated config file (with the site title):

```javascript
module.exports = {
  siteMetadata: {
    title: `Unlikenesses`
  },
  plugins: [
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`Roboto+Slab\:700`, `Noto+Serif\:400,400i,700,700i`]
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`
      }
    },
    `gatsby-transformer-remark`
  ]
};
```

Now we can pass the site title to the sidebar (`<Sidebar title={data.site.siteMetadata.title} />`) with this graphQl query:

```javascript
export const query = graphql`
  query AboutQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
```

Now, the `pages/index.js` file just needs to grab the list of posts:

```javascript
export const query = graphql`
  query IndexQuery {
    allMarkdownRemark {
      totalCount
      edges {
        node {
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
          }
          excerpt
        }
      }
    }
  }
`;
```

and map over them, outputting the same markup as the original blog:

```javascript
export default ({ data }) => {
  console.log(data);
  return (
    <div className="posts">
      {data.allMarkdownRemark.edges.map(({ node }, idx) => (
        <div className="post" key={idx}>
          <h1 className="post-title">{node.frontmatter.title}</h1>
          <span className="post-date">{node.frontmatter.date}</span>
          <div dangerouslySetInnerHTML={{ __html: node.excerpt }} />
        </div>
      ))}
    </div>
  );
};
```

There's a problem with this though. The Hyde blog automatically takes the title and date of each post from the post's filename (unless otherwise specified in the front-matter). It'd be nice if we could do the same here. We'll cover that in the next section.

## Linking to a post

At the moment we're only showing excerpts. To create and link to the actual posts we'll follow the official [tutorial](https://www.gatsbyjs.org/tutorial/part-four/#programmatically-creating-pages-from-data). So, create `gatsby-node.js`, and first, to create the slugs, paste in this code (taken more or less directly from the official docs):

```javascript
const { createFilePath } = require("gatsby-source-filesystem");

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  const { createNodeField } = boundActionCreators;
  if (node.internal.type === "MarkdownRemark") {
    const slug = createFilePath({ node, getNode, basePath: "posts" });
    createNodeField({
      node,
      name: "slug",
      value: slug
    });
  }
};
```

This will add a `slug` field to the list of markdown pages. But while we're adding fields, why not add new fields which contain the title and date of a post based on its filename? Under the `slug` declaration, we can add a small bit of JavaScript to parse the slug into date and title:

```javascript
let title = node.frontmatter.title;
let date = node.frontmatter.date;
if (title === "" || date === null) {
  let nameArr = slug.replace(/\//g, "").split("-");
  date = nameArr.splice(0, 3).join("-");
  title = nameArr.join(" ").replace(".md", "");
}
```

If the title or date are empty, we derive them from the slug. Remember the format of a slug is `/2016-01-01-title-of-post.md/`. First we remove the bounding `/` characters, then split it at its hyphens. Using `splice` we grab the first three elements of the resultant array, and join them up again to form the date. The title is the rest of the array, joined with spaces and with the final `.md` removed. Then we can create the new node fields:

```javascript 
createNodeField({
  node,
  name: "title",
  value: title
});
createNodeField({
  node,
  name: "date",
  value: moment(date).format("DD MMMM, YYYY")
});
```

I'm importing [Moment.js](https://momentjs.com) at the top of the file, and using it here to format the date. It comes with Gatsby's node modules so there's no need to install it separately. (NB. You'll need to stop and restart the Gatsby server.)

Now we return to `pages/index.js`. Import `Link` at the top:

```javascript
import Link from "gatsby-link";
```

Now we can replace the `h1` tag with

```javascript
<Link to={node.fields.slug} className="post-title">
  {node.fields.title}
</Link>
```

Notice here we're pulling the `slug` and `title` fields from the node. We can do the same with the date:

```javascript
<span className="post-date">{node.fields.date}</span>
```

To pull in this data we just need to modify the GraphQL query to include the new fields:

```graphql
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
```

Now we need to create the pages these `Link` tags point to. Back in `gatsby-node.js` add the `createPages` function (taken from the official docs):

```javascript
exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;
  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `).then(result => {
      result.data.allMarkdownRemark.edges.map(({ node }) => {
        createPage({
          path: node.fields.slug,
          component: path.resolve("./src/templates/post.js"),
          context: {
            // Data passed to context is available in page queries as GraphQL variables.
            slug: node.fields.slug
          }
        });
      });
      resolve();
    });
  });
};
```

The only change I've made is to modify the location and filename of the individual post component. We can create that now. The React function just renders the HTML:

```javascript
export default ({ data }) => {
  const post = data.markdownRemark;
  return (
    <div className="post">
      <h1 className="post-title">{post.fields.title}</h1>
      <span className="post-date">{post.fields.date}</span>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </div>
  );
};
```

and the GraphQL query pulls in the appropriate data, based on the slug passed to it:

```javascript
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
```

## Ordering Posts

To order the posts by date (which amounts to ordering them by filename), we add a `sort` statement to the GraphQL query:

```graphql
allMarkdownRemark(sort: {fields: [fileAbsolutePath], order: DESC}) {
```

One other detail: the Hyde blog hides (ha ha) all posts which have `published: false` in their front-matter. To replicate this we can add a simple filter to the query:

```graphql
allMarkdownRemark(sort: {fields: [fileAbsolutePath], order: DESC}, filter:{frontmatter: {published: {eq: true}}}) {
```

Let's also add a filter to grab only pages of the type "post" - we'll need this later:

```graphql
allMarkdownRemark(sort: {fields: [fileAbsolutePath], order: DESC}, filter:{frontmatter: {published: {eq: true}, layout: {eq: "post"}}}) {
```

## Pagination

The Hyde blog has "Newer" and "Older" links at the bottom of each page, with the pagination value being set in its `_config.yml` file. Pagination isn't supported out of the box in Gatsby at the time of writing, but there is [this module](https://www.npmjs.com/package/gatsby-paginate), which looks promising. Following the [instructions](https://github.com/pixelstew/gatsby-paginate/), first install the package: `npm install gatsby-paginate --save`. Then require it at the top of `gatsby-node.js`:

```javascript
const createPaginatedPages = require('gatsby-paginate');
```

Then call `createPaginatedPages` before the `createPage` function:

```javascript
createPaginatedPages({
  edges: result.data.allMarkdownRemark.edges,
  createPage: createPage,
  pageTemplate: "src/templates/index.js",
  pageLength: 3
});
```

Next we need to modify the `createPages` GraphQL query to match the one in `pages/index.js`, and finally create `src/templates/index.js`. This will be a combination of the example function from the [docs](https://github.com/pixelstew/gatsby-paginate/) and the markup from `pages/index.js`, with some extra pagination mark-up from the old Hyde blog:

```javascript
const NavLink = props => {
  if (!props.test) {
    return <Link to={props.url} className="pagination-item">{props.text}</Link>;
  } else {
    return <span className="pagination-item">{props.text}</span>;
  }
};

export default ({data, pathContext}) => {
  const { group, index, first, last } = pathContext;
  const previousUrl = index - 1 == 1 ? "" : (index - 1).toString();
  const nextUrl = (index + 1).toString();

  return (
    <div>
      {group.map(({ node }, idx) => (
        <div className="post" key={idx}>
          <Link to={node.fields.slug} className="post-title">
            {node.fields.title}
          </Link>
          <span className="post-date">{node.fields.date}</span>
          <div dangerouslySetInnerHTML={{ __html: node.excerpt }} />
          <Link to={node.fields.slug}>Read More ></Link>
        </div>
      ))}
      <div className="pagination">
        <NavLink test={last} url={nextUrl} text="Older" />
        <NavLink test={first} url={previousUrl} text="Newer" />
      </div>
    </div>
  );
}
```

This should be mostly self-explanatory - take a look at the pagination package docs if you want to find out more. Don't forget to delete `pages/index.js`.

## Syntax highlighting

We're still missing syntax highlighting - luckily there's a plugin for this: `npm install --save gatsby-remark-prismjs`. [Gatsby-remark-prismjs](https://www.npmjs.com/package/gatsby-remark-prismjs) uses [PrismJS](http://prismjs.com) to add syntax highlighting to markdown files. After it's installed we add it as a plugin in the `options` for `gatsby-transformer-remark`, in`gatsby-config.js`:

```javascript
{
  resolve: `gatsby-transformer-remark`,
  options: {
    plugins: [
      {
        resolve: `gatsby-remark-prismjs`,
      }
    ]
  }
```

Then import the CSS in `layouts/index.js`:

```javascript
import "prismjs/themes/prism-tomorrow.css";
```

## Other pages

We're almost there. In my blog there's a couple of static pages which are listed in the sidebar. I'll put those in the `pages` folder of the Gatsby blog, which should currently be empty. Each of these pages should have some front-matter: a "layout" (set to "page"), a "published" setting, and a "title". E.g.:

```
---
title: About
layout: page
published: true
---
```

Now we'll need to modify `gatsby-node.js`. First, since these pages are in a different folder, we have to set that in the `basePath`:

```javascript
let basePath = "posts";
if (node.frontmatter.layout === "page") {
  basePath = "pages";
}
const slug = createFilePath({ node, getNode, basePath });
```

We're just checking to see if the page has a `layout` attribute of "page", and if so, we alter the `basePath` variable and pass it in when creating the slug. We also need to check for the layout when creating the `date` node, since we don't need it in this case:

```javascript
if (node.frontmatter.layout !== "page") {
  createNodeField({
    node,
    name: "date",
    value: moment(date).format("DD MMMM, YYYY")
  });
}
```

Now currently the GraphQL query for `createPages` gets both the posts and the pages. We need to make two queries, one for the posts, one for the pages. we need some extra info when creating the pages. So give the "posts" query a name:

```graphql
posts: allMarkdownRemark(
```

(This means we need to rename the object of the `createPaginatedPages` and `map` methods underneath, from `allMarkdownRemark` to `posts`.) Then under that create a new query called "pages":

```graphql
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
```

This is almost exactly the same as "posts", except that it filters for pages with the "page" `layout` attribute in the front matter. The final step here is to `map` over the results of the query and create the pages, passing a different template, `page.js`:

```javascript
result.data.pages.edges.map(({ node }) => {
  createPage({
    path: node.fields.slug,
    component: path.resolve("./src/templates/page.js")
  });
});
```

Now we have the pages we can link to them in our sidebar. I make the query in `layouts/index.js` and pass the result to the sidebar component:

```graphql
allMarkdownRemark(
  sort: { fields:  [frontmatter___title]}
  filter: { frontmatter: { layout: { eq: "page" } } }
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
```

With the filter I only get the pages with a "page" layout. Then I pass them to the sidebar component:

```javascript
<Sidebar
  title={data.site.siteMetadata.title}
  description={data.site.siteMetadata.description}
  pages={data.allMarkdownRemark.edges}
/>
```

In `Sidebar.js` I just need to map over them and display a link:

```javascript
{pages.map((page, idx) => {
  return (
    <Link
      className="sidebar-nav-item"
      to={page.node.fields.slug}
      key={idx}
    >
      {page.node.fields.title}
    </Link>
  );
})}
```

The final step is to create the page template, `templates/page.js`:

```javascript
export default ({ data }) => {
  const page = data.markdownRemark;
  return (
    <div>
      <h1 className="page-title">{page.fields.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.html}} />
    </div>
  );
};

export const query = graphql`
  query PageQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      fields {
        title
      }
    }
  }
`;
```

It's basically a much simpler version of `post.js`, since we only want the `title` and `html` fields.

## Related Posts

Since what Jekyll calls "Related Posts" is [actually just "Recent Posts"](https://jekyllrb.com/docs/variables/), I decided to ditch it in favour of "previous / next post" links. We can get the previous and next posts in our GraphQL query in `gatsby-node.js`. (Much of this is derived from [Ian Sinnott's](https://github.com/iansinnott) [`gatsby-node.js`](https://github.com/iansinnott/iansinnott.github.io/blob/source/gatsby-node.js)):

```graphql
next{
  fields {
    title
    slug
  }
}
previous {
  fields {
    title
    slug
  }
}
```

and pass them in the context (swapping them around, since "next" gives us an older post):

```javascript
createPage({
  path: node.fields.slug,
  component: path.resolve("./src/templates/post.js"),
  context: {
    slug: node.fields.slug,
    prev: next,
    next: previous
  }
});
```

Now we have the previous and next results we can display the links accordingly in `post.js`:

```javascript
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
```

[Full source code.](https://github.com/unlikenesses/unlikenesses.github.io/tree/source)