import React from "react";
import { Card, Table } from "antd";
import axios from "../../../axios/index";
export default class Hall extends React.Component {
  state = {};

  componentDidMount() {
    this.request();
  }

  request = () => {
    axios
      .ajax({
        method:"post",
        url: "/hall/getHallDetailList",
        data:{
          params: {"pageNum":"1","pageSize":"100","startTm":"2018-1-1","endTm":"2019-12-1","auditState":"1"}
        }
      })
      .then(res => {
          this.setState({
            dataSource: res.list
          });
      });
  };

  render() {
    const columns = [
      {
        title: "销售厅编号",
        dataIndex: "hallId"
      },
      {
        title: "销售厅名称",
        dataIndex: "hallName"
      },
      {
        title: "省份",
        dataIndex: "provName"
      },
      {
        title: "地市",
        dataIndex: "cityName"
      },
      {
        title: "地址",
        dataIndex: "hallAddress"
      },
      {
        title: "电话",
        dataIndex: "phone"
      },
      
    ];

    return (
      <div className="home-wrap">
        <Card title="商品信息" >
          <Table columns={columns} dataSource={this.state.dataSource} bordered="true"/>
        </Card>
      </div>
    );
  }
}
