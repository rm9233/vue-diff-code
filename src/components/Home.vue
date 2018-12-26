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
          <Input v-model="uriInput1">
            <Select slot="prepend" style="width: 80px" v-model="mothod">
              <Option value="get">GET</Option>
              <Option value="post">POST</Option>
            </Select>
          </Input>
        </div>
        <Button class="send_button" type="primary" @click="send" :loading="loading">SEND</Button>
      </div>
      <div class="input_wapper1">
        <div style="flex:1">
          <Input v-model="uriInput2">
          <Select slot="prepend" style="width: 80px" v-model="mothod">
            <Option value="get">GET</Option>
            <Option value="post">POST</Option>
          </Select>
          </Input>
        </div>
        <Button class="send_button" type="primary" @click="help" :loading="loading">帮助</Button>
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
          <vueCodeDiff :old-string="uri1Res" :new-string="uri2Res" :context="10" outputFormat="side-by-side" />
        </div>
        <h5 style="margin: 30px 0">Res Body</h5>
        <Split>
          <div slot="left" class="demo-split-pane">
            {{uri1Res}}
          </div>
          <div slot="right" class="demo-split-pane">
            {{uri2Res}}
          </div>
        </Split>
      </div>
    </div>
  </div>
</template>
<script>
  import vueCodeDiff from 'vue-code-diff';
  import HttpUtils from '../utils/HttpUtils';
  let tabIndex = "tab1";
  let urlRes1 = "";
  let urlRes2 = "";
  let mJsonStr = (str)=>{
    try{
      return JSON.parse(str)
    }catch (e) {
      return str;
    }
  }
  export default {
    components: {vueCodeDiff},
    data() {
      return {
        uri1Res: '',
        uri2Res: '',
        errTitle:"",
        errMsg:"",
        modal:false,
        uriInput1:"",
        uriInput2:"",
        loading:false,
        jsonStr:"",
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
                placeholder: "key",
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
      send() {
        if(this.uriInput1 =="" && this.uriInput2 ==""){
          this.modal = true;
          this.errTitle = "请求地址为空";
          this.errMsg = "请求地址不能为空哦..";
        }else{
          this.loading = true;

          HttpUtils.send(this.uriInput1,this.uriInput2,this.mothod,this.data1,this.data2,this.jsonStr,(res)=>{
            this.loading = false;
            this.uri1Res = typeof mJsonStr(res) == "object" ? JSON.parse(res).first : res;
            this.uri2Res = typeof mJsonStr(res) == "object" ? JSON.parse(res).second : res;
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

  .input_wapper2 {
    justify-content: flex-start;
    align-content: flex-start;
    display: flex;
    padding: 10px;
    margin-right: 105px;
  }

  .send_button {
    width: 100px;
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
</style>
