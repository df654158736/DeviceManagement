import React from "react";
import { Card, Table, Button, Modal, message,Form,Input,DatePicker,Select,Cascader } from "antd";
import axios from "../../../axios/index";
import moment from "moment";

const FormItem = Form.Item;
const Option = Select.Option;
class CommomForm extends React.Component {
  initFormList = () => {
    const { getFieldDecorator } = this.props.form;
    const formList = this.props.formList;
    let formItemList = [];
    if (formList && formList.length > 0) {
      formList.forEach((item, i) => {
        let label = item.label;
        let field = item.field;
        let initialValue = item.initialValue || "";
        let placeholder = item.placeholder;
        let width = item.width;

        let options = item.options;

        if (item.type == "DATEPICKER") {//eslint-disable-line
          const begin_time = 
            <FormItem label="查询时间" key="begin_time" >
              {getFieldDecorator("begin_time")(
                <DatePicker
                  showTime={true}
                  placeholder={placeholder}
                  format="YYYY-MM-DD HH:mm:ss"
                />
              )}
            </FormItem>
         
          formItemList.push(begin_time);
          const end_time = 
            <FormItem label="~" key="end_time" colon={false}>
              {getFieldDecorator("end_time")(
                <DatePicker
                  showTime={true}
                  placeholder={placeholder}
                  format="YYYY-MM-DD HH:mm:ss"
                />
              )}
            </FormItem>
         
          formItemList.push(end_time);
        }
        else if (item.type == "INPUT") {//eslint-disable-line
          const INPUT = 
            <FormItem label={label} key={field}>
              {getFieldDecorator([field], {
                initialValue: initialValue
              })(<Input type="text" placeholder={placeholder} />)}
            </FormItem>
        
          formItemList.push(INPUT);
        } 
        else if (item.type == "SELECT") {//eslint-disable-line
          const SELECT =
            <FormItem label={label} key={field}>
              {getFieldDecorator([field], {
                initialValue: initialValue
              })(
                <Select style={{ width: width }} placeholder={placeholder}>
                {
                  item.list.map(it =>
                  (
                    <Option value={it.id} key={it.id}>{it.name}</Option>
                  ))
                }
                </Select>
              )}
            </FormItem>
        
          formItemList.push(SELECT);
        }else if(item.type == "Cascader"){//eslint-disable-line
          const CASCADER =
          <FormItem label={label} key={field}>
            {getFieldDecorator([field])(
              <Cascader
              options={options}
              fieldNames={{
              label: "value",
              value: "id",
              children: "childList"
              }}
              changeOnSelect
              placeholder={placeholder}
              style={{ width: 300 }}
            />
            )}
          </FormItem>
      
        formItemList.push(CASCADER);
        }
      });
    }
    return formItemList;
  };

  handleFilterSubmit = () => {
    let fieldsValue = this.props.form.getFieldsValue();
    this.props.filterSubmit(fieldsValue);
  };

  reset =()=>{
    this.props.form.resetFields();
  }

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

    let ReceivedataItemHallId=ReceivedataItem.hallId+"";

    
  
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    };

    
    return (
      <div>
      <Form layout="inline">
        {this.initFormList()}
        <FormItem label="备注" {...formItemLayout}>
          {getFieldDecorator("mark", {
            initialValue: ReceiveData.mark
          })(<Input type="text" placeholder="请输入物料编码名" />)}
        </FormItem>
        <FormItem label="到货日期" {...formItemLayout} >
              {getFieldDecorator("deliveryDate",{
                  initialValue: moment(ReceiveData.deliveryDate)
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
            this.CommomFormDesForm.props.form.resetFields();
            this.setState({
              isVisible: false
            });
          }}
          width={600}
        >
           <CommomFormDesForm
            type={this.state.type}
            ReceiveDataDes={this.state.ReceiveDataDes}
            wrappedComponentRef={inst => {
              this.CommomFormDesForm = inst;
            }}
          />

     </Modal>
     </div>
    );
  }
}
export default Form.create({})(CommomForm);


class CommomFormDesForm extends React.Component {
   
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

CommomFormDesForm = Form.create({})(CommomFormDesForm);