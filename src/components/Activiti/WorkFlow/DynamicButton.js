export default {
  name: 'DynamicButton',
  props: {
    formInfo: {
      type: Object,
      default: () => { return {} }
    },
    formLoading: {
      type: Boolean,
      default: false
    },
    isSelf: {
      type: Boolean,
      default: false
    },
    closeDrawer: {
      type: Function,
      default: undefined
    },
    callBack: {
      type: Function,
      default: function () {
          console.error('callBack 函数必须定义')
      }
    }
  },
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
    parseButtons () {
      const outcomes = this.formInfo.outcomes
      const buttons = []
      if (this.closeDrawer) {
        buttons.push(<a-button onClick={this.closeDrawer}>返回</a-button>)
      }
      if (outcomes && outcomes.length > 0 && this.isSelf === false) {
        outcomes.forEach(outcome => {
          buttons.push(this.getOutCome(outcome))
        })
      } else {
        buttons.push(<a-button style={{ marginLeft: '8px' }} onClick={this.handleSubmit} loading={this.formLoading} type={'primary'}>完成</a-button>)
      }
      return buttons
    },
    /**
     *
     * @param outcomes  {"name": "通过"}
     */
    getOutCome (outcome) {
      return (<a-button value ={outcome.name} style={{ marginLeft: '8px' }} onClick={this.handleSubmit} loading={this.formLoading} type={'primary'}>{outcome.name}</a-button>)
    },
    handleSubmit (e) {
      this.callBack(e.target.value)
    }
  },
  render () {
    const divElement = <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', borderTop: '1px solid #e9e9e9', padding: '10px 16px', background: '#fff', textAlign: 'right' }}>{this.parseButtons()}</div>
    return (divElement)
  }
}
