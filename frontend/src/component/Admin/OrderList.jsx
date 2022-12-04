import React, { Fragment, useEffect } from 'react'
import { DataGrid } from "@material-ui/data-grid"
import "./ProductList.css"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { Button } from '@material-ui/core'
import Sidebar from "./Sidebar"
import { MdDeleteForever } from "react-icons/md"
import { FiEdit } from "react-icons/fi"
import { deleteOrder, getAllOrders, clearErrors } from '../../Redux/actions/orderAction'
import { DELETE_ORDER_RESET } from '../../Redux/constants/orderConstant'
import { useAlert } from 'react-alert'
import MetaData from '../layout/MetaData'


const OrderList = () => {

    const alert = useAlert()
    const Navigate = useNavigate()
    const dispatch = useDispatch();
    const { error, orders } = useSelector((state) => state.allOrders);
    const { error: deleteError, isDeleted, message } = useSelector((state) => state.order)

    const DeleteOrderHandler = (id) => {
        dispatch(deleteOrder(id))
    }

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (deleteError) {
            alert.error(deleteError)
            dispatch(clearErrors());
        }
        if (isDeleted) {
            alert.success(message)
            Navigate("/admin/orders")
            dispatch({
                type: DELETE_ORDER_RESET
            })
        }
        dispatch(getAllOrders());
    }, [error, dispatch, deleteError, isDeleted, Navigate, alert, message])


    const columns = [
        {
            field: "id",
            headerName: "Order ID",
            minWidth: 150,
            flex: 0.5,
            sortable: false,
        },
        {
            field: "status",
            headerName: "Status",
            minWidth: 150,
            flex: 0.5,
            cellClassName: (params) => {
                return params.getValue(params.id, "status") === "Delivered" ?
                    "greenColor" :
                    "redColor"
            }
        },
        {
            field: "itemsQty",
            headerName: "Item Qty",
            type: "number",
            minWidth: 150,
            flex: 0.5
        },
        {
            field: "amount",
            headerName: "Amount",
            type: "number",
            minWidth: 150,
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
                        <MetaData title={'ORDERS LISTS --ADMIN'} />
                        <Link to={`/admin/order/${params.getValue(params.id, "id")}`}>
                            <FiEdit />
                        </Link>
                        <Button onClick={() => { DeleteOrderHandler(params.getValue(params.id, "id")) }}>
                            <MdDeleteForever />
                        </Button>
                    </Fragment>
                );
            },
        }
    ]
    const rows = []
    orders &&
        orders.forEach((item, index) => {
            rows.push({
                itemsQty: item.orderItem.length,
                id: item._id,
                status: item.orderStatus,
                amount: item.totalPrice,
            });
        });

    return (
        <Fragment>
            <MetaData title={`ALL PRODUCTS - Admin`} />
            <div className="dashboard">
                <Sidebar />
                <div className="productListContainer">
                    <h1 id="productListHeading">ALL ORDERS</h1>
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

export default OrderList