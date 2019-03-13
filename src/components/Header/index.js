import React from "react";
import { Row, Col } from "antd";
import "../Header/index.less";
import Util from "../../utils/utils";

export default class Header extends React.Component {
  componentWillMount() {
    let userInfo =JSON.parse(localStorage.getItem('user'));
    if(!userInfo){
      window.location.href = "/#/login";
      this.setState({
        userName: ""
      });
    }else{
      this.setState({
        userName: userInfo.user.name
      });
  
      setInterval(() => {
        let sysTime = Util.formatDate(new Date().getTime());
        this.setState({
          sysTime
        });
      }, 1000);
    }
   
  }
  render() {
    return (
      <div className="header">
        <Row className="header-top">
          <Col span="24">
            <span>欢迎，{this.state.userName}</span>
            <a href="/#/login">退出</a>
          </Col>
        </Row>
      
      </div>
    );
  }
}
