import React from "react";
import Link from "gatsby-link";

const NavLink = props => {
  if (!props.test) {
    return (
      <Link to={props.url} className="pagination-item">
        {props.text}
      </Link>
    );
  } else {
    return <span className="pagination-item">{props.text}</span>;
  }
};

export default ({ data, pathContext }) => {
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
};
