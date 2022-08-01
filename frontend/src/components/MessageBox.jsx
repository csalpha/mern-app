import React from 'react';
import Alert from 'react-bootstrap/Alert';

// React Component
export default function MessageBox(props) {
  /* JSX */
  return <Alert variant={props.variant || 'info'}>{props.children}</Alert>;
  /* JSX */
}

