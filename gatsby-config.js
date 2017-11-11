module.exports = {
  siteMetadata: {
    title: `Unlikenesses`,
    description: '',
    pagination: 5
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
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-prismjs`,
          }
        ]
      }
    }
  ]
};
