import React from "react";
import { Card, Table, Button, Form, Input, Modal, Select, message } from "antd";
import axios from "../../../axios/index";
const FormItem = Form.Item;
const Option = Select.Option;
export default class SparePart extends React.Component {
  state = {};
  componentDidMount() {
    this.request();
  }

  request = () => {
    axios
      .ajax({
        method: "post",
        url: "/sparePart/getSparePartList",
        data: {
          params: {
            pageNum: "1",
            pageSize: "100",
            startTm: "2018-1-1",
            endTm: "2019-12-1",
            auditState: "1"
          }
        }
      })
      .then(res => {
        this.setState({
          dataSource: res.list
        });
      });
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

  handleSubmit = () => {
    let type = this.state.type;
    let parmas = this.sparePartForm.props.form.getFieldsValue();

    if (type == "Update") {  //eslint-disable-line
      parmas.sparePartId = this.state.SpareInfo.sparePartId;
    }

    axios
      .ajax({
        method: "post",
        url:
          type == "Created"  //eslint-disable-line
            ? "/sparePart/addSparePart"
            : "/sparePart/updateSparePart",
        data: {
          params: parmas
        }
      })
      .then(res => {
        if (type == "Created") {  //eslint-disable-line
          message.success("添加成功");
        } else {
          message.success("修改成功");
        }
        this.sparePartForm.props.form.resetFields();

        this.setState({
          isVisible: false
        });
        this.request();
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
      {
        title: "操作",
        render: (text, item) => {
          return (
            <div>
              <Button
                size="small"
                onClick={() => this.handleOperation("Update", item)}
              >
                修改
              </Button>
              <Button
                style={{ marginLeft: 10 }}
                size="small"
                type="danger"
                onClick={() => this.handleOperation("Deleted", item)}
              >
                删除
              </Button>
            </div>
          );
        }
      }
    ];

    return (
      <div>
        <div>
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
        <Modal
          title={this.state.title}
          visible={this.state.isVisible}
          okText="确认"
          cancelText="取消"
          onOk={this.handleSubmit}
          onCancel={() => {
            this.sparePartForm.props.form.resetFields();
            this.setState({
              isVisible: false
            });
          }}
          width={600}
        >
          <SparePartForm
            type={this.state.type}
            SpareInfo={this.state.SpareInfo}
            wrappedComponentRef={inst => {
              this.sparePartForm = inst;
            }}
          />
        </Modal>
      </div>
    );
  }
}
class SparePartForm extends React.Component {
  render() {
    let SpareInfo = this.props.SpareInfo || {};

    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    };
    return (
      <Form layout="horizontal">
        <FormItem label="类别" {...formItemLayout} placeholder="请选择类别">
          {getFieldDecorator("sparePartType", {
            initialValue: SpareInfo.sparePartType
          })(
            <Select>
              <Option value={1}>备件</Option>
              <Option value={2}>耗材</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="商品名称" {...formItemLayout}>
          {getFieldDecorator("sparePartName", {
            initialValue: SpareInfo.sparePartName
          })(<Input type="text" placeholder="请输入商品名称" />)}
        </FormItem>
        <FormItem label="规格型号" {...formItemLayout}>
          {getFieldDecorator("sparePartModel", {
            initialValue: SpareInfo.sparePartModel
          })(<Input type="text" placeholder="请输入规格型号" />)}
        </FormItem>
        <FormItem label="物料编码名" {...formItemLayout}>
          {getFieldDecorator("materialSn", {
            initialValue: SpareInfo.materialSn
          })(<Input type="text" placeholder="请输入物料编码名" />)}
        </FormItem>
      </Form>
    );
  }
}
SparePartForm = Form.create({})(SparePartForm);
