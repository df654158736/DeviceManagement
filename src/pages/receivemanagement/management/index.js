import React from "react";
import { Card, Table, Button, Modal, message,Form,Input,DatePicker,Select,Cascader} from "antd";
import axios from "../../../axios/index";
import BaseForm from "./../../../components/BaseForm/index";
import Utils from "./../../../utils/utils"
import moment from "moment";

const FormItem = Form.Item;
const Option = Select.Option;


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
    pageSize: "100",
    startTm: "2018-1-1",
    endTm: "2019-12-1",
    type:1,
  };


  componentDidMount() {
    this.setState({
      itemdata: {
        deviceList:[]
      },
    });
    let userInfo = JSON.parse(localStorage.getItem('user'));
    this.params.provId=userInfo.user.provId;
    this.params.cityId=userInfo.user.cityId;
    this.params.hallId=userInfo.user.hallId;
    this.request();
  }

  request = () => {
    
    let localOptions = JSON.parse(localStorage.getItem("options"));

    axios
      .ajax({
        method: "post",
        url: "/receive/materialList",
        data: {
          params:this.params
        }
      })
      .then(res => {
        this.setState({
          dataSource: res.list
        });
      });


      if (!localOptions) {
        axios
          .ajax({
            method: "post",
            url: "/hall/getHallList",
            data: {
              params:this.params
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
        ReceiveData:[],
        itemdata:{deviceList:[]}
      });
    } else if (type == "Update") {  //eslint-disable-line
      axios
      .ajax({
        method: "post",
        url: "/receive/materialDevice",
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
          ReceiveData: item
        });
      });
    } else if (type == "Deleted") {  //eslint-disable-line
      Modal.confirm({
        title: "确认",
        content: "您确认要删除此条数据吗？" + item.materialSn,
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          axios
          .ajax({
            method: "post",
            url: "/receive/deleteMaterial",
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
              url: "/receive/receiveDownloads ",
              data: {
                params: this.params
              },
              fileName:"收获单.xls"
            })
            .then(res => {
              message.success("导出成功");
              this.request();
            });
        }
      });
    }
  };
  
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
      url: "/receive/materialDevice",
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


  
  handleSubmit = () => {
    let type = this.state.type;
    let parmas1 =this.ReceiveManagementForm.props.ReceivedataItem
    let parmas=  this.ReceiveManagementForm.props.form.getFieldsValue();

    if(!parmas1.hallId){
      message.success("请选择完整的地域");
      return;
    }
    parmas.deviceList=parmas1.deviceList;
    parmas.hallId=parmas1.hallId?parmas1.hallId:"1001";
    parmas.type=1;
    parmas.deliveryDate= Utils.formatDate(parmas.deliveryDate);

    if(type=="Update"){  //eslint-disable-line
     parmas.storageId = this.state.ReceiveData.storageId;
    }
 
    axios
    .ajax({
      method: "post",
      url: type=="Created"?"/receive/addMaterial":"/receive/updateMaterial",  //eslint-disable-line
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
      this.ReceiveManagementForm.props.form.resetFields();
   
      this.setState({
       isVisible:false
      });
      this.request();
    });
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
            this.ReceiveManagementForm.props.form.resetFields();
            this.setState({
              isVisible: false
            });
          }}
          width={800}
          destroyOnClose
        >
          <ReceiveManagementForm
            type={this.state.type}
            ReceiveData={this.state.ReceiveData}
            ReceivedataItem={this.state.itemdata}
            Options={this.state.formList}
            wrappedComponentRef={inst => {
              this.ReceiveManagementForm = inst;
            }}
          />
        </Modal>
      </div>
    );
  }
}
class ReceiveManagementForm extends React.Component {
   
  state={
    isVisible:false
  }


  handleOperation = (type,item) => {
    if(type=="Created"){  //eslint-disable-line
      this.setState({
        type:type,
        isVisible: true,
        title: "新增商品",
        ReceiveDataDes:null
      });
     
    }else if(type=="Update"){  //eslint-disable-line
      this.setState({
        type:type,
        isVisible: true,
        title: "修改商品",
        ReceiveDataDes: item
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
          let ReceivedataItem=this.props.ReceivedataItem;
          let deviceList = ReceivedataItem.deviceList;
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
   
    let parmas=  this.ReceiveManagementDesForm.props.form.getFieldsValue();

    let ReceivedataItem=this.props.ReceivedataItem;
    let deviceList = ReceivedataItem.deviceList;
  
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
    this.ReceiveManagementDesForm.props.form.resetFields();
    this.setState({
      isVisible:false
     });

   

 };

 dataChange = (params,item) => {
  console.log(params);
  if (params.length == 3) {  //eslint-disable-line
    this.props.ReceivedataItem.hallId=params[2]
    console.log(this.props.OutdataIte);
  }else{
    this.props.ReceivedataItem.hallId=null;
  }
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
    const { getFieldDecorator } = this.props.form;

    let ReceiveData = this.props.ReceiveData || {};
    let ReceivedataItem = this.props.ReceivedataItem || {deviceList:[]};
    let type=this.props.type;
    this.ReceivedataItem = ReceivedataItem;
    let options = this.props.Options[0].options;

    let optionsDefaultValue=[]
    if(ReceiveData.length!=0){
       optionsDefaultValue = [ReceiveData.provId+"",ReceiveData.cityId+"",ReceiveData.hallId+""];
    }
    console.log(optionsDefaultValue);
    let disable = false;
    if (type=="Update") {
      this.props.ReceivedataItem.hallId=ReceiveData.hallId;
      disable = true
    }
  
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    };

    
    return (
      <div>
      <Form layout="horizontal">
        <FormItem label="销售厅" key="hallId" {...formItemLayout}>
              <Cascader
              defaultValue={optionsDefaultValue}
              disabled={disable}
              options={options}
              fieldNames={{
              label: "value",
              value: "id",
              children: "childList"
              }}
              changeOnSelect
              onChange={this.dataChange}
              placeholder="请选择销售厅"
              style={{ width: 300 }}
            />
          </FormItem>
          <FormItem label="到货方式" {...formItemLayout}>
          {getFieldDecorator("deliveryType", {
            initialValue: ReceiveData.deliveryType
          })(<Input type="text" placeholder="请输入物料编码名" />)}
        </FormItem>
        <FormItem label="备注" {...formItemLayout}>
          {getFieldDecorator("mark", {
            initialValue: ReceiveData.mark
          })(<Input type="text" placeholder="请输入物料编码名" />)}
        </FormItem>
        <FormItem label="到货日期" {...formItemLayout} >
              {getFieldDecorator("deliveryDate",{
                  initialValue: ReceiveData.deliveryDate?moment(ReceiveData.deliveryDate):""
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
         dataSource={ReceivedataItem.deviceList}
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
            this.ReceiveManagementDesForm.props.form.resetFields();
            this.setState({
              isVisible: false
            });
          }}
          width={600}
          destroyOnClose
        >
           <ReceiveManagementDesForm
            type={this.state.type}
            ReceiveDataDes={this.state.ReceiveDataDes}
            wrappedComponentRef={inst => {
              this.ReceiveManagementDesForm = inst;
            }}
          />

     </Modal>
     </div>
    );
  }
}
ReceiveManagementForm = Form.create({})(ReceiveManagementForm);


class ReceiveManagementDesForm extends React.Component {
   
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
      ReceiveDataDes:{}
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
          ReceiveDataDes:item
        });
      }
    }
  }

  render() {


    const { getFieldDecorator } = this.props.form;

    let disable = false;

    let ReceiveDataDes =this.props.ReceiveDataDes||{};
  
  
    if(this.props.type=="Update"){
      disable=true;
    }else{
      if(this.state.type=="Change"){
        ReceiveDataDes = this.state.ReceiveDataDes;
      }
    }

    let dataSource =this.state.dataSource;
    
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    };


    return (
     
      <Form layout="horizontal">
       <FormItem label="商品名称" {...formItemLayout}>
       {/* {getFieldDecorator("sparePartId", {
            initialValue: ReceiveDataDes.sparePartId
          })( */}
      <Select placeholder="请选择商品"  defaultValue={ReceiveDataDes.sparePartId} onChange={this.handleChange} disabled={disable}>
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
            initialValue: ReceiveDataDes.sparePartId
          })(<Input type="text" placeholder="请输入商品编号" disabled/>)}
        </FormItem>
        <FormItem label="类别" {...formItemLayout}>
          {getFieldDecorator("sparePartType", {
            initialValue: ReceiveDataDes.sparePartType
          })(
            <Select placeholder="请选择类别" disabled>
              <Option value="1" key="1">备件</Option>
              <Option value="2" key="2">耗材</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="商品名称" {...formItemLayout}>
          {getFieldDecorator("sparePartName", {
            initialValue: ReceiveDataDes.sparePartName
          })(<Input type="text" placeholder="请输入商品名称" disabled/>)}
        </FormItem>
        <FormItem label="规格型号" {...formItemLayout}>
          {getFieldDecorator("sparePartModel", {
            initialValue: ReceiveDataDes.sparePartModel
          })(<Input type="text" placeholder="请输入规格型号" disabled/>)}
        </FormItem>
        <FormItem label="物料编码" {...formItemLayout}>
          {getFieldDecorator("materialSn", {
            initialValue: ReceiveDataDes.materialSn
          })(<Input type="text" placeholder="请输入物料编码"  disabled/>)}
        </FormItem>
        <FormItem label="数量" {...formItemLayout}>
          {getFieldDecorator("num", {
            initialValue: ReceiveDataDes.num
          })(<Input type="number" placeholder="请输入数量" />)}
        </FormItem>
      </Form>
    );
  }
}

ReceiveManagementDesForm = Form.create({})(ReceiveManagementDesForm);