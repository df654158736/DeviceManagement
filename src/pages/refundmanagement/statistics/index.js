import React from "react";
import { Card, Table, Modal, message, Button } from "antd";
import axios from "../../../axios/index";
import BaseForm from "./../../../components/BaseForm/index";

export default class Statistics extends React.Component {
  state = {
    formList:[
      {
        type: "Cascader",
        label: "地域筛选",
        field: "region",
        placeholder: "请选择地域",
        options:[]
        },
      {
        type: "DATEPICKER",
        placeholder: "请选择时间"
      }
    ]
  };
  params = {
    pageNum: "1",
    pageSize: "10",
    startTm: "2018-1-1",
    endTm: "2019-12-1",
    type:2
  };


  componentDidMount() {
    let userInfo = JSON.parse(localStorage.getItem('user'));
    this.params.provId=userInfo.user.provId;
    this.params.cityId=userInfo.user.cityId;
    this.params.hallId=userInfo.user.hallId;
    this.request();
  }

  request = () => {
    axios
      .ajax({
        method: "post",
        url: "/receive/materialCountList",
        data: {
          params: this.params
        }
      })
      .then(res => {
        this.setState({
          dataSource: res.list
        });
      });

      
      let localOptions = JSON.parse(localStorage.getItem("options"));

      if (!localOptions) {
        axios
          .ajax({
            method: "post",
            url: "/hall/getHallList",
            data: {
              params: this.params
            }
          })
          .then(res => {
            localStorage.setItem("options", JSON.stringify(res));
            this.setState({
              formList: [
                {
                  type: "Cascader",
                  label: "地域筛选",
                  field: "region",
                  placeholder: "请选择地域",
                  options: res
                },
                {
                  type: "DATEPICKER",
                  placeholder: "请选择时间"
                }
              ]
            });
          });
      } else {
        this.setState({
          formList: [
            {
              type: "Cascader",
              label: "地域筛选",
              field: "region",
              placeholder: "请选择地域",
              options: localOptions
            },
            {
              type: "DATEPICKER",
              placeholder: "请选择时间"
            }
          ]
        });
      }
  };

  handleFilter = params => {
    this.params = {type:2,pageNum: "1",pageSize: "100",startTm: params.begin_time,endTm: params.end_time};
    if(params.region !== undefined){
      if (params.region.length == 3) {  //eslint-disable-line
        this.params = {type:2,pageNum: "1",pageSize: "100",startTm: params.begin_time,endTm: params.end_time, provId: params.region[0],cityId: params.region[1],hallId: params.region[2]};
      } else if (params.region.length == 2) {  //eslint-disable-line
        this.params = {type:2,pageNum: "1",pageSize: "100",startTm: params.begin_time,endTm: params.end_time, provId: params.region[0],cityId: params.region[1]};
      } else if (params.region.length == 1) {  //eslint-disable-line
        this.params = {type:2,pageNum: "1",pageSize: "100",startTm: params.begin_time,endTm: params.end_time,provId: params.region[0] };
      } 
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
              url: "/receive/receiveCountDownloads ",
              data: {
                params: this.params
              },
              fileName:"退货统计单.xls"
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
          <BaseForm formList={this.state.formList} filterSubmit={this.handleFilter} />
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
