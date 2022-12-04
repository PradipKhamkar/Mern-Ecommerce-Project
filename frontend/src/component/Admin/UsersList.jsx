import React, { useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { getAllUsers, deleteUser, clearErrors } from '../../Redux/actions/userAction'
import { MdDeleteForever } from "react-icons/md"
import { FiEdit } from "react-icons/fi"
import { Button } from '@material-ui/core'
import Sidebar from "./Sidebar"
import MetaData from '../layout/MetaData'
import { DataGrid } from "@material-ui/data-grid"
import { DELETE_USER_RESET } from '../../Redux/constants/userConstant'
import { useAlert } from 'react-alert'

const UsersList = () => {

  const alert = useAlert()
  const Navigate = useNavigate()
  const dispatch = useDispatch();

  const { error, users } = useSelector((state) => state.allUser)

  const {
    error: deleteError,
    isDeleted,
    message,
  } = useSelector((state) => state.profile);

  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors())

    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors())
    }

    if (isDeleted) {
      alert.success(message);
      Navigate("/admin/users");
      dispatch({ type: DELETE_USER_RESET });
    }

    dispatch(getAllUsers());
  }, [dispatch, isDeleted, deleteError, error, message, alert, Navigate])

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 180, flex: 0.8 },

    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 0.5,
    },

    {
      field: "role",
      headerName: "Role",
      type: "number",
      minWidth: 150,
      flex: 0.3,
      cellClassName: (params) => {
        return params.getValue(params.id, "role") === "admin"
          ? "greenColor"
          : "redColor";
      },
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
            <MetaData title={'USER LISTS --ADMIN'} />
            <Link to={`/admin/user/${params.getValue(params.id, "id")}`}>
              <FiEdit />
            </Link>

            <Button
              onClick={() =>
                deleteUserHandler(params.getValue(params.id, "id"))
              }
            >
              <MdDeleteForever />
            </Button>
          </Fragment>
        );
      },
    },
  ];
  const rows = []
  users &&
    users.forEach((item) => {
      rows.push({
        id: item._id,
        role: item.role,
        email: item.email,
        name: item.name,
      });
    });

  return (
    <Fragment>
      <MetaData title={`ALL USERS - Admin`} />
      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL USERS</h1>
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

export default UsersList