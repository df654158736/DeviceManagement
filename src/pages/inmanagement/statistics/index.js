import React from "react";
import "./index.less";
import { Card, Table } from "antd";
import axios from "../../../axios/index";
export default class Statistics extends React.Component {
  state = {};

  componentDidMount() {
    this.request();
  }

  request = () => {
    axios
      .ajax({
        method:"post",
        url: "/checkin/getCheckInCountList",
        data: {
          params: {
            pageNum: "1",
            pageSize: "2",
            startTm: "2018-1-1",
            endTm: "2019-12-1",
            auditState: "0"
          }
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
        title: "商品编号",
        dataIndex: "sparePartSn"
      },
      {
        title: "类别",
        dataIndex: "sparePartType"
      },
      {
        title: "商品名称",
        dataIndex: "sparePartName"
      },
      {
        title: "规格型号",
        dataIndex: "sparePartModel"
      },
      {
        title: "物料编码",
        dataIndex: "materialSn"
      },
      {
        title: "数量",
        dataIndex: "num"
      },
      
    ];

    return (
      <div className="home-wrap1">
        <Card title="入库统计" >
          <Table columns={columns} dataSource={this.state.dataSource} bordered/>
        </Card>
      </div>
    );
  }
}
