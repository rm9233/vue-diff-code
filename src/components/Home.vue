<template>
    <div class="container">
        <div>
            <Modal
                    v-model="modal"
                    :title="this.errTitle">
                <p>{{errMsg}}}</p>
            </Modal>
            <div class="input_wapper">
                <div style="flex:1">
                    <Input v-model="uriInput1" placeholder="请填写正确地址 http:// * / *">
                    <Select slot="prepend" style="width: 80px" v-model="mothod">
                        <Option value="get">GET</Option>
                        <Option value="post">POST</Option>
                    </Select>
                    </Input>
                </div>
                <Button class="send_button" type="primary" @click="send" :loading="loading">SEND</Button>
            </div>
            <div class="input_wapper">
                <div style="flex:1">
                    <Input v-model="uriInput2" placeholder="请填写正确地址 http:// * / *">
                    <Select slot="prepend" style="width: 80px" v-model="mothod">
                        <Option value="get">GET</Option>
                        <Option value="post">POST</Option>
                    </Select>
                    </Input>
                </div>
                <Tooltip placement="top">
                    <Button class="send_button" icon="ios-alert-outline"></Button>
                    <div slot="content">
                        <p>header中，可以使用token1,</p>
                        <p>token2 分别对应第一个url</p>
                        <p>和第二个url的authorization。</p>
                        <p>env1 和 env2 分别对应</p>
                        <p>url1和url2中所对应的环境</p>
                    </div>
                </Tooltip>
            </div>
            <div class="tab_wapper">
                <Tabs value="tab1" @on-click="tabChange">
                    <TabPane label="Params" name="tab1">
                        <div>
                            <Table :columns="columns1" :data="data1"></Table>
                        </div>
                    </TabPane>
                    <TabPane label="Header" name="tab2">
                        <div>
                            <Table :columns="columns2" :data="data2"></Table>
                        </div>
                    </TabPane>
                    <TabPane label="Body" name="tab3">
                        <Input type="textarea" :rows="4" placeholder="Enter Json String..." v-model="jsonStr"/>
                    </TabPane>
                </Tabs>
            </div>
            <div class="context_wapper">
                <h5 style="margin: 30px 0">Res Compare</h5>
                <div>
                    <code-diff :old-string="uri1Res" :new-string="uri2Res" :context="10" outputFormat="side-by-side"/>
                </div>
                <h5 style="margin: 30px 0">Res Body</h5>
                <Split>
                    <div slot="left" class="demo-split-pane">
                        <codemirror :options="cmOptions"  :value="uri1Res"></codemirror>
                    </div>
                    <div slot="right" class="demo-split-pane">
                        <codemirror :options="cmOptions" :value="uri2Res"></codemirror>
                    </div>
                </Split>
            </div>
        </div>
    </div>
