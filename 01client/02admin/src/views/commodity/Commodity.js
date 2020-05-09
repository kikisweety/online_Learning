import React from "react";
import "./Commodity.css";
import net from "../../utils/net";
import {
    Button, Table, Upload, Input, message,Modal, Icon, Form, InputNumber
} from "antd";
const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
};
const { confirm } = Modal;
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
}
export default class Commodity extends React.Component {
    constructor() {
        super();
        this.state = {
            fileList: [],
            fileList1: [],
            loading: false,
            isLoading: false,
            price: null,
            amount:null,
            columns: [
                {
                    title: '商品名称',
                    dataIndex: 'commodityName',
                    key: 'commodityName',
                    render: text => <a>{text}</a>,
                },
                {
                    title: '商品图片',
                    dataIndex: 'url',
                    key: 'url',
                    render: text => { 
                        return <div style={{ overflow: 'hidden',whiteSpace: 'nowrap',textOverflow:'ellipsis'}}>{text}</div>
                    }
                },
                {
                    title: '价格',
                    dataIndex: 'commodityPrice',
                    key: 'commodityPrice',
                    render: text => {
                        return <div>{text}元</div>
                    }
                },
                {
                    title: '库存',
                    dataIndex: 'amount',
                    key: 'amount'
                },
                {
                    title: '商品详情',
                    dataIndex: 'commodityDetails',
                    key: 'commodityDetails',
                    render: text => {
                        return <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{text}</div>
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (text, record) => {
                        return (
                            <div>
                                <Button style={{ marginRight: 10, background: "#43BB60", color: 'white' }} >修改</Button>
                                <Button type="danger" style={{ color: 'white' }} onClick={this.delete.bind(this, record)}>删除</Button>
                            </div>
                        )
                    }
                }
            ],
            allCommodity: []
        };
    }
    displayAddForm() {
        this.refs.commodityForm.style.display = "block";
        this.refs.opacity.style.display = "block";
    }
    closeForm() {
        this.refs.commodityForm.style.display = "none"
        this.refs.opacity.style.display = "none";
    }
    beforeUpload(file) {
        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("你只能传图片格式为JPG/PNG!");
        }
        let fileList1 = this.state.fileList1;
        fileList1.push(file);
        this.setState({ fileList1: fileList1 });
        return isJpgOrPng;
    }
    handleChangeimg = info => {
        if (info.file.status === "uploading") {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === "done") {
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false
                })
            );
        }
    };
    uploadDetail(file) {
        let fileList = this.state.fileList;
        fileList.push(file);
        this.setState({ fileList: fileList });
    };
    handlePrice(e) { 
        this.setState({
            price:e
        })
    };
    handleAmount(e) {
        this.setState({
            amount: e
        })
    };
    upload() {
        let commodityName = this.refs.inputName.state.value;
        let url = this.state.fileList1;
        let commodityPrice = this.state.price;
        let amount = this.state.amount;
        // let commodityDetails = this.state.fileList2;
        let fileList = this.state.fileList;
        // console.log(url, commodityDetails);
        
        let that = this;
        net.uploadFile("commodity/insert", { files: fileList},
            function (ob) {
                console.log(ob);
        })
    };
    componentDidMount() {
        this.getCommodity();
    };
    getCommodity() {
        let that = this;
        net.get("commodity/All", {},function (ob) {
            let allCommodity = ob.data.object;
            that.setState({ allCommodity: allCommodity });
        })
     };
    delete(record) {
        let that = this;
        let id = record.id;
        confirm({
            title: '提示',
            content: '确定删除吗？',
            onOk() {
                return net.get(
                    "commodity/delete", { id: id },
                    function (res) {
                        that.getCommodity();
                    }
                )
            },
            onCancel() { },
            okText: '确定',
            cancelText: '取消'
        })
     }


    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? "loading" : "plus"} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const { imageUrl } = this.state;
        return (
            <div className="addView">
                <div className="addCourseList" ref="box">
                    <div className="opacity" ref="opacity"></div>
                    <div className="addCourseTitle">
                        <span>商品信息</span>
                        <Button
                            type="primary"
                            style={{ background: "#43BB60" }}
                            onClick={this.displayAddForm.bind(this)}
                        >添加商品</Button>
                    </div>
                    <Table
                        rowKey={record => record.id}
                        columns={this.state.columns}
                        dataSource={this.state.allCommodity}
                        style={{ width: "100%", height: 500, margin: "10px auto" }}
                        pagination={{ pageSize: 8 }}
                        scroll={{ y: 500 }}
                    ></Table>
                </div>
                {/* 商品添加 */}
                <div className="addForm" ref="commodityForm">
                    <div className="addTeacherTitle">商品添加</div>
                    <Form
                        name="nest-messages"
                        {...layout}
                        style={{ width: '100%', marginTop: 20 }}>
                        <Form.Item name={['commodity_name']} label="商品名称：" rules={[{ required: true }]}>
                            <Input placeholder="请输入商品名称" ref="inputName" />
                        </Form.Item>
                        <Form.Item name={['url']} label="商品图片：">
                            <Upload
                                ref="uploadImg"
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                beforeUpload={this.beforeUpload.bind(this)}
                                onChange={this.handleChangeimg}
                            >
                                {imageUrl ? (
                                    <img src={imageUrl} alt="avatar" style={{ width: 70 }} />
                                ) : (
                                        uploadButton
                                    )}
                            </Upload>
                        </Form.Item>
                        <Form.Item name={['commodity_price']} label="价格：" rules={[{ type: 'number', min: 0, max: 99 }]}>
                            <InputNumber onChange={this.handlePrice.bind(this)}/>
                        </Form.Item>
                        <Form.Item name={['amount']} label="库存：">
                            <InputNumber onChange={this.handleAmount.bind(this)}/>
                        </Form.Item>
                        <Form.Item name={['commodity_detail']} label="商品详情：">
                            <Upload name="logo"
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                listType="picture"
                                beforeUpload={this.uploadDetail.bind(this)}>
                                <Button>
                                    <Icon type="upload" /> 点击选择图片
              </Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item name="button" className="formButton" style={{ margin:'auto'}}>
                            <Button type="primary" style={{ marginRight: 20 }} onClick={this.upload.bind(this)}>提交</Button>
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
