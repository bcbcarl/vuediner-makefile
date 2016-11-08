import React, { PropTypes } from 'react';
import { compose, setPropTypes, onlyUpdateForKeys } from 'recompose';

const enhance = compose(
  setPropTypes({
    posts: PropTypes.array.isRequired
  }),
  onlyUpdateForKeys(['posts'])
);

const Posts = enhance(({ posts }) =>
  <ul>
    {posts.map((post, i) =>
      <li key={i}>{post.title}</li>
    ) }
  </ul>
);

export default Posts;
