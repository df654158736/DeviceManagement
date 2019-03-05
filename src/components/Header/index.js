import React from "react";
import { Row, Col } from "antd";
import "../Header/index.less";
import Util from "../../utils/utils";

export default class Header extends React.Component {
  componentWillMount() {
    this.setState({
      userName: "admin"
    });

    setInterval(() => {
      let sysTime = Util.formatDate(new Date().getTime());
      this.setState({
        sysTime
      });
    }, 1000);
  }
  render() {
    return (
      <div className="header">
        <Row className="header-top">
          <Col span="24">
            <span>欢迎，{this.state.userName}</span>
            <a href="www.baidu.com">退出</a>
          </Col>
        </Row>
        <Row className="breadcrumb">
          <Col span="4" className="breadcrumb-title">
            首页
          </Col>
          <Col span="20" className="weather">
            <span className="date">{this.state.sysTime}</span>
            <span className="weather-detail">晴转多云</span>
          </Col>
        </Row>
      </div>
    );
  }
}