import React from "react";
import { Input, Select, Form, Button, DatePicker,Cascader } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

class FilterForm extends React.Component {
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
    return (
      <Form layout="inline">
        {this.initFormList()}
        <FormItem>
          <Button
            type="primary"
            style={{ margin: "0 20px" }}
            onClick={this.handleFilterSubmit}
          >
            查询
          </Button>
          <Button onClick={this.reset}>重置</Button>
        </FormItem>
      </Form>
    );
  }
}
export default Form.create({})(FilterForm);
