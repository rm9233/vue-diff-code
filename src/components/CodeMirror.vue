<template>
    <textarea></textarea>
</template>

<script>
    import CodeMirror from 'codemirror/lib/codemirror'   // CodeMirror，必要
    import 'codemirror/lib/codemirror.css'    // css，必要
    import 'codemirror/mode/javascript/javascript'  // js的语法高亮，自行替换为你需要的语言

    export default {

        data () {
            return {
                editor: {}
            }
        },
        props: {
            options: {
                type: Object,
                required: true,
            },
            value:String
        },
        watch: {
            value(){
                this.editor.setValue(this.value)
            }
        },
        mounted () {
            this.editor = CodeMirror.fromTextArea(this.$el, this.options)
        }

    }
</script>