import React from "react";

import TextInput from "@components/TextInput";

import "./index.css"

export default class Tasks extends React.Component {
    constructor() {
        super();

        this.validateInput = this.validateInput.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);

        this.state = {
            fireflySessionID: "",
            fireflySessionIDError: null
        };
    }

    validateInput(event) {
        let field = event.target.name;
        if (field === "fireflySessionID") {
            if (this.state.fireflySessionID.length === 0) {
                this.setState({ fireflySessionIDError: null});
            }
            else if (this.state.fireflySessionID.length !== 24) {
                this.setState({ fireflySessionIDError: "Firefly Session IDs must be 24 characters"});
            };
        };
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleFormSubmit(event) {
        if (this.state.fireflySessionID !== "") {
            fetch("/api/firefly/session", {
                headers: {
                    "content-type": "application/json"
                },
                method: "PATCH",
                body: JSON.stringify({
                    session: this.state.fireflySessionID
                })
            });
        }
    }

    render() {
        return (
            <div className="settings-page">
                <div className="settings-container">
                    <h1 className="settings-title">Settings</h1>
                    <TextInput onBlur={this.validateInput} error={this.state.fireflySessionIDError} onChange={this.handleInputChange} label="Your Firefly ASP.NET Session ID" name="fireflySessionID" className="sessionID-input"/>
                    <div className="submit-container">
                        <button className="save-options" onClick={this.handleFormSubmit}>Save</button>
                    </div>
                </div>
            </div>
        )
    }
}