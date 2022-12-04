import React from "react";
import "./About.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import MetaData from "../MetaData";


const About = () => {
    const visitInstagram = () => {
        window.location = "https://instagram.com/khamkar_pradip25";
    };
    return (

        <div className="aboutSection">
            <MetaData title={'About Us'} />
            <div className="aboutSectionContainer">
                <div>
                    <div>
                        <Avatar
                            style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
                            src="https://res.cloudinary.com/dmcm71zbt/image/upload/v1670126233/avatar/profile-pic_1_tozinc.png"
                            alt="Founder"
                        />
                        <Typography>Pradip Khamkar</Typography>
                        <Button onClick={visitInstagram} color="primary">
                            Visit Instagram
                        </Button>

                        <span>
                            This is a sample wesbite made by @Pradip Khamkar. Only with the
                            purpose to Learning MERN Stack
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default About;