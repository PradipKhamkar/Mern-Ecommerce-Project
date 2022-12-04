import React from "react";
import "./NotFound.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { TbError404Off } from "react-icons/tb"

const NotFound = () => {
    return (
        <div className="PageNotFound">
            <TbError404Off />
            <Typography>Page Not Found </Typography>
            <Link to="/">Home</Link>
        </div>
    );
};

export default NotFound;