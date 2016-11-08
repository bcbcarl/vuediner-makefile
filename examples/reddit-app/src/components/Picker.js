import React, { PropTypes } from 'react';
import { compose, setPropTypes, onlyUpdateForKeys } from 'recompose';

const enhance = compose(
  setPropTypes({
    options: PropTypes.arrayOf(
      PropTypes.string.isRequired
    ).isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  }),
  onlyUpdateForKeys(['options', 'value', 'onChange'])
);

const Picker = enhance(({ options, value, onChange }) =>
  <span>
    <h1>{value}</h1>
    <select onChange={e => onChange(e.target.value) }
      value={value}>
      {options.map(option =>
        <option value={option} key={option}>
          {option}
        </option>)
      }
    </select>
  </span>
);

export default Picker;
