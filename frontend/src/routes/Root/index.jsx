import React from "react";
import { Navigate } from "react-router-dom";

export default class NavigateFromRoot extends React.Component {
    render() {
        return (
            <Navigate to="/timetable"/>
        );
    }
};