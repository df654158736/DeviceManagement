import React from "react";
import { Menu } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import MenuConfig from "./../../config/menuConfig";
import "./index.less";
import {NavLink} from "react-router-dom"

export default class NavLeft extends React.Component {
  componentWillMount() {
    const menuTreeNode = this.renderMenu(MenuConfig);
    this.setState({
      menuTreeNode
    });
  }

  //菜单渲染
  renderMenu = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <SubMenu title={item.title} key={item.key}>
            {this.renderMenu(item.children)}
          </SubMenu>
        );
      }
      return (
        <Menu.Item title={item.title} key={item.key}>
         <NavLink to={item.key}> {item.title}</NavLink>
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
        <Menu theme="dark">{this.state.menuTreeNode}</Menu>
      </div>
    );
  }
}
