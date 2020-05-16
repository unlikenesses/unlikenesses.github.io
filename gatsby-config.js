module.exports = {
  siteMetadata: {
    title: `Unlikenesses`,
    description: '',
    pagination: 5
  },
  pathPrefix: "/",
  plugins: [
    {
      resolve: `gatsby-plugin-postcss`
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`Nunito\:400,700`]
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`
      }
    },
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        develop: false,
        tailwind: true,
        ignore: ['prismjs/']
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
      }
    }
  ]
};
