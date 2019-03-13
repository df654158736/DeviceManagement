import React from "react";
import { Menu } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import "./index.less";

import {NavLink} from "react-router-dom"

export default class NavLeft extends React.Component {

  state = {};

  componentDidMount() {
    let userInfo =JSON.parse(localStorage.getItem('user'));
    if(!userInfo){
      window.location.href = "/#/login";
      const menuTreeNode = this.renderMenu([]);
      this.setState({
        menuTreeNode1:menuTreeNode
      });
    }else{
      const menuTreeNode = this.renderMenu(userInfo.moduleList);
      this.setState({
        menuTreeNode1:menuTreeNode
      });
    }
   
  }

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
