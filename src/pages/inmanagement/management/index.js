import React from "react";
import { Card, Table } from "antd";
import axios from "../../../axios/index";
export default class Management extends React.Component {
  state = {};

  componentDidMount() {
    this.request();
  }

  request = () => {
    axios
      .ajax({
        method:"post",
        url: "/checkin/getCheckInList",
        data: {
          params: {"pageNum":"1","pageSize":"2","startTm":"2018-1-1","endTm":"2019-12-1","auditState":"1"}
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
        title: "入库单编号",
        dataIndex: "storageId"
      },
      {
        title: "供货商",
        dataIndex: "supplier"
      },
      {
        title: "到货日期",
        dataIndex: "deliveryDate"
      },
      {
        title: "审核状态",
        dataIndex: "auditState"
      },
      {
        title: "操作",
        dataIndex: "sparePartModel"
      },
      
    ];

    return (
      <div className="home-wrap1">
        <Card title="入库管理" >
          <Table columns={columns} dataSource={this.state.dataSource} bordered="true"/>
        </Card>
      </div>
    );
  }
}
