import React from 'react'
import "./SideBar.css"
import logo from "../../images/PngItem_12001.png"
import { Link } from "react-router-dom"
import { TreeView, TreeItem } from "@material-ui/lab"
import { MdOutlineExpandMore, MdImportExport, MdOutlinePostAdd, MdOutlineFormatListBulleted, MdOutlineEmojiPeople, MdOutlineReviews, MdOutlineDashboardCustomize } from "react-icons/md"
import { GrFormAdd } from "react-icons/gr"
const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/">
        <img src={logo} alt="Logo" />
      </Link>
      <Link to="/admin/dashboard">
        <p>
          <MdOutlineDashboardCustomize />
          Dashboard
        </p>
      </Link>
      <Link>
        <TreeView
          defaultCollapseIcon={<MdOutlineExpandMore />}
          defaultExpandIcon={<MdImportExport />}
        >
          <TreeItem nodeId='1' label="Products">
            <Link to="/admin/products">
              <TreeItem nodeId='2' label="All" icon={<MdOutlinePostAdd />}></TreeItem>
            </Link>

            <Link to="/admin/product">
              <TreeItem nodeId='3' label="Create" icon={<GrFormAdd />}></TreeItem>
            </Link>

          </TreeItem>
        </TreeView>
      </Link>
      <Link to="/admin/orders">
        <p>
          <MdOutlineFormatListBulleted />
          Orders
        </p>
      </Link>

      <Link to="/admin/users">
        <p>
          <MdOutlineEmojiPeople />
          Users
        </p>
      </Link>

      <Link to="/admin/reviews">
        <p>
          <MdOutlineReviews />
          Reviews
        </p>
      </Link>
    </div>
  )
}

export default Sidebar