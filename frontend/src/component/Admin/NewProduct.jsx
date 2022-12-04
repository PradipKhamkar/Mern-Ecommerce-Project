import React, { Fragment } from 'react'
import "./NewProduct.css"
import { useSelector, useDispatch } from "react-redux"
import { createProduct, clearErrors } from '../../Redux/actions/productAction'
import Sidebar from "./Sidebar"
import { NEW_PRODUCT_RESET } from '../../Redux/constants/productConstant'
import { Button } from '@material-ui/core'
import { BsSpellcheck } from "react-icons/bs"
import { HiCurrencyRupee } from "react-icons/hi2"
import { GrOfflineStorage } from "react-icons/gr"
import { TbFileDescription } from "react-icons/tb"
import { MdAccountTree } from "react-icons/md"
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAlert } from 'react-alert'
import MetaData from '../layout/MetaData'



const NewProduct = () => {

    const alert = useAlert()
    const Navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error, success } = useSelector(state => state.newProduct)

    const [imagesPreviews, setImagesPreviews] = useState([]);


    //Collect User Product Form Data
    const [productData, SetProductData] = useState({
        name: "",
        price: "",
        description: "",
        category: "",
        Stock: "",
        images: []
    })

    const categories =
        [
            "Laptop",
            "Mobile",
            "Bottom",
            "Top"
        ]
    useEffect(() => {
        if (error) {
            alert.error("Error")
            dispatch(clearErrors());
        }
        if (success) {
            alert.success("Product Created SuccessFully")
            Navigate("/admin/dashboard")
            dispatch({ type: NEW_PRODUCT_RESET })
        }

    }, [error, Navigate, success, dispatch, alert])

    const createProductSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(createProduct(productData));
    };

    const createProductImagesChange = (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);

            setImagesPreviews([]);
            productData.images.splice(0, productData.images.length)

            files.forEach((file) => {
                const reader = new FileReader();
                reader.onload = () => {
                    if (reader.readyState === 2) {
                        setImagesPreviews((old) => [...old, reader.result]);
                        productData.images.push(reader.result)
                    }
                };
                reader.readAsDataURL(file);
            });
        }
        else {
            SetProductData({ ...productData, [e.target.name]: e.target.value })
        }
    };

    return (
        <Fragment>
            <div className="dashboard">
                <MetaData title={'ADD PRODUCT --ADMIN'} />
                <Sidebar />
                <div className="newProductContainer">
                    <form
                        className="createProductForm"
                        encType="multipart/form-data"
                        onSubmit={(e) => { createProductSubmitHandler(e) }}
                    >
                        <h1>Create Product</h1>
                        <div>
                            <BsSpellcheck />
                            <input
                                type="text"
                                placeholder="Product Name"
                                required
                                name="name"
                                value={productData.name}
                                onChange={(e) => createProductImagesChange(e)}
                            />
                        </div>
                        <div>
                            <HiCurrencyRupee />
                            <input
                                type="number"
                                placeholder="Price"
                                required
                                name="price"
                                onChange={(e) => createProductImagesChange(e)}
                            />
                        </div>

                        <div>
                            <TbFileDescription />
                            <textarea
                                placeholder="Product Description"
                                value={productData.description}
                                cols="30"
                                rows="1"
                                name="description"
                                onChange={(e) => createProductImagesChange(e)}
                            ></textarea>
                        </div>

                        <div>
                            <MdAccountTree />
                            <select
                                name='category'
                                onChange={(e) => createProductImagesChange(e)}>
                                <option value="">Choose Category</option>
                                {categories.map((cate) => (
                                    <option key={cate} value={cate}>
                                        {cate}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <GrOfflineStorage />
                            <input
                                type="number"
                                placeholder="Stock"
                                required
                                name='Stock'
                                onChange={(e) => createProductImagesChange(e)}
                            />
                        </div>

                        <div id="createProductFormFile">
                            <input
                                type="file"
                                name="avatar"
                                accept="image/*"
                                onChange={(e) =>
                                    createProductImagesChange(e)}
                                multiple
                            />
                        </div>

                        <div id="createProductFormImage">
                            {imagesPreviews.map((image, index) => (
                                <img key={index} src={image} alt="Product Preview" />
                            ))}
                        </div>

                        <Button
                            id="createProductBtn"
                            type="submit"
                            disabled={loading ? true : false}
                        >
                            {loading ? "WAIT CREATING PRODUCT..!!" : "CREATE"}
                        </Button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default NewProduct