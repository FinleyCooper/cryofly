import React from "react";
import { ReactComponent as ConstructionIcon} from "./construction.svg";

import "./index.css";

export default class UnderConstruction extends React.Component {
  render() {
    return (
      <div className="under-construction">
        <h1 className="construction-title">Coming soon</h1>
        <ConstructionIcon className="construction-icon" />
        <p className="construction-message">
          This page is currently being worked on.
          <br />
          Sorry for the inconvenience!
        </p>
      </div>
    );
  }
}