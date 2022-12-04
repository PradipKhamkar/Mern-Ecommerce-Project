import React, { Fragment } from 'react'
import "./NewProduct.css"
import { useSelector, useDispatch } from "react-redux"
import { updateProduct, getProductDetails, clearErrors } from '../../Redux/actions/productAction'
import Sidebar from "./Sidebar"
import { UPDATE_PRODUCT_RESET } from '../../Redux/constants/productConstant'
import { Button } from '@material-ui/core'
import { BsSpellcheck } from "react-icons/bs"
import { HiCurrencyRupee } from "react-icons/hi2"
import { GrOfflineStorage } from "react-icons/gr"
import { TbFileDescription } from "react-icons/tb"
import { MdAccountTree } from "react-icons/md"
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAlert } from 'react-alert'
import MetaData from '../layout/MetaData'



const UpdateProduct = () => {

    const alert = useAlert()
    const { id } = useParams()
    const Navigate = useNavigate();
    const dispatch = useDispatch();
    const { message, loading, error: updateError, isUpdated } = useSelector(state => state.product)
    const { error, product } = useSelector(state => state.productDetails)

    const [oldProductPreviews, setOldProductPreviews] = useState([])
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
        if (product && product._id !== id) {
            dispatch(getProductDetails(id));
        } else {

            SetProductData({
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                Stock: product.Stock,
                images: []
            })
            setOldProductPreviews(product.images)
        }
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        if (isUpdated) {
            alert.success(message)
            Navigate("/admin/products")
            dispatch({ type: UPDATE_PRODUCT_RESET })
        }
        if (updateError) {
            alert.error(updateError)
            dispatch(clearErrors())
        }
    }, [Navigate, isUpdated, dispatch, product, SetProductData, id, updateError, message, error, alert])

    const UpdateProductSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(updateProduct(id, productData));
    };

    const UpdateProductChange = (e) => {
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
                <MetaData title={'UPDATE PRODUCT --ADMIN'} />
                <Sidebar />
                <div className="newProductContainer">
                    <form
                        className="createProductForm"
                        encType="multipart/form-data"
                        onSubmit={(e) => { UpdateProductSubmitHandler(e) }}
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
                                onChange={(e) => UpdateProductChange(e)}
                            />
                        </div>
                        <div>
                            <HiCurrencyRupee />
                            <input
                                type="number"
                                placeholder="Price"
                                required
                                name="price"
                                value={productData.price}
                                onChange={(e) => UpdateProductChange(e)}
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
                                onChange={(e) => UpdateProductChange(e)}
                            ></textarea>
                        </div>

                        <div>
                            <MdAccountTree />
                            <select
                                name='category'
                                onChange={(e) => UpdateProductChange(e)}>

                                <option value={productData.category}>{productData.category}</option>
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
                                value={productData.Stock}
                                onChange={(e) => UpdateProductChange(e)}
                            />
                        </div>

                        <div id="createProductFormFile">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    UpdateProductChange(e)}
                                multiple
                            />
                        </div>

                        <div id="createProductFormImage">
                            {oldProductPreviews && oldProductPreviews.map((image, index) => (
                                <img key={index} src={image.url} alt="Old Product Preview" />
                            ))}
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
                            {loading ? "WAIT UPDATING PRODUCT..!!" : "UPDATE"}
                        </Button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default UpdateProduct