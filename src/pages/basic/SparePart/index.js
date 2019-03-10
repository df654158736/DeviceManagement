import React from "react";
import { Card, Table } from "antd";
import axios from "../../../axios/index";
import "./index.less"
export default class SparePart extends React.Component {
  state = {};

  componentDidMount() {
    this.request();
  }

  request = () => {
    axios
      .ajax({
        method:"post",
        url: "/sparePart/getSparePartList",
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
        title: "商品编号",
        dataIndex: "sparePartId"
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
