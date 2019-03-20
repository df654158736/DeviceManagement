import React from "react";
import { Card, Table, Button, Modal, message,Form,Input,DatePicker,Select } from "antd";
import axios from "../../../axios/index";
import BaseForm from "./../../../components/BaseForm/index";
import Utils from "./../../../utils/utils"
import moment from "moment";

const FormItem = Form.Item;
const Option = Select.Option;

export default class Management extends React.Component {
  state = {
  };
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
    this.setState({
      itemdata: {
        deviceList:[]
      },
    });
    this.request();
  }

  request = () => {
    let userInfo = JSON.parse(localStorage.getItem('user'));
if(userInfo.user.userType == 2){
  this.setState({
    UserType:false
  });
}else{
  this.setState({
    UserType:true
  });
}
   

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
        InData:[],
        itemdata:{deviceList:[]}
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
        content: "您确认要删除此条数据吗？" +item.storageId,
        okText:"确认",
        cancelText:"取消",
        onOk: () => {
          axios
          .ajax({
            method: "post",
            url: "/checkin/deleteCheckIn",
            data: {
              params: {
                storageId: item.storageId
              }
            }
          })
          .then(res => {
            message.success("删除成功");
            this.request();
          });
       
        }
      });
    }
    else if(type=="Verifies"){ 
      Modal.confirm({
        title: "确认",
        content: "您确认通过审核吗？" +item.storageId,
        okText:"确认",
        cancelText:"取消",
        onOk: () => {
          axios
          .ajax({
            method: "post",
            url: "/checkin/auditCheckIn",
            data: {
              params: {
                storageId: item.storageId,
                auditState:"1"
              }
            }
          })
          .then(res => {
            message.success("审核成功");
            this.request();
          });
       
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
     let parmas1 =this.inManagementForm.props.IndataItem
     let parmas=  this.inManagementForm.props.form.getFieldsValue();

     parmas.deviceList=parmas1.deviceList;
     parmas.deliveryDate= Utils.formatDate(parmas.deliveryDate);

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
          { title: '商品编号', dataIndex: 'sparePartId', key: 'sparePartId' },
          { title: '类别', dataIndex: 'sparePartType', key: 'sparePartType', 
          render(sparePartType){
            let config = {
              "1":"备件",
              "2":"耗材"
            }
            return config[sparePartType];
         }
         },
          { title: '商品名称', dataIndex: 'sparePartName', key: 'sparePartName' },
          { title: '规格型号', dataIndex: 'sparePartModel', key: 'sparePartModel' },
          { title: '物料编码', dataIndex: 'materialSn', key: 'materialSn' },
          { title: '数量', dataIndex: 'num', key: 'num'},
         
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
          
              <Button style={{marginLeft:10}} size="small"  onClick={() => this.handleOperation("Verifies",item)} disabled={this.state.UserType}>
                审核
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
          width={800}
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
        InDataDes:null
      });
     
    }else if(type=="Update"){  //eslint-disable-line
      this.setState({
        type:type,
        isVisible: true,
        title: "修改商品",
        InDataDes: item
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
          let indataItem=this.props.IndataItem;
          let deviceList = indataItem.deviceList;
          let index = 0;
          for(var i=0;i< deviceList.length;i++){
            let itemdeviceList=deviceList[i];
            if(itemdeviceList.sparePartId == item.sparePartId){
              index=i;
              break;
            }
        }
        deviceList.splice(index,1);
        this.setState({
          isVisible:false
         });
        message.success("删除成功");
      }
      });
    }
  
  };

  
  handleSubmit = () => {
   
    let parmas=  this.InManagementDesForm.props.form.getFieldsValue();

    let indataItem=this.props.IndataItem;
    let deviceList = indataItem.deviceList;
  
    let flag = true;
    if(deviceList){
    for(var i=0;i< deviceList.length;i++){
      let item=deviceList[i];
      if(item.sparePartId == parmas.sparePartId){
        flag = false;
        item.num= parmas.num
      }
    }

    if(flag){
      deviceList[deviceList.length]=parmas;
    }
  }else{
    deviceList=[parmas];
  }

    


    console.log(deviceList);
    this.InManagementDesForm.props.form.resetFields();

    this.setState({
      isVisible:false
     });

    

 };

  render() {
    const columns = [
      { title: '商品编号', dataIndex: 'sparePartId', key: 'sparePartSn' },
      { title: '类别', dataIndex: 'sparePartType', key: 'sparePartType', 
       render(sparePartType){
         let config = {
           "1":"备件",
           "2":"耗材"
         }
         return config[sparePartType];
      }
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
              <Button size="small"  onClick={() => this.handleOperation("Update",item)}>
                修改
              </Button>
              <Button style={{marginLeft:10}} size="small" type="danger" onClick={() => this.handleOperation("Deleted",item)}>
                删除
              </Button>
            </div>
          );
        },
        width:150
      }
    ];

    let InData = this.props.InData || {};
    let IndataItem = this.props.IndataItem || {deviceList:[]};
    this.IndataItem = IndataItem;

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
                  initialValue: InData.deliveryDate?moment(InData.deliveryDate):""
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
          title={this.state.title}
          visible={this.state.isVisible}
          okText="确认"
          cancelText="取消"
          onOk={this.handleSubmit}
          onCancel={() => {
            this.InManagementDesForm.props.form.resetFields();
            this.setState({
              isVisible: false
            });
          }}
          width={600}
        >
           <InManagementDesForm
            type={this.state.type}
            InDataDes={this.state.InDataDes}
            wrappedComponentRef={inst => {
              this.InManagementDesForm = inst;
            }}
          />

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
  params= {
    pageNum: "1",
    pageSize: "1000",
    startTm: "2000-1-1",
    endTm: "2099-12-1",
    auditState: "1"
  }

  componentWillMount(){
    this.setState({
      dataSource: [],
      InDataDes:{},
    });
     this.request();
  }

    request = () => {
      axios
        .ajax({
          method: "post",
          url: "/sparePart/getSparePartList",
          data: this.params
        })
        .then(res => {
          this.setState({
            dataSource: res.list
          });
        });
  };


  handleChange = (value) => {
    for(var i=0;i< this.state.dataSource.length;i++){
      let item=this.state.dataSource[i];
      if(item.sparePartId == value){
        this.setState({
          type:"Change",
          InDataDes:item
        });
      }
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    let disable = false;

    let InDataDes =this.props.InDataDes||{};
  
  
    if(this.props.type=="Update"){
      disable=true;
    }else{
      if(this.state.type=="Change"){
        InDataDes = this.state.InDataDes;
      }
    }

    let dataSource =this.state.dataSource;
    
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    };

    return (
     
      <Form layout="horizontal">
    
          <FormItem label="商品名称" {...formItemLayout} >
          {/* {getFieldDecorator("sparePartId", {
            initialValue: InDataDes.sparePartId?InDataDes.sparePartId:""
          })(  */}

            <Select placeholder="请选择商品" defaultValue={InDataDes.sparePartId} onChange={this.handleChange} disabled={disable}>
              {
                dataSource.map(it =>
                  (
                    <Option value={it.sparePartId} key={it.sparePartId}>{it.sparePartName}</Option>
                  ))
              }
            </Select>
          {/* )} */}
          </FormItem>
        <FormItem label=" 商品编号" {...formItemLayout} >
          {getFieldDecorator("sparePartId", {
            initialValue: InDataDes.sparePartId
          })(<Input type="text" placeholder="请输入商品编号" disabled/>)}
        </FormItem>
        <FormItem label="类别" {...formItemLayout}>
          {getFieldDecorator("sparePartType", {
            initialValue: InDataDes.sparePartType
          })(
            <Select placeholder="请选择类别" disabled>
              <Option value="1" key="1">备件</Option>
              <Option value="2" key="2">耗材</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="商品名称" {...formItemLayout}>
          {getFieldDecorator("sparePartName", {
            initialValue: InDataDes.sparePartName
          })(<Input type="text" placeholder="请输入商品名称" disabled/>)}
        </FormItem>
        <FormItem label="规格型号" {...formItemLayout}>
          {getFieldDecorator("sparePartModel", {
            initialValue: InDataDes.sparePartModel
          })(<Input type="text" placeholder="请输入规格型号" disabled/>)}
        </FormItem>
        <FormItem label="物料编码" {...formItemLayout}>
          {getFieldDecorator("materialSn", {
            initialValue: InDataDes.materialSn
          })(<Input type="text" placeholder="请输入物料编码"  disabled/>)}
        </FormItem>
        <FormItem label="数量" {...formItemLayout}>
          {getFieldDecorator("num", {
            initialValue: InDataDes.num
          })(<Input type="number" placeholder="请输入数量" />)}
        </FormItem>
      </Form>
    );
  }
}

InManagementDesForm = Form.create({})(InManagementDesForm);