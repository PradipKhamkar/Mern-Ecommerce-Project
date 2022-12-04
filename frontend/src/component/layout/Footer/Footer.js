import React from "react";
import "./Footer.css";
import playStore from "../../../images/googlePlay.png"
import { Link } from "react-router-dom";


const Footer = () => {
    const visitInstagram = () => {
        window.location = "https://instagram.com/khamkar_pradip25";
    };
    return (
        <>
            <footer id="footer">
                <div className="leftFooter">
                    <img src={playStore} alt="playstore" />
                </div>

                <div className="midFooter">
                    <h1>ECOMMERCE.</h1>
                    <p>High Quality is our first priority</p>

                    <p>Copyrights 2022 &copy; Pradip Khamkar </p>
                </div>

                <div className="rightFooter">
                    <h4>Know More</h4>
                    <Link to="/about">About Us</Link>
                    <Link to="/contact">Contact Us </Link>
                    <Link onClick={visitInstagram}>Instagram</Link>
                </div>
            </footer>
        </>
    );
};

export default Footer;