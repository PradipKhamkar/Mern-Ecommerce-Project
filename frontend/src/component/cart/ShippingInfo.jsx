import React, { Fragment } from 'react'
import "./ShippingInfo.css"
import { useDispatch, useSelector } from "react-redux"
import { saveShippingInfo } from '../../Redux/actions/cartAction'
import MetaData from '../layout/MetaData'
import { State, Country } from "country-state-city"
import { useState } from 'react'
import { AiFillHome } from "react-icons/ai"
import { MdLocationCity } from "react-icons/md"
import { RiMapPinUserLine, RiEarthFill } from "react-icons/ri"
import { HiPhone } from "react-icons/hi"
import { TbHeartHandshake } from "react-icons/tb"
import CheckoutSteps from '../cart/CheckoutSteps'
import { useNavigate } from "react-router-dom"
import { useAlert } from 'react-alert'

const ShippingInfo = () => {

    const alert = useAlert()
    const Navigate = useNavigate()
    const dispatch = useDispatch()
    const { shippingInfo } = useSelector(state => state.cart)

    const [address, setAddress] = useState(shippingInfo.address)
    const [city, setCity] = useState(shippingInfo.city)
    const [state, setState] = useState(shippingInfo.state)
    const [country, setCountry] = useState(shippingInfo.country)
    const [pinCode, setPinCode] = useState(shippingInfo.pinCode)
    const [phoneNumber, setPhoneNo] = useState(shippingInfo.phoneNumber)

    const handelShippingInfo = (e) => {
        e.preventDefault();
        if (phoneNumber.length < 10 || phoneNumber.length > 10) {
            alert.info("Phone Number Should Be 10 Digit Long");
            return;
        }
        dispatch(saveShippingInfo({ address, city, state, country, pinCode, phoneNumber }));
        Navigate("/order/confirm")
    }
    return (
        <Fragment>
            <MetaData title={"Shipping Info"} />
            <div className="CheckOutSteps">
                <CheckoutSteps activeStep={0} />
                <div className="shippingContainer">
                    <div className="shippingBox">
                        <h2 className="shippingHeading">Shipping Details</h2>
                        <form className="shippingForm"
                            onSubmit={(e) =>
                                handelShippingInfo(e)}
                        >
                            <div>
                                <AiFillHome />
                                <input
                                    type="text"
                                    placeholder="Address"
                                    required
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>

                            <div>
                                <MdLocationCity />
                                <input
                                    type="text"
                                    placeholder="City"
                                    required
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>

                            <div>
                                <RiMapPinUserLine />
                                <input
                                    type="number"
                                    placeholder="Pin Code"
                                    required
                                    value={pinCode}
                                    onChange={(e) => setPinCode(e.target.value)}
                                />
                            </div>

                            <div>
                                <HiPhone />
                                <input
                                    type="number"
                                    placeholder="Phone Number"
                                    required
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNo(e.target.value)}
                                    size="10"
                                />
                            </div>

                            <div>
                                <RiEarthFill />
                                <select
                                    required
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                >
                                    <option value="">Country</option>
                                    {Country &&
                                        Country.getAllCountries().map((item) => (
                                            <option key={item.isoCode} value={item.isoCode}>
                                                {item.name}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            {country && (
                                <div>

                                    <TbHeartHandshake />
                                    <select
                                        required
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                    >
                                        <option value="">State</option>
                                        {State &&
                                            State.getStatesOfCountry(country).map((item) => (
                                                <option key={item.isoCode} value={item.isoCode}>
                                                    {item.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            )}

                            <input
                                type="submit"
                                value="Continue"
                                className="shippingBtn"
                                disabled={state ? false : true}
                            />
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default ShippingInfo