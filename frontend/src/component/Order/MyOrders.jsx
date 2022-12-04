import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./MyOrders.css";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import { MyOrder, clearErrors } from "../../Redux/actions/orderAction";
import { MdLaunch } from "react-icons/md"
import { useAlert } from "react-alert"

const MyOrders = () => {

    const alert = useAlert()
    const dispatch = useDispatch();
    const { loading, error, orders } = useSelector((state) => state.myOrders);
    const { user } = useSelector((state) => state.user);
    const { name } = user.user


    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        dispatch(MyOrder())
    }, [error, dispatch, alert])

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
            flex: 0.3,
            sortable: false,
        },
        {
            field: "amount",
            headerName: "Amount",
            type: "number",
            minWidth: 150,
            flex: 0.5,
            sortable: false,
        },

        {
            field: "actions",
            flex: 0.5,
            headerName: "Actions",
            minWidth: 150,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Link to={`/order/${params.getValue(params.id, "id")}`}
                        className="orderAction"
                    >
                        <MdLaunch />
                    </Link>
                );
            },
        },

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
            <MetaData title={`${name}- Orders`} />

            {loading ? <Loader /> :
                <div className="myOrdersPageContainer">
                    <DataGrid
                        columns={columns}
                        rows={rows}
                        pageSize={10}
                        disableSelectionOnClick
                        className="myOrdersTable"
                        autoHeight
                    />
                </div>
            }
        </Fragment>
    )
}

export default MyOrders