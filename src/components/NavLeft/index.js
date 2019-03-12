import React from "react";
import { Menu } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import "./index.less";
import axios from "../../axios/index";
import {NavLink} from "react-router-dom"

export default class NavLeft extends React.Component {

  state = {};

  componentDidMount() {
    this.request();
  }

  request = () => {
    axios
      .ajax({
        method:"post",
        url: "/user/login",
        data: {
          params: {
            "name":"aaa",
            "password":"test"
          },
          isShowLoading:false
        }
      })
      .then(res => {
        const menuTreeNode = this.renderMenu(res.moduleList);
        this.setState({
          menuTreeNode1:menuTreeNode
        });
      });
  };

  //菜单渲染
  renderMenu = data => {
    return data.map(item => {
      if (item.PageList) {
        return (
          <SubMenu title={item.menuName} key={item.menuUrl}>
            {this.renderMenu(item.PageList)}
          </SubMenu>
        );
      }
      return (
        <Menu.Item title={item.menuName} key={item.menuUrl}>
         <NavLink to={item.menuUrl}> {item.menuName}</NavLink>
        </Menu.Item>
      );
    });
  };

  render() {
    return (
      <div>
        <div className="logo">
          <img src="logo.jpg" alt="" />
          <h1>中福在线备件管理系统</h1>
        </div>
        <Menu theme="dark"  mode="inline" defaultOpenKeys={['/basic','/checkin','/checkout','/receive','/refund']}>{this.state.menuTreeNode1}</Menu>
      </div>
    );
  }
}
