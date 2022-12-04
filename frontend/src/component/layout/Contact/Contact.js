import React from "react";
import "./Contact.css";
import { Button } from "@material-ui/core";
import MetaData from "../MetaData";


const Contact = () => {
    return (
        <div className="contactContainer">
            <MetaData title={'Contact Us'} />
            <a className="mailBtn" href="mailto:khamkarpradip20@gmail.com">
                <Button>Contact: khamkarpradip20@gmail.com</Button>
            </a>
        </div>
    );
};

export default Contact;