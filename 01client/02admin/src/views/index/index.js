import React from "react";
import { Redirect } from "react-router-dom";
export default class Index extends React.Component {
  render() {
    return localStorage.getItem("user") === null ? (
      // <Redirect to="/home/courses/add" />
      // <Redirect to="/login" />
      <Redirect to="/student/index" />
    ) : (

      // <Redirect to="/login" />

        // <Redirect to="/home/courses/add" />
        <Redirect to="/student/index" />
    ) 
  }
}
