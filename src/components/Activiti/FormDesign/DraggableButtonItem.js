import draggable from 'vuedraggable'
export default {
  name: 'DraggableButtonItem',
  props: {
    drawingButtonList: {
      type: Array,
      default: () => { return [] }
    },
    activeId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
    parseButtonItems () {
      let formFields = []
      const { itemCopy, itemDelete, activeItem } = this.$listeners
      const fields = this.drawingButtonList
      if (fields && fields.length > 0) {
        formFields = fields.map((item, index) => {
          const className = this.activeId === item.id ? 'drawing-button-item hover-button-from-item active-button-item' : 'drawing-button-item hover-button-from-item'
          return (
            <div index={item.id} onClick={e => { activeItem(e.target) }} class={className}>
              {this.createButtonItem(item)}
              <a-icon onClick={e => {
                itemCopy(item, this.drawingButtonList); e.stopPropagation()
              }} class="drawing-button-item-copy" type={'copy'}/>
              <a-icon onClick={e => {
                itemDelete(index, this.drawingButtonList); e.stopPropagation()
              }} class="drawing-button-item-delete" type={'delete'}/>
            </div>
          )
        })
      }
      const { start, add, update, remove, end } = this.$listeners
      return (<draggable
        onStart={start}
        onAdd={add}
        onUpdate={update}
        onRemove={remove}
        onEnd={end}
        className="drawing-board" list={this.drawingButtonList} animation={340} group="componentsButtonGroup">{formFields}</draggable>)
    },
    /**
     * 创建操作按钮组件
     * @param field
     */
    createButtonItem (field) {
      return (<a-button type="primary">{field.name}</a-button>)
    }
  },
  render () {
    return (<a-col span={24}>
      <a-form-item
        style="background: #f6f7ff;"
        label={ '表单按钮' }
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}>
        {this.parseButtonItems()}
      </a-form-item>
    </a-col>)
  }
}
