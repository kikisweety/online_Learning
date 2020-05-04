import React from "react";
import "./User.css";
import net from "../../../utils/net";
import {
  Button, Table, Select, Form, Input, InputNumber, Radio,Modal
} from "antd";
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};
const { confirm } = Modal;
export default class User extends React.Component {
  constructor() {
    super();
    this.state = {
      age: null,
      userId:"",
      columns: [
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          render: text => <a>{text}</a>,
        },
        {
          title: '年龄',
          dataIndex: 'age',
          key: 'age'
        },
        {
          title: '性别',
          dataIndex: 'sex',
          key: 'sex',
          render: text => {
            if (text == 'woman') {
              return "女";
            } else if (text == 'man') {
              return "男";
            }
          }
        },
        {
          title: '昵称',
          dataIndex: 'loginName',
          key: 'loginName'
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          render: (text,record) => {
            var that = this;
            return (
              <div>
                <Button style={{ marginRight: 10, background: "#43BB60", color: 'white' }} >修改</Button>
                <Button type="danger" style={{ color: 'white' }} onClick={this.delete.bind(this,record.userId)}>删除</Button>
              </div>
            )
          }
        }
      ],
      allUser: []
    };
  }
  displayAddForm() {
    this.refs.userForm.style.display = "block"
  }
  closeForm() {
    this.refs.userForm.style.display = "none"
  }
  handleAge(e) { 
    this.setState({
      age:e
    })
  }
  componentDidMount() { 
    let that = this;
    net.get("user/all", {}, function (ob) { 
      let userList = ob.data.object;
      that.setState({
        allUser:userList
      })
    })
  }
  upload() { 
    let name = this.refs.inputName.state.value;
    let age = this.state.age;
    let sex = this.refs.sex.state.value;
    let loginName = this.refs.inputLoginName.state.value;
    let that = this;
    net.uploadFile(
      "user/add", { name, age, sex, loginName },
      function (params) {
        if (params.code == -1) {
          alert("上传失败");
        } else {
          alert("上传成功");
          that.refs.userForm.style.display = "none";
        }
      }
    )
  }
  delete(userId) {
    confirm({
      title: '提示',
      content: '确定删除吗？',
      onOk() {
        return net.get(
          "user/delete", { userId: userId },
          function (res) {
            console.log(res);
          }
        )
      },
      onCancel() { },
      okText:'确定',
      cancelText:'取消'
    })
   }
  render() {
    return (
      <div className="addView">
        <div className="addCourseList" ref="box">
          <div className="opacity" ref="opacity"></div>
          <div className="addCourseTitle">
            <span>用户信息</span>
            <Button
              type="primary"
              style={{ background: "#43BB60" }}
              onClick={this.displayAddForm.bind(this)}
            >添加用户</Button>
          </div>
          <Table
            rowKey={record => record.id}
            columns={this.state.columns}
            dataSource={this.state.allUser}
            style={{ width: "100%", height: 500, margin: "10px auto" }}
            pagination={{ pageSize: 8 }}
            scroll={{ y: 500 }}
          ></Table>
        </div>
        {/* 用户添加 */}
        <div className="addForm" ref="userForm">
          <div className="addTeacherTitle">用户添加</div>
          <Form
            name="nest-messages"
            {...layout}
            style={{ width: '100%', marginTop: 20 }}>
            <Form.Item name={['user', 'name']} label="姓名：" rules={[{ required: true }]}>
              <Input placeholder="请输入姓名" ref="inputName" />
            </Form.Item>
            <Form.Item name={['user', 'age']} label="年龄" rules={[{ type: 'number', min: 0, max: 99 }]}>
              <InputNumber onChange={this.handleAge.bind(this)} />
            </Form.Item>
            <Form.Item name="radio-button" label="性别">
              <Radio.Group ref="sex">
                <Radio.Button value="man">男</Radio.Button>
                <Radio.Button value="woman">女</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item name={['user', 'loginName']} label="昵称：">
              <Input placeholder="请输入昵称" ref="inputLoginName" />
            </Form.Item>
            <Form.Item name="button" className="formButton">
              <Button onClick={this.upload.bind(this)} type="primary" style={{marginRight:20}}>提交</Button>
              <Button type="primary"
                onClick={this.closeForm.bind(this)}
              >
                取消
            </Button>
            </Form.Item>
          </Form>
          <div className="button">
          </div>
        </div>
      </div>
    );
  }
}
