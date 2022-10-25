import React from "react";
import { Link } from "react-router-dom";

import { ReactComponent as LogoIcon } from "@assets/logo.svg";
import Loading from "@components/Loading";

import "../index.css";

export default class Verify extends React.Component {
    constructor() {
        super();

        this.state = {
            verificationState: "loading"
        };
    }

    componentDidMount() {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) {
            this.setState({verificationState: "missingtoken"});
            return;
        }

        fetch("/api/verify", {
            headers: {
                "content-type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ token })
        })
        .then((resp) => resp.json())
        .then((data) => {
            if (!data.error) {
                this.setState({verificationState: "validated"});
                return;
            };
            if (data.message === "Invalid verification code") {
                this.setState({verificationState: "invalid"});
            }
            else if (data.message === "User is already validated") {
                this.setState({verificationState: "validatedpreviously"});
            }
        })
        .catch((e) => {
            this.setState({verificationState: "unexpected"});

        })
    }
    render() {
        switch (this.state.verificationState) {
            case "loading":
                return <Loading />
            case "invalid":
                return <VerifyFormTemplate titleText="Invalid verification link" instructionText="This link has expired or was copied incorrectly"/>
            case "validatedpreviously":
                return <VerifyFormTemplate titleText="Already Validated" instructionText="This email has already been validated"/>
            case "missingtoken":
                return <VerifyFormTemplate titleText="Verification token missing" instructionText="No verification token was given"/>
            case "validated":
                return <VerifyFormTemplate titleText="Email successfully verified" instructionText="You are now able to login"/>
            default:
                return <VerifyFormTemplate titleText="Unexpected Error" instructionText="An unexpected error occurred."/>
        };
    }
}

class VerifyFormTemplate extends React.Component {
    render() {
        return (
            <div className="form-page">
                <div className="form-container">
                    <LogoIcon className="logo-icon" />
                    <div className="form" style={{height: "180px"}}>
                        <h1 className="form-title">{this.props.titleText}</h1>
                        <p className="instruction-text">{this.props.instructionText}</p>
                        <Link className="form-link" to="/login" >Go to login page</Link>
                    </div>
                </div>
            </div>  
        );
    }
}