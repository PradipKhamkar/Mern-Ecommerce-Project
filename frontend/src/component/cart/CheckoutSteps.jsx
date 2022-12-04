import React, { Fragment } from 'react'
import "./CheckoutStep.css"
import { Step, StepLabel, Stepper, Typography } from "@material-ui/core"
import { FaShippingFast } from "react-icons/fa"
import { GiConfirmed } from "react-icons/gi"
import { MdPayment } from "react-icons/md"


const CheckoutSteps = ({ activeStep }) => {
    const steps = [
        {
            label: <Typography>Shipping Details</Typography>,
            icon: <FaShippingFast />
        },
        {
            label: <Typography>Confirm Order</Typography>,
            icon: <GiConfirmed />
        },
        {
            label: <Typography>Payment</Typography>,
            icon: <MdPayment />
        }
    ]
    const stepStyle = {
        width: "100%",
        margin: "auto"
    }
    return (
        <Fragment>
            <Stepper alternativeLabel activeStep={activeStep} style={stepStyle}>
                {steps.map((item, index) => (
                    <Step
                        key={index}
                        active={activeStep === index ? true : false}
                        completed={activeStep >= index ? true : false}
                    >
                        <StepLabel
                            icon={item.icon}
                            style={{
                                color: activeStep >= index ? "tomato" : "rgba(0, 0, 0, 0.649)",
                            }}
                        >
                            {item.label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Fragment>
    )
}

export default CheckoutSteps