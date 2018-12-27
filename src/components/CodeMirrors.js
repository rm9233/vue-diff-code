import CodeMirror from './CodeMirror'

CodeMirror.install = Vue => {
  Vue.component(CodeMirror.name, CodeMirror)
}

export default CodeMirror
