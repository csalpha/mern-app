import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

// React Component
export default function LoadingBox() {
  return (
    /* JSX */
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
    /* JSX */
  );
}
