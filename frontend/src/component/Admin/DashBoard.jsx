import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import "./DashBoard.css"
import Sidebar from "./Sidebar"
import { Doughnut, Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux"
import { getAllProductsAdmin } from '../../Redux/actions/productAction'
import MetaData from '../layout/MetaData'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { getAllOrders } from '../../Redux/actions/orderAction';
import Loader from '../layout/Loader/Loader';
import { getAllUsers } from '../../Redux/actions/userAction';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashBoard = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.allProducts);
  const { orders } = useSelector((state) => state.allOrders);
  const { users } = useSelector((state) => state.allUser)

  let totalAmount = 0;
  orders && orders.forEach((item) =>
    totalAmount += item.totalPrice
  )

  let outOfStock = 0;

  products && products.forEach((item) => {
    if (item.Stock <= 0) {
      outOfStock += 1;
    }
  })

  useEffect(() => {
    dispatch(getAllProductsAdmin());
    dispatch(getAllOrders())
    dispatch(getAllUsers())

  }, [dispatch])

  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["tomato"],
        hoverBackgroundColor: ["rgb(197, 72, 49)"],
        data: [0, totalAmount],
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "InStock"],
    datasets: [
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [outOfStock, products.length - outOfStock],
      },
    ],
  };

  return (
    <div className="dashboard">
      <MetaData title={'ADMIN DASHBOARD'} />
      <Sidebar />
      <div className="dashboardContainer">
        <h1>Dashboard</h1>
        {loading ? <Loader /> :
          <Fragment>
            <div className="dashboardSummary">
              <div>
                <p>
                  Total Amount <br />  ₹ {totalAmount}
                </p>
              </div>
              <div className='dashboardSummaryBox2'>
                <Link to="/admin/products">
                  <p>Product </p>
                  <p>{products && products.length}</p>
                </Link>

                <Link to="/admin/orders">
                  <p>Orders </p>
                  <p>{orders && orders.length}</p>
                </Link>

                <Link to="/admin/users">
                  <p>Users </p>
                  <p>{users && users.length}</p>
                </Link>
              </div>
            </div>

            <div className="lineChart">
              <Line data={lineState} />
            </div> <br />
            <div className="doughnutChart">
              <Doughnut data={doughnutState} />
            </div>
          </Fragment>
        }
      </div>
    </div>
  )
}

export default DashBoard