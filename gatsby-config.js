/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: 'Unlikenesses',
    description: 'A PHP Developer',
    twitterUsername: '@unlikenesses',
    siteUrl: 'https://www.unlikenesses.com',
  },
  plugins: [
    "gatsby-plugin-postcss",
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`Nunito\:400,700`]
      }
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: `posts`,
        path: `${__dirname}/posts`,
      }
    },
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        develop: false,
        tailwind: true,
        ignore: ['prismjs/', 'styles.css']
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              noInlineHighlight: true
            }
          }
        ]
      },
    },
  ]
};