import React from "react";
import { Card, Table, Form, Cascader, Button, Modal,message,Input } from "antd";
import axios from "../../../axios/index";
const FormItem = Form.Item;

export default class Hall extends React.Component {
  state = {};

  params ={  pageNum: "1",pageSize: "100",provId: "", cityId: "", hallId: "" }

  componentDidMount() {
    let userInfo =JSON.parse(localStorage.getItem('user'));
    if(userInfo){
      // this.params = {  pageNum: "1",pageSize: "100",provId:userInfo.user.provId, cityId:userInfo.user.cityId, hallId: userInfo.user.hallId }
    }
   
    this.request();
  }


  request = () => {
    let localOptions = JSON.parse(localStorage.getItem('options'));
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

    if(!localOptions){
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
          options: res
        });
      });
    }else{
      this.setState({
        options:localOptions
      });
    }
  };

  dataChange = (params,item) => {

    this.params ={  pageNum: "1",pageSize: "100",provId: "", cityId: "", hallId: "" };

    if (params.length == 3) {  //eslint-disable-line
      this.setState({
        provName:item[0].provName,
        cityName:item[1].cityName
      });
   
      this.params = {
        pageNum: "1",
        pageSize: "100",
        provId: params[0],
        cityId: params[1],
        hallId: params[2]
      };
    } else if (params.length == 2) {  //eslint-disable-line
      this.setState({
        provName:item[0].provName,
        cityName:item[1].cityName
      });
      this.params = {
        pageNum: "1",
        pageSize: "100",
        provId: params[0],
        cityId: params[1]
      };
    } else if (params.length == 1) {  //eslint-disable-line
      this.setState({
        provName:item[0].provName,
      });
      this.params = { pageNum: "1", pageSize: "100", provId: params[0] };
    } 

    this.request();
  };

  handleOperation = (type, item) => {

    console.log(item);

    if (type == "Created") {  //eslint-disable-line
     
      if(!this.params.cityId){
        message.success("请先选择城市");
        return
      }

      this.setState({
        type: type,
        isVisible: true,
        title: "新增销售厅",
        HallData:{provName: this.state.provName, cityName:this.state.cityName}
      });
    } else if (type == "Update") {  //eslint-disable-line
      this.setState({
        type: type,
        isVisible: true,
        title: "修改销售厅",
        HallData: item
      });
    } else if (type == "Deleted") {  //eslint-disable-line
      Modal.confirm({
        title: "确认",
        content: "您确认要删除此条数据吗？" + item.hallName,
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          axios
          .ajax({
            method: "post",
            url: "/hall/deleteHall",
            data: {
              params: {hallId:item.hallId}
            },
          })
          .then(res => {
            message.success("删除成功");
            this.request();
          });
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
            .ajaxExcel({
              method: "post",
              url: "/hall/hallDownloads",
              data: {
                params: this.params
              },
              fileName:"销售厅列表单.xls"
            })
            .then(res => {
              message.success("导出成功");
              this.request();
            });
        }
      });
    }
  };


  handleSubmit = () => {
    let type = this.state.type;
    let parmas = this.hallForm.props.form.getFieldsValue();
  
    if(!this.params.cityId){
      message.success("请先选择城市");
      this.setState({
        isVisible: false
      });
      return
    }
    parmas.cityId = this.params.cityId;

    axios
      .ajax({
        method: "post",
        url:
          type == "Created"  //eslint-disable-line
            ? "/hall/insertHall"
            : "/hall/updateHall",
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
        this.hallForm.props.form.resetFields();

        this.setState({
          isVisible: false
        });
        this.request();
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
        <Modal
          title={this.state.title}
          visible={this.state.isVisible}
          okText="确认"
          cancelText="取消"
          onOk={this.handleSubmit}
          onCancel={() => {
            this.hallForm.props.form.resetFields();
            this.setState({
              isVisible: false
            });
          }}
          width={600}
        >
          <HallForm
            type={this.state.type}
            HallData={this.state.HallData}
            wrappedComponentRef={inst => {
              this.hallForm = inst;
            }}
          />
        </Modal>
      </div>
    );
  }
}
class HallForm extends React.Component {
  render() {
    let HallData = this.props.HallData || {};
    let type =true;
    if( this.props.type =="Created"){
      type=false;
    }

    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    };
    return (
      <Form layout="horizontal">
       <FormItem label=" 销售厅编号" {...formItemLayout}>
          {getFieldDecorator("hallId", {
            initialValue: HallData.hallId
          })(<Input type="text" placeholder="请输入销售厅编号" disabled={type}/>)}
        </FormItem>
        <FormItem label=" 销售厅名称" {...formItemLayout}>
          {getFieldDecorator("hallName", {
            initialValue: HallData.hallName
          })(<Input type="text" placeholder="请输入销售厅名称" />)}
        </FormItem>
        <FormItem label="省份" {...formItemLayout}>
          {getFieldDecorator("provName", {
            initialValue: HallData.provName
          })(<Input type="text"   disabled="false"/>)}
        </FormItem>
        <FormItem label="地市" {...formItemLayout}>
          {getFieldDecorator("cityNamemark", {
            initialValue: HallData.cityName
          })(<Input type="text"   disabled="false"/>)}
        </FormItem>
        <FormItem label="地址" {...formItemLayout}>
          {getFieldDecorator("hallAddress", {
            initialValue: HallData.hallAddress
          })(<Input type="text" placeholder="请输入物料编码名" />)}
        </FormItem>
        <FormItem label="电话" {...formItemLayout}>
          {getFieldDecorator("phone", {
            initialValue: HallData.phone
          })(<Input type="text" placeholder="请输入物料编码名" />)}
        </FormItem>
      </Form>
    );
  }
}
HallForm = Form.create({})(HallForm);