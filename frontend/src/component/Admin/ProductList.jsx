import React, { Fragment, useEffect } from 'react'
import { DataGrid } from "@material-ui/data-grid"
import "./ProductList.css"
import { useDispatch, useSelector } from "react-redux"
import { getAllProductsAdmin, deleteProduct } from '../../Redux/actions/productAction'
import { Link, useNavigate } from "react-router-dom"
import { Button } from '@material-ui/core'
import MetaData from '../layout/MetaData'
import Sidebar from "./Sidebar"
import { MdDeleteForever } from "react-icons/md"
import { FiEdit } from "react-icons/fi"
import { DELETE_PRODUCT_RESET } from '../../Redux/constants/productConstant'



const ProductList = () => {
    const Navigate = useNavigate()
    const dispatch = useDispatch();
    const { error, products } = useSelector((state) => state.allProducts);
    const { error: deleteError, isDeleted } = useSelector((state) => state.product)

    const DeleteProductHandler = (id) => {
        dispatch(deleteProduct(id))
    }

    useEffect(() => {
        if (error) {
            alert(error);
        }
        if (deleteError) {
            alert(deleteError)
        }
        if (isDeleted) {
            alert("Product Delete SuccessFully...!!")
            Navigate("/admin/products")
            dispatch({
                type: DELETE_PRODUCT_RESET
            })
        }
        dispatch(getAllProductsAdmin());
    }, [error, dispatch, deleteError, isDeleted, Navigate])


    const columns = [
        { field: "id", headerName: "Product ID", minWidth: 200, flex: 0.5 },

        {
            field: "name",
            headerName: "Name",
            minWidth: 350,
            flex: 1,
        },
        {
            field: "stock",
            headerName: "Stock",
            type: "number",
            minWidth: 100,
            flex: 0.3,
        },

        {
            field: "price",
            headerName: "Price",
            type: "number",
            minWidth: 270,
            flex: 0.5,
        },
        {
            field: "actions",
            flex: 0.3,
            headerName: "Actions",
            minWidth: 150,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Fragment>
                        <MetaData title={'PRODUCTS LISTS --ADMIN'} />
                        <Link to={`/admin/product/${params.getValue(params.id, "id")}`}>
                            <FiEdit />
                        </Link>
                        <Button onClick={() => { DeleteProductHandler(params.getValue(params.id, "id")) }}>
                            <MdDeleteForever />
                        </Button>
                    </Fragment>
                );
            },
        }
    ]
    const rows = [

    ]
    products &&
        products.forEach((item) => {
            rows.push({
                id: item._id,
                stock: item.Stock,
                price: item.price,
                name: item.name,
            });
        });

    return (
        <Fragment>
            <MetaData title={`ALL PRODUCTS - Admin`} />
            <div className="dashboard">
                <Sidebar />
                <div className="productListContainer">
                    <h1 id="productListHeading">ALL PRODUCTS</h1>
                    <DataGrid

                        columns={columns}
                        rows={rows}
                        pageSize={10}
                        disableSelectionOnClick
                        className='productListTable'
                        autoHeight
                    />
                </div>
            </div>
        </Fragment>


    )
}

export default ProductList