import React from "react";
import { Card, Table, Form, Cascader, Button, Modal,message } from "antd";
import axios from "../../../axios/index";
const FormItem = Form.Item;

export default class Hall extends React.Component {
  state = {};

  params = null;

  componentDidMount() {
    this.request();
  }

  request = () => {
    if (this.params != null) {
      axios
        .ajax({
          method: "post",
          url: "/hall/getHallDetailList",
          data: {
            params: this.params
          }
        })
        .then(res => {
          this.setState({
            dataSource: res.list
          });
        });
    } else {
      this.setState({
        dataSource: ""
      });
    }
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
          options: res
        });
      });
  };

  dataChange = params => {
    if (params.length == 3) {  //eslint-disable-line
      //eslint-disable-line
      this.params = {
        pageNum: "1",
        pageSize: "100",
        provId: params[0],
        cityId: params[1],
        hallId: params[2]
      };
    } else if (params.length == 2) {  //eslint-disable-line
      //eslint-disable-line
      this.params = {
        pageNum: "1",
        pageSize: "100",
        provId: params[0],
        cityId: params[1]
      };
    } else if (params.length == 1) {  //eslint-disable-line
      //eslint-disable-line
      this.params = { pageNum: "1", pageSize: "100", provId: params[0] };
    } else {
      this.params = null;
    }

    console.log(this.params);
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
          message.success("导出成功");
          this.request();
        }
      });
    }
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
      }
    ];

    return (
      <div>
        <Card>
          <Form layout="inline">
            <FormItem label="地域筛选">
              <Cascader
                options={this.state.options}
                fieldNames={{
                  label: "value",
                  value: "id",
                  children: "childList"
                }}
                onChange={this.dataChange}
                changeOnSelect
                placeholder="请选择地域"
                style={{ width: 300 }}
              />
            </FormItem>
          </Form>
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
            bordered="true"
          />
        </Card>
      </div>
    );
  }
}
