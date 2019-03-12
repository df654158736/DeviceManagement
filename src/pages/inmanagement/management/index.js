import React from "react";
import { Card, Table, Button, Modal, message } from "antd";
import axios from "../../../axios/index";
import BaseForm from "./../../../components/BaseForm/index";

export default class Management extends React.Component {
  state = {};
  params = {pageNum: "1",pageSize: "10",startTm: "2018-1-1",endTm: "2019-12-1"};

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
        url: "/checkin/getCheckInList",
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

  handleOperation = (type,item) => {
    if(type=="Created"){  //eslint-disable-line
    
      this.setState({
        type:type,
        isVisible: true,
        title: "新增商品",
        SpareInfo:null
      });
     
    }else if(type=="Update"){  //eslint-disable-line
      this.setState({
        type:type,
        isVisible: true,
        title: "修改商品",
        SpareInfo: item
      });
    }else if(type=="Deleted"){  //eslint-disable-line
      Modal.confirm({
        title: "确认",
        content: "您确认要删除此条数据吗？" +item.materialSn,
        okText:"确认",
        cancelText:"取消",
        onOk: () => {
          message.success("删除成功");
          this.request();
        }
      });
    }
    else if(type=="Export"){  //eslint-disable-line
      Modal.confirm({
        title: "确认",
        content: "您确认要导出excel吗",
        okText:"确认",
        cancelText:"取消",
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

  handleSubmit = () => {
     let type = this.state.type;
     let parmas=  this.sparePartForm.props.form.getFieldsValue();

     if(type=="Update"){  //eslint-disable-line
      parmas.sparePartId = this.state.SpareInfo.sparePartId;
     }
  
     axios
     .ajax({
       method: "post",
       url: type=="Created"?"/sparePart/addSparePart":"/sparePart/updateSparePart",  //eslint-disable-line
       data: {
         params: parmas
       }
     })
     .then(res => {
       if( type=="Created"){  //eslint-disable-line
        message.success("添加成功");
       }else{
        message.success("修改成功");
       }
       this.sparePartForm.props.form.resetFields();
    
       this.setState({
        isVisible:false
       });
       this.request();
     });
  };

  handleFilter = (params)=>{

    this.params={pageNum:"1",pageSize:"10",startTm:params.begin_time,endTm:params.end_time,auditState:params.state};

    if(params.state==2){  //eslint-disable-line
      this.params.auditState = null;
    }
    this.request();
      }



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
        render: (text, item) => {
          return (
            <div>
              <Button size="small"  onClick={() => this.handleOperation("Update",item)}>
                修改
              </Button>
              <Button style={{marginLeft:10}} size="small" type="danger" onClick={() => this.handleOperation("Deleted",item)}>
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
          <BaseForm formList={this.formList} filterSubmit={this.handleFilter} />
        </Card>
      
        <Card  style={{ marginTop: 10 }}>
        <Button type="primary" onClick={() => this.handleOperation("Created",null)}>新增</Button>
        <Button type="primary" onClick={() => this.handleOperation("Export",null)}  style={{ marginLeft: 20 }}>导出</Button>
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
