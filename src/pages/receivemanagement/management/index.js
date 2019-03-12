import React from "react";
import { Card, Table, Modal, message, Button } from "antd";
import axios from "../../../axios/index";
import BaseForm from "./../../../components/BaseForm/index";

export default class ReciveManagement extends React.Component {
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
    type:1,
  };


  componentDidMount() {
    this.request();
  }

  request = () => {
    axios
      .ajax({
        method: "post",
        url: "/receive/materialList",
        data: {
          params: this.params
        }
      })
      .then(res => {
        this.setState({
          dataSource: res.list
        });
      });

      if(this.state.formList[0].options.length==0){//eslint-disable-line
        axios
        .ajax({
          method: "post",
          url: "/hall/getHallList",
          data: {
            params: { provId: "", cityId: "", hallId: "" }
          }
        })
        .then(res => {
          this.setState({
            formList:[
              {
                type: "Cascader",
                label: "地域筛选",
                field: "region",
                placeholder: "请选择地域",
                options:res
                },
              {
                type: "DATEPICKER",
                placeholder: "请选择时间"
              }
            ]
          });
        });
      }
  };

  handleFilter = params => {
    this.params = {type:1,pageNum: "1",pageSize: "100",startTm: params.begin_time,endTm: params.end_time};
    if(params.region !== undefined){
      if (params.region.length == 3) {  //eslint-disable-line
        this.params = {type:1,pageNum: "1",pageSize: "100",startTm: params.begin_time,endTm: params.end_time, provId: params.region[0],cityId: params.region[1],hallId: params.region[2]};
      } else if (params.region.length == 2) {  //eslint-disable-line
        this.params = {type:1,pageNum: "1",pageSize: "100",startTm: params.begin_time,endTm: params.end_time, provId: params.region[0],cityId: params.region[1]};
      } else if (params.region.length == 1) {  //eslint-disable-line
        this.params = {type:1,pageNum: "1",pageSize: "100",startTm: params.begin_time,endTm: params.end_time,provId: params.region[0] };
      } 
    }
  
    this.request();
  };

  handleOperation = (type, item) => {
    if (type == "Created") {  //eslint-disable-line
      this.setState({
        type: type,
        isVisible: true,
        title: "新增商品",
        SpareInfo: null
      });
    } else if (type == "Update") {  //eslint-disable-line
      this.setState({
        type: type,
        isVisible: true,
        title: "修改商品",
        SpareInfo: item
      });
    } else if (type == "Deleted") {  //eslint-disable-line
      Modal.confirm({
        title: "确认",
        content: "您确认要删除此条数据吗？" + item.materialSn,
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          message.success("删除成功");
          this.request();
        }
      });
    } else if (type == "Export") {  //eslint-disable-line
      Modal.confirm({
        title: "确认",
        content: "您确认要导出excel吗",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          axios
            .ajax({
              method: "post",
              url: "/checkin/CheckInCountExcelDownloads",
              data: {
                params: this.params
              }
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
        title: " 物料确认单编号",
        dataIndex: "storageId"
      },
      {
        title: "销售厅",
        dataIndex: "hallName"
      },
      {
        title: "到货方式（送货，快递名称单号）",
        dataIndex: "deliveryType"
      },
      {
        title: "到货日期",
        dataIndex: "deliveryDate"
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
            onClick={() => this.handleOperation("Created", null)}
          >
            新增
          </Button>
          <Button
            type="primary"
            onClick={() => this.handleOperation("Export", null)}
            style={{ marginLeft: 20 }}
          >
            导出
          </Button>
          <Table
            style={{ marginTop: 20 }}
            columns={columns}
            dataSource={this.state.dataSource}
            bordered="true"
          />
        </Card>
      </div>
    );
  }
}
