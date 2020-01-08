import React from "react";
import "./CoursesAdd.css";
import { Tabs } from "antd";
import net from "../../../utils/net";
import CourseInformation from "../../../components/courseInformation/CourseInformation";
import CourseTest from "../../../components/courseTest/courseTest";
import CourseCreate from "../../../components/courseCreate/courseCreate";
import CourseDocument from "../../../components/courseDocument/CourseDocument";
import CourseBank from "../../../components/courseBank/CourseBank.js"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
const { TabPane } = Tabs;

export default class CoursesAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      value: 0
    };
  }
  callback(key) {
    console.log(key);
  }
  onChange = e => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  };
  showPath() { 
    console.log(this.props.match.path);
  }

  render() {
    return (
      <div className="coursesAdd">
        <Tabs
          // className="tabs"
          // activeKey={this.state.activeKey}
          // defaultActiveKey="1"
          // onChange={this.onTabsChange.bind(this)}
          className="tabs" defaultActiveKey="1" onChange={this.callback.bind(this)}
        >
          <TabPane className="courseTabs" tab="课程文件" key="1">
            <CourseDocument></CourseDocument>
          </TabPane>
          <TabPane tab="课程信息" key="2">
            <CourseInformation></CourseInformation>
          </TabPane>
          <TabPane tab="课程试卷" key="3">
            {/* <CourseCreate></CourseCreate> */}
            <Switch>
              <Route
                exact
                path={`/home/courses/add`}
                component={CourseTest}
              >{
                  this.showPath()
              }</Route>
              <Route
                exact
                path={`/home/courses/add/created`}
                component={CourseCreate}
              ></Route>
            </Switch>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
