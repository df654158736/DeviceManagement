import React from "react";
import { Card, Form, Input, Button, Icon } from "antd";
import axios from "../../axios/index";
import "./../login/index.less"
const FormItem = Form.Item;
class Login extends React.Component {

  componentWillMount(){
    localStorage.clear();
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {


        axios
        .ajax({
          method:"post",
          url: "/user/login",
          data: {
            params: {
              "name":values.userName?values.userName:"aaa",
              "password":values.psw?values.psw:"test"
            },
            isShowLoading:false
          }
        })
        .then(res => {
          localStorage.setItem("user", JSON.stringify(res));
          window.location.href = "/#/basic/product";
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login">
       <div className="login-temp"></div>
        <Card title="中福在线备件管理系统" className="login-main" >
          <Form layout="vertical">
            <FormItem>
              {getFieldDecorator("userName", {
                rules: [
                  {
                    require: true
                  }
                ]
              })(<Input prefix={<Icon type="user"/>} placeholder="请输入用户名" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator("psw", {
                rules: []
              })(<Input prefix={<Icon type="lock"/>}  type="password" placeholder="请输入密码" />)}
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={this.handleSubmit}>
                登录
              </Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    );
  }
}
export default Form.create({})(Login);
