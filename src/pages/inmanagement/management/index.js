import React from "react";
import { Card, Table, Button, Modal, message,Form,Input,DatePicker } from "antd";
import axios from "../../../axios/index";
import BaseForm from "./../../../components/BaseForm/index";

const FormItem = Form.Item;

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
        InData:null,
        itemdata:null
      });
     
    }else if(type=="Update"){  //eslint-disable-line
      axios
      .ajax({
        method: "post",
        url: "/checkin/getCheckInDeviceList",
        data: {
          params: {storageId:item.storageId}
        }
      })
      .then(res => {
        this.setState({
          itemdata: res,
          type:type,
          isVisible: true,
          title: "修改商品",
          InData: item
        });
      });
      // this.setState({
      
      // });
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
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          axios
            .ajaxExcel({
              method: "post",
              url: "/checkin/CheckInExcelDownloads",
              data: {
                params: this.params
              },
              fileName:"入库单.xls"
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
     let parmas=  this.inManagementForm.props.form.getFieldsValue();

     if(type=="Update"){  //eslint-disable-line
      parmas.storageId = this.state.InData.storageId;
     }
  
     axios
     .ajax({
       method: "post",
       url: type=="Created"?"/checkin/addCheckIn":"/checkin/updateCheckIn",  //eslint-disable-line
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
       this.inManagementForm.props.form.resetFields();
    
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

  expandedRowRender = ()=>{
   
        const columns = [
          { title: '商品编号', dataIndex: 'sparePartSn', key: 'sparePartSn' },
          { title: '类别', dataIndex: 'sparePartType', key: 'sparePartType', 
          //  render(sparePartType){
          //    let config = {
          //      "0":"未审核",
          //      "1":"已审核"
          //    }
          //    return config[sparePartType];
          // }
          },
          { title: '商品名称', dataIndex: 'sparePartName', key: 'sparePartName' },
          { title: '规格型号', dataIndex: 'sparePartModel', key: 'sparePartModel' },
          { title: '物料编码', dataIndex: 'materialSn', key: 'materialSn' },
          { title: '数量', dataIndex: 'num', key: 'num'},
          {
            title: "操作",
            render: (text, item) => {
              return (
                <div>
                  <Button style={{marginLeft:10}} size="small" type="danger" onClick={() => this.handleOperation("Deleted",item)}>
                    删除
                  </Button>
                </div>
              );
            }
          }
        ];
       
        return (
          <Table style={{margin:10}}
            columns={columns}
            dataSource={this.state.itemdata.deviceList}
            bordered
            pagination={{pageSize:5}}
          />
        );
      }

  handleExpanded =(isExpand,record)=>{
       if(isExpand){
        axios
        .ajax({
          method: "post",
          url: "/checkin/getCheckInDeviceList",
          data: {
            params: {storageId:record.storageId}
          }
        })
        .then(res => {
          this.setState({
            itemdata: res
          });
        });
      }
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
        dataIndex: "auditState",
        key: 'auditState', 
        render(auditState){
          let config = {
            "0":"未审核",
            "1":"已审核"
          }
          return config[auditState];
       }},
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
            expandedRowRender={() => this.expandedRowRender()}
            onExpand={(isExpand,record) => {this.handleExpanded(isExpand,record)}}
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
            this.inManagementForm.props.form.resetFields();
            this.setState({
              isVisible: false
            });
          }}
          width={600}
        >
          <InManagementForm
            type={this.state.type}
            InData={this.state.InData}
            IndataItem={this.state.itemdata}
            wrappedComponentRef={inst => {
              this.inManagementForm = inst;
            }}
          />
        </Modal>
      </div>
    );
  }
}
class InManagementForm extends React.Component {
   
  state={
    isVisible:false
  }

