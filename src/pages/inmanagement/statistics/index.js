import React from "react";
import { Card, Table, Button ,Modal, message } from "antd";
import axios from "../../../axios/index";
import BaseForm from "./../../../components/BaseForm/index";

export default class Statistics extends React.Component {
  state = {};
  params = {
    pageNum: "1",
    pageSize: "10",
    startTm: "2018-1-1",
    endTm: "2019-12-1",
    auditState: "0"
  };

  formList = [
    {
      type: "SELECT",
      label: "审核状态",
      field: "state",
      placeholder: "全部",
      initialValue: "2",
      width: 100,
      list: [
        { id: "2", name: "全部" },
        { id: "0", name: "未审核" },
        { id: "1", name: "已审核" },
      ]
    },
    {
      type: "DATEPICKER",
      placeholder: "请选择时间"
    }
  ];

  componentDidMount() {
    this.request();
  }

  request = () => {
    axios
      .ajax({
        method: "post",
        url: "/checkin/getCheckInCountList",
        data: {
          params: this.params
        }
      })
      .then(res => {
        this.setState({
          dataSource: res.list
        });
      });
  };

  handleFilter = params => {
    this.params = {pageNum: "1",pageSize: "10",startTm: params.begin_time,endTm: params.end_time,auditState: params.state};

    if(params.state==2){  //eslint-disable-line
      this.params.auditState = null;
    }
    this.request();
  };

  handleOperation = (type, item) => {
    if (type == "Export") {  //eslint-disable-line
      Modal.confirm({
        title: "确认",
        content: "您确认要导出excel吗",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          axios
            .ajaxExcel({
              method: "post",
              url: "/checkin/CheckInCountExcelDownloads",
              data: {
                params: this.params
              },
              fileName:"入库统计单.xls"
            })
            .then(res => {
              message.success("导出成功");
              this.request();
            });
        }
      });
    }
  };

  render() {
    const columns = [
      {
        title: "商品编号",
        dataIndex: "sparePartId"
      },
      {
        title: "类别",
        dataIndex: "sparePartType",
        render(sparePartType){
          let config = {
            "1":"备件",
            "2":"耗材"
          }
          return config[sparePartType];
       }
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
      }
    ];

    return (
      <div>
        <Card>
          <BaseForm formList={this.formList} filterSubmit={this.handleFilter} />
        </Card>
        <Card style={{ marginTop: 10 }}>
          <Button
            type="primary"
            onClick={() => this.handleOperation("Export", null)}
          >
            导出
          </Button>
          <Table
            style={{ marginTop: 20 }}
            columns={columns}
            dataSource={this.state.dataSource}
            bordered
          />
        </Card>
      </div>
    );
  }
}
