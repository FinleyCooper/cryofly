import React from "react";
import { ReactComponent as LogoIcon } from "@assets/logo.svg";
import { Link } from "react-router-dom";

import "./index.css"

class Header extends React.Component {
    render() {
        if (this.props.active === null) {
            return (null)
        }
        return (
            <header>
                <div className="title-container">
                    <LogoIcon />
                    <h1 className="page-title">CryoFly</h1>
                </div>
                <div className="nav-container">
                    <Link to="/timetable" className={"nav-link-container" + (this.props.active === "/timetable" ? " active" : "")}>
                        <p className="nav-link">
                            Timetable
                        </p>
                    </Link>
                    <Link to="/tasks" className={"nav-link-container" + (this.props.active  === "/tasks" ? " active" : "")}>
                        <p className="nav-link">
                            Tasks
                        </p>
                    </Link>
                    <Link to="/settings" className={"nav-link-container" + (this.props.active  === "/settings" ? " active" : "")}>
                        <p className="nav-link">
                            Settings
                        </p>
                    </Link>
                </div>
                <div className="profile-container">
                    <Link to="/account" className="account-container">
                        <span className="account-name">{this.props.displayName ?? "Error in getting name"}</span>
                    </Link>
                </div>
            </header>
        );
    };
};

export default Header;