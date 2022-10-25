import React from "react";
import { Link } from "react-router-dom";

import { ReactComponent as LogoIcon } from "@assets/logo.svg";
import TextInput from "@components/TextInput";

import "../index.css";

export default class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.validateInput = this.validateInput.bind(this);
        this.confirmConfirmPassword = this.confirmConfirmPassword.bind(this);
        this.setFormError = this.setFormError.bind(this);

        this.state = {
            email: "",
            name: "",
            password: "",
            confirmPassword: "",
            terms: false,
            emailError: null,
            nameError: null,
            passwordError: null,
            confirmPasswordError: null,
            termsError: null,
            emailValid: false,
            nameValid: false,
            passwordValid: false,
            confirmPasswordValid: false,
            summited: false
        };
    }

    setFormError(value, message) {
        this.setState({ [`${value}Valid`]: false });
        this.setState({ [`${value}Error`]: message });
    }


    validateInput(event) {
        let field = event.target.name;

        if (event.target.validity.patternMismatch) {
            if (field === "email") {
                this.setFormError(field, "Please use your valid school email");
            }
            else if (field === "name") {
                this.setFormError(field, "Names must be bewtween 2 and 32 characters and not end or start with a space")
            }
            else if (field === "password") {
                this.setFormError(field, "Passwords must contain between 8 and 32 characters, at least 1 uppercase, 1 lowercase, and 1 number");
            }

        }
        else {
            this.setFormError(field, null);

            if (event.target.value.length > 0) {
                this.setState({ [`${field}Valid`]: true });
            }
        }

        if (event.target.name === "confirmPassword") {
            this.confirmConfirmPassword(event);
        }
    }

    // rename this lmao
    confirmConfirmPassword(event) {
        if (event.target.value === this.state.password) {
            this.setFormError(event.target.name, null);
            this.setState({ [`${event.target.name}Valid`]: true });
        }
        else {
            this.setFormError(event.target.name, "Passwords do not match");
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;

        this.setState({
            [target.name]: value
        });
    }

    handleFormSubmit(event) {
        event.preventDefault();

        let continueToFetching = true;
        const fields = ["email", "password", "confirmPassword", "name"];

        fields.forEach((item) => {
            if (this.state[item].length === 0) {
                this.setFormError(item, "This field must not be left blank");
                continueToFetching = false;
            };
        });

        if (!this.state.terms) {
            this.setFormError("terms", "You must agree to the Terms & Conditions and Privacy Policy to register");
            continueToFetching = false
        }
        else {
            this.setFormError("terms", null);
        }

        if (!continueToFetching) return;

        fetch("/api/register", {
            headers: {
                "content-type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                name: this.state.name
            })
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.error === true) {
                    this.setFormError("email", data.message);
                }
                else {
                    this.setState({ summited: true });
                };
            })
            .catch(() => {
                this.setFormError("terms", "An unexpected error occurred");
            });
    }

    render() {
        if (this.state.summited) {
            return (
                <div className="form-page">
                    <div className="form-container">
                        <LogoIcon className="logo-icon" />
                        <div className="form">
                            <h1 className="form-title">Thank you for signing up</h1>
                            <p className="instruction-text">Please check your email for a confirmation email to verify your account</p>
                        </div>
                    </div>
                </div>
            );
        };
        return (
            <div className="form-page">
                <div className="form-container">
                    <LogoIcon className="logo-icon" />
                    <form className="form">
                        <h1 className="form-title">Sign Up</h1>
                        <p className="instruction-text">Create a CryoFly account to continue</p>
                        <div className="credentials-container">
                            <TextInput onBlur={this.validateInput} onChange={this.handleInputChange} valid={this.state.emailValid} error={this.state.emailError} label="School email address" name="email" className="email-container" pattern="^[A-Za-z0-9]+(.|_)+[A-Za-z0-9]+@+gordanoschool.org.uk$" />
                            <TextInput onBlur={this.validateInput} onChange={this.handleInputChange} valid={this.state.nameValid} error={this.state.nameError} label="Display Name" name="name" className="name-container" pattern="^\S.{1,28}\S$" />
                            <TextInput onBlur={this.validateInput} onChange={this.handleInputChange} valid={this.state.passwordValid} error={this.state.passwordError} label="Create Password" name="password" type="password" className="password-container" pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,32}$" />
                            <TextInput onBlur={this.validateInput} onChange={this.handleInputChange} valid={this.state.confirmPasswordValid} error={this.state.confirmPasswordError} label="Confirm Password" name="confirmPassword" type="password" className="confirm-password-container" />
                            <div className="terms-container">
                                <input id="terms" type="checkbox" name="terms" onChange={this.handleInputChange} />
                                <label className="terms-label" htmlFor="terms">I agree to the <a href={process.env.PUBLIC_URL + "/legal/terms-and-conditions.txt"} className="form-link">Terms & Conditions</a> and <a href={process.env.PUBLIC_URL + "/legal/private-policy.txt"} className="form-link">Privacy Policy</a>.</label>
                                <p className="error-text">{this.state.termsError}</p>
                            </div>
                            <div className="submit-container">
                                <button className="submit" onClick={this.handleFormSubmit}>Sign Up</button>
                            </div>
                        </div>
                        <div className="already-registed">
                            <p>Already Reigstered? <Link className="form-link" to="/login">Login Here</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}