import React from "react";
import { Card, Table } from "antd";
import axios from "../../../axios/index";
import BaseForm from "./../../../components/BaseForm/index"

export default class Management extends React.Component {
  state = {};
  params={pageNum:"1",pageSize:"10",startTm:"2018-1-1",endTm:"2019-12-1",auditState:"1"};

  formList=[
    {
      type:"SELECT",
      label:"审核状态",
      field:"state",
      placeholder:"全部",
      initialValue:"0",
      width:100,
      list:[
        {id:"0",name:"全部"},
        {id:"1",name:"未审核"},
        {id:"2",name:"已审核"},
      ]
    },
    {
      type:"DATEPICKER",
      placeholder:"请选择时间",
    }
  ]

  componentDidMount() {
    this.request();
  }

  request = () => {
    axios
      .ajax({
        method:"post",
        url: "/checkin/getCheckInList",
        data: {
          params:this.params
        }
      })
      .then(res => {
          this.setState({
            dataSource: res.list
          });
      });
  };

  handleFilter = (params)=>{
    this.params={pageNum:"1",pageSize:"10",startTm:params.begin_time,endTm:params.end_time,auditState:params.state};
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
        dataIndex: "sparePartModel"
      },
      
    ];

    return (
      <div>
        <Card>
         <BaseForm formList={this.formList} filterSubmit={this.handleFilter}/>
       </Card>
        <Card title="入库管理" style={{marginTop:10}}>
          <Table columns={columns} dataSource={this.state.dataSource} bordered="true"/>
        </Card>
      </div>
    );
  }
}
