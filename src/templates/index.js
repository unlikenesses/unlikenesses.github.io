import React from "react";
import Layout from "../components/layout";
import { Link } from "gatsby";

const NavLink = props => {
  if (!props.test) {
    return (
      <Link to={props.url} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded no-underline">
        {props.text}
      </Link>
    );
  } else {
    return '';
  }
};

export default ({ data, pageContext }) => {
  const { group, index, first, last } = pageContext;
  const previousUrl = index - 1 === 1 ? "" : (index - 1).toString();
  const nextUrl = (index + 1).toString();

  return (
    <Layout>
      {group.map(({ node }, idx) => (
        <article className="w-full flex flex-col shadow my-4" key={idx}>
          <div className="bg-white flex flex-col justify-start p-6">
            <Link to={node.fields.slug} className="text-2xl font-bold text-pink-600 hover:underline no-underline capitalize">
              {node.fields.title}
            </Link>
            <span className="text-sm pb-3 text-gray-600">{node.fields.date}</span>
            <div dangerouslySetInnerHTML={{ __html: node.excerpt }} className="pb-5 text-gray-700" />
          </div>
        </article>
      ))}
      <div className="w-full justify-between flex pt-6">
        <NavLink test={last} url={nextUrl} text="Older" />
        <NavLink test={first} url={previousUrl} text="Newer" />
      </div>
    </Layout>
  );
};