  handleOperation = (type,item) => {
    if(type=="Created"){  //eslint-disable-line
      this.setState({
        type:type,
        isVisible: true,
        title: "新增商品",
        InData:null,
        itemdata:null
      });
     
    }else if(type=="Update"){  //eslint-disable-line
      axios
      .ajax({
        method: "post",
        url: "/checkin/getCheckInDeviceList",
        data: {
          params: {storageId:item.storageId}
        }
      })
      .then(res => {
        this.setState({
          itemdata: res,
          type:type,
          isVisible: true,
          title: "修改商品",
          InData: item
        });
      });
      // this.setState({
      
      // });
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
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          axios
            .ajaxExcel({
              method: "post",
              url: "/checkin/CheckInExcelDownloads",
              data: {
                params: this.params
              },
              fileName:"入库单.xls"
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
      { title: '商品编号', dataIndex: 'sparePartSn', key: 'sparePartSn' },
      { title: '类别', dataIndex: 'sparePartType', key: 'sparePartType', 
      //  render(sparePartType){
      //    let config = {
      //      "0":"未审核",
      //      "1":"已审核"
      //    }
      //    return config[sparePartType];
      // }
      },
      { title: '商品名称', dataIndex: 'sparePartName', key: 'sparePartName' },
      { title: '规格型号', dataIndex: 'sparePartModel', key: 'sparePartModel' },
      { title: '物料编码', dataIndex: 'materialSn', key: 'materialSn' },
      { title: '数量', dataIndex: 'num', key: 'num'},
      {
        title: "操作",
        render: (text, item) => {
          return (
            <div>
              <Button style={{marginLeft:10}} size="small" type="danger" onClick={() => this.handleOperation("Deleted",item)}>
                删除
              </Button>
            </div>
          );
        }
      }
    ];

    let InData = this.props.InData || {};
    let IndataItem = this.props.IndataItem || {};

    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    };

    
    return (
      <div>
      <Form layout="horizontal">
        <FormItem label=" 供货商" {...formItemLayout}>
          {getFieldDecorator("supplier", {
            initialValue: InData.supplier
          })(<Input type="text" placeholder="请输入商品名称" />)}
        </FormItem>
        <FormItem label="库管验收意见" {...formItemLayout}>
          {getFieldDecorator("opinion", {
            initialValue: InData.opinion
          })(<Input type="text" placeholder="请输入规格型号" />)}
        </FormItem>
        <FormItem label="备注" {...formItemLayout}>
          {getFieldDecorator("mark", {
            initialValue: InData.mark
          })(<Input type="text" placeholder="请输入物料编码名" />)}
        </FormItem>
        <FormItem label="到货日期" {...formItemLayout} >
              {getFieldDecorator("deliveryDate")(
                <DatePicker
                  showTime={true}
                  placeholder={"请选择日期"}
                  format="YYYY-MM-DD HH:mm:ss"
                />
              )}
        </FormItem>
      </Form>
      <Card  style={{ marginTop: 10 }}>
        <Button type="primary" onClick={() => this.handleOperation("Created",null)}>新增</Button>
        <Table style={{marginTop:10}}
         columns={columns}
         dataSource={IndataItem.deviceList}
         bordered
         pagination={{pageSize:5}}
     />
     </Card>
     <Modal
          title="新增商品"
          visible={this.state.isVisible}
          okText="确认"
          cancelText="取消"
          onOk={this.handleSubmit}
          onCancel={() => {
            this.setState({
              isVisible: false
            });
          }}
          width={600}
        >
     </Modal>
     </div>
    );
  }
}
InManagementForm = Form.create({})(InManagementForm);


class InManagementDesForm extends React.Component {
   
  state={
    isVisible:false
  }

  handleOperation = (type,item) => {
    if(type=="Created"){  //eslint-disable-line
      this.setState({
        type:type,
        isVisible: true,
        title: "新增商品",
        InData:null,
        itemdata:null
      });
     
    }else if(type=="Update"){  //eslint-disable-line
      axios
      .ajax({
        method: "post",
        url: "/checkin/getCheckInDeviceList",
        data: {
          params: {storageId:item.storageId}
        }
      })
      .then(res => {
        this.setState({
          itemdata: res,
          type:type,
          isVisible: true,
          title: "修改商品",
          InData: item
        });
      });
      // this.setState({
      
      // });
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
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          axios
            .ajaxExcel({
              method: "post",
              url: "/checkin/CheckInExcelDownloads",
              data: {
                params: this.params
              },
              fileName:"入库单.xls"
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
      { title: '商品编号', dataIndex: 'sparePartSn', key: 'sparePartSn' },
      { title: '类别', dataIndex: 'sparePartType', key: 'sparePartType', 
      //  render(sparePartType){
      //    let config = {
      //      "0":"未审核",
      //      "1":"已审核"
      //    }
      //    return config[sparePartType];
      // }
      },
      { title: '商品名称', dataIndex: 'sparePartName', key: 'sparePartName' },
      { title: '规格型号', dataIndex: 'sparePartModel', key: 'sparePartModel' },
      { title: '物料编码', dataIndex: 'materialSn', key: 'materialSn' },
      { title: '数量', dataIndex: 'num', key: 'num'},
      {
        title: "操作",
        render: (text, item) => {
          return (
            <div>
              <Button style={{marginLeft:10}} size="small" type="danger" onClick={() => this.handleOperation("Deleted",item)}>
                删除
              </Button>
            </div>
          );
        }
      }
    ];

    let InData = this.props.InData || {};
    let IndataItem = this.props.IndataItem || {};

    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    };

    
    return (
      <div>
      <Form layout="horizontal">
        <FormItem label=" 供货商" {...formItemLayout}>
          {getFieldDecorator("supplier", {
            initialValue: InData.supplier
          })(<Input type="text" placeholder="请输入商品名称" />)}
        </FormItem>
        <FormItem label="库管验收意见" {...formItemLayout}>
          {getFieldDecorator("opinion", {
            initialValue: InData.opinion
          })(<Input type="text" placeholder="请输入规格型号" />)}
        </FormItem>
        <FormItem label="备注" {...formItemLayout}>
          {getFieldDecorator("mark", {
            initialValue: InData.mark
          })(<Input type="text" placeholder="请输入物料编码名" />)}
        </FormItem>
        <FormItem label="到货日期" {...formItemLayout} >
              {getFieldDecorator("deliveryDate",{
                  initialValue: moment(InData.deliveryDate)
                })(
                <DatePicker
                  placeholder={"请选择日期"}
                  format="YYYY-MM-DD"
                />
              )}
        </FormItem>
      </Form>
      <Card  style={{ marginTop: 10 }}>
        <Button type="primary" onClick={() => this.handleOperation("Created",null)}>新增</Button>
        <Table style={{marginTop:10}}
         columns={columns}
         dataSource={IndataItem.deviceList}
         bordered
         pagination={{pageSize:5}}
     />
     </Card>
     <Modal
          title="新增商品"
          visible={this.state.isVisible}
          okText="确认"
          cancelText="取消"
          onOk={this.handleSubmit}
          onCancel={() => {
            this.setState({
              isVisible: false
            });
          }}
          width={600}
        >

        
     </Modal>
     </div>
    );
  }
}