import React from "react";

import "./index.css";

const MIMIMUM_CONTENTLESS_LOADING_TIME = 300; // in milliseconds

export default class Loader extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false,
    };
  }

  componentDidMount() {
    this.timeoutId = setTimeout(() => {
      this.setState({ show: true });
    }, MIMIMUM_CONTENTLESS_LOADING_TIME);
  }

  componentWillUnmount() {
    this.timeoutId && clearTimeout(this.timeoutId);
  }

  render() {
    return (
      <div className={"loading-page" + (this.state.show ? " show" : "")}>
        <p className="loading-text">Loading...</p>
      </div>
    );
  }
}