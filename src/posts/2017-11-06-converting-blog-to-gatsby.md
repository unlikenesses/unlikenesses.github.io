---
published: false
layout: post
comments: true
title: Converting this blog to Gatsby
---

Notes on converting this blog from a [Jekyll](https://jekyllrb.com)-generated site (with the [Hyde](https://github.com/poole/hyde) theme) to the React-based [Gatsby.js](https://www.gatsbyjs.org), retaining the same theme.

## Getting started

After installing Gatsby on my machine, the first step is to create a new project using its "hello world" scaffolding:

```
gatsby new blog-gatsby https://github.com/gatsbyjs/gatsby-starter-hello-world
```

The first thing I want to do is check I can display the posts I already have on the Jekyll blog, with its basic look-and-feel, leaving most of the functionality to later. To speed things up, I won't be using Gatsby's built-in [CSS Modules](https://github.com/css-modules/css-modules); instead, I create a `css` folder in `src` and copy my CSS files there. Then I create a `layouts` folder in `src`, and create the basic layout, `index.js`:

```
import React from "react";
import Sidebar from "./sidebar";
import "../css/poole.css";
import "../css/syntax.css";
import "../css/hyde.css";

export default ({ children }) => (
  <div className="theme-base-08">
    <Sidebar />
    <div className="content container">{children()}</div>
  </div>
);
```

This uses the same mark-up as the Hyde theme. My `sidebar` component is, for now, a simplified version of the Hyde sidebar (I don't automatically generate any links there yet). See the repo for the final sidebar. To get the Google fonts loaded I install the [Gatsby Google fonts module](https://www.npmjs.com/package/gatsby-plugin-google-fonts):

`npm install gatsby-plugin-google-fonts --save`

and put the details in the root `gatsby-config.js` file:

```js
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

```
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

```
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

```
export const query = graphql`
  query IndexQuery {
    allMarkdownRemark {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
          }
          html
        }
      }
    }
  }
`;
```

and map over them, outputting the same markup as the original blog:

```
export default ({ data }) => {
  console.log(data);
  return (
    <div className="posts">
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <div className="post" key={node.id}>
          <h1 className="post-title">{node.frontmatter.title}</h1>
          <span className="post-date">{node.frontmatter.date}</span>
          <div dangerouslySetInnerHTML={{ __html: node.html }} />
        </div>
      ))}
    </div>
  );
};
```

There's a problem with this though. The Hyde blog automatically takes the title and date of each post from the post's filename (unless otherwise specified in the front-matter). It'd be nice if we could do the same here.

The first thing to do is to change the`index.js` component to a React class:

```
export default class extends React.Component {
```

which means also changing all instances of `data` to `this.props.data`, and wrapping the `return` statement in a `render()` function. This will allow us to add a couple of extra functions to parse the filename. First, to get this filename, modify the GraphQL statement to return `fileAbsolutePath`. Since this gives us the full path, and we only need the filename, create a small helper function to grab the last part of the path:

```
getFilename(fileAbsolutePath) {
  const parts = fileAbsolutePath.split('/');
  return parts[parts.length - 1];
}
```

We then need another helper function that splits the filename at its hyphens into an array. Remember the format of a filename is `2016-01-01-title-of-post.md`. We can then return the first three elements of the array as the date (joined back to a string), and the rest of the array as the title (removing `.md` as we go):

```
parseFilename(filename) {
  let nameArr = filename.split('-');
  let date = nameArr.splice(0, 3).join('-');
  let title = nameArr.join(' ').replace('.md', '');
  return ({date, title});
}
```

The last thing to do is to modify the `map` function so that it uses these helper functions to create the post's title and date, if they're not already in the front matter:

```
{this.props.data.allMarkdownRemark.edges.map(({ node }) => {
  let title = node.frontmatter.title;
  let date = node.frontmatter.date;
  if (title === '' || date === null) {
    let parsed = this.parseFilename(this.getFilename(node.fileAbsolutePath));
    title = parsed.title;
    date = moment(parsed.date).format("DD MMMM, YYYY");
  }
  return (
    <div className="post" key={node.id}>
      <h1 className="post-title">{title}</h1>
      <span className="post-date">{date}</span>
      <div dangerouslySetInnerHTML={{ __html: node.html }} />
    </div>
  );
})}
```

I'm importing [Moment.js](https://momentjs.com) at the top of the file, and using it here to format the date. It comes with Gatsby's node modules so there's no need to install it separately.

## Ordering Posts

