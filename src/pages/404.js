import * as React from 'react';
import { Link } from 'gatsby';
import Layout from '../components/layout';
import { SEO } from '../components/seo';

const NotFoundPage = () => {
  return (
    <Layout>
      <p className="text-9xl/loose">
        404
        <br />
        <Link to="/">Go home</Link>.
      </p>
    </Layout>
  );
};

export default NotFoundPage;

export const Head = () => (
  <SEO />
);