</template>
<script>

    require('codemirror/theme/cobalt.css')
    require('codemirror/addon/edit/closebrackets.js')

    import codeDiff from './code-diff/index.js'
    import HttpUtils from '../utils/HttpUtils';

    let tabIndex = "tab1";
    let urlRes1 = "";
    let urlRes2 = "";
    let mJsonStr = (str) => {
        try {
            return JSON.parse(str)
        } catch (e) {
            return str;
        }
    }
    export default {
        components: {codeDiff},
        data() {
            return {
                cmOptions: {
                    mode: {
                        name: 'javascript',
                        json: true
                    },
                    indentUnit: 2,
                    tabSize: 2,
                    lineNumbers: true,
                    theme: 'base16-dark',
                    autoCloseBrackets: true,
                    readOnly:true,
                    value:"aaa"
                },
                uri1Res: '',
                uri2Res: '',
                errTitle: "",
                errMsg: "",
                modal: false,
                uriInput1: "",
                uriInput2: "",
                loading: false,
                jsonStr: "",
                mothod: "get",
                columns1: [{
                    title: 'KEY',
                    key: 'key',
                    render: (h, params) => {
                        return h('KInput', {
                            props: {
                                clearable: "clearable",
                                placeholder: "key",
                                model: this.data1[params.index],
                                type: "key"
                            }
                        })
                    }
                },
                    {
                        title: 'VALUE',
                        key: 'value',
                        render: (h, params) => {
                            return h('KInput', {
                                props: {
                                    clearable: "clearable",
                                    placeholder: "value",
                                    model: this.data1[params.index],
                                    type: "value"
                                }
                            })
                        }
                    },
                    {
                        title: 'DESCRIPTION',
                        key: 'description',
                        render: (h, params) => {
                            return h('KInput', {
                                props: {
                                    clearable: "clearable",
                                    placeholder: "description",
                                    model: this.data1[params.index],
                                    type: "description"
                                }
                            })
                        }
                    },
                    {
                        title: 'ACTION',
                        key: 'description',
                        render: (h, params) => {
                            return h('div', [
                                [
                                    h('Button', {
                                        props: {
                                            type: "primary"
                                        },
                                        on: {
                                            click: () => {
                                                this.append(params.index)
                                            }
                                        }
                                    }, 'APPEND'),
                                    h('Button', {
                                        props: {
                                            type: "error",
                                            disabled: this.data1.length == 1 ? true : false
                                        },
                                        style: {
                                            marginLeft: "20px"
                                        },
                                        on: {
                                            click: () => {
                                                if (this.data1.length != 1) {
                                                    this.remove(params.index)
                                                }
                                            }
                                        }
                                    }, 'REMOVE')
                                ]
                            ])
                        }
                    },
                ],
                columns2: [{
                    title: 'KEY',
                    key: 'key',
                    render: (h, params) => {
                        return h('KInput', {
                            props: {
                                clearable: "clearable",
                                placeholder: "内置参数:token1 token2 env1 env2",
                                model: this.data2[params.index],
                                type: "key"
                            }
                        })
                    }
                },
                    {
                        title: 'VALUE',
                        key: 'value',
                        render: (h, params) => {
                            return h('KInput', {
                                props: {
                                    clearable: "clearable",
                                    placeholder: "value",
                                    model: this.data2[params.index],
                                    type: "value"
                                }
                            })
                        }
                    },
                    {
                        title: 'DESCRIPTION',
                        key: 'description',
                        render: (h, params) => {
                            return h('KInput', {
                                props: {
                                    clearable: "clearable",
                                    placeholder: "description",
                                    model: this.data2[params.index],
                                    type: "description"
                                }
                            })
                        }
                    },
                    {
                        title: 'ACTION',
                        key: 'description',
                        render: (h, params) => {
                            return h('div', [
                                [
                                    h('Button', {
                                        props: {
                                            type: "primary"
                                        },
                                        on: {
                                            click: () => {
                                                this.append(params.index)
                                            }
                                        }
                                    }, 'APPEND'),
                                    h('Button', {
                                        props: {
                                            type: "error",
                                            disabled: this.data2.length == 1 ? true : false
                                        },
                                        style: {
                                            marginLeft: "20px"
                                        },
                                        on: {
                                            click: () => {
                                                if (this.data2.length != 1) {
                                                    this.remove(params.index)
                                                }
                                            }
                                        }
                                    }, 'REMOVE')
                                ]
                            ])
                        }
                    },
                ],
                data1: [
                    {
                        key: "",
                        value: "",
                        description: ""
                    }
                ],
                data2: [
                    {
                        key: "",
                        value: "",
                        description: ""
                    }
                ]
            }
        },
        methods: {
            jsonFormate(res, type) {
                if (typeof mJsonStr(res) == "object") {
                    let js = type == 1 ? JSON.parse(res).first : JSON.parse(res).second;
                    if (typeof mJsonStr(js) == "object") {
                        return js.replace(/(\,)|(\})|(\{)/g, function (m, m1, m2, m3) {
                            if (m1) {
                                return ',\n';
                            } else if (m2) {
                                return '\n}';
                            } else if (m3) {
                                return '{\n';
                            } else {
                                return undefined;
                            }
                        })
                    } else {
                        return js;
                    }
                }
                return res;
            },
            send() {
                let exp = /^(http:\/\/|https:\/\/)+(.+)(\/.*)/;
                if (this.uriInput1 == "" && this.uriInput2 == "") {
                    this.modal = true;
                    this.errTitle = "请求地址为空";
                    this.errMsg = "请求地址不能为空哦..";
                } else if(exp.test(this.uriInput1) == false || exp.test(this.uriInput2) == false){
                    this.modal = true;
                    this.errTitle = "请求地址错误";
                    this.errMsg = "请求地址不是一个正确的接口地址..";
                }else{

                    this.loading = true;
                    HttpUtils.send(this.uriInput1, this.uriInput2, this.mothod, this.data1, this.data2, this.jsonStr, (res) => {
                        this.loading = false;
                        this.uri1Res = this.jsonFormate(res, 1);
                        //this.cmOptions1.value = this.uri1Res;
                        this.uri2Res = this.jsonFormate(res, 2);
                        //this.cmOptions2.value = this.uri2Res;
                    });
                }


            },
            remove(index) {
                if (tabIndex == "tab1") {
                    this.data1.splice(index, 1);
                } else {
                    this.data2.splice(index, 1);
                }
            },
            append() {
                if (tabIndex == "tab1") {
                    this.data1.push({key: "", value: "", description: ""});
                } else {
                    this.data2.push({key: "", value: "", description: ""});
                }

            },
            tabChange(index) {
                tabIndex = index;
            }
        }

    }


</script>
<style>
    * {
        padding: 0;
        margin: 0;
    }

    .container {
        min-width: 1000px;
    }

    .input_wapper {
        display: flex;
        padding: 10px;
    }


    .send_button {
        width: 150px;
        margin-left: 10px;
    }

    .tab_wapper {
        min-height: 200px;
    }

    .context_wapper {
        margin: 30px;
        height: 100%;
    }

    .context_wapper .demo-split-pane {
        height: 100%;
    }
    .CodeMirror pre{
        text-align: left !important;;
    }
    .ivu-split-trigger-con{
        display: none !important;
    }
</style>
