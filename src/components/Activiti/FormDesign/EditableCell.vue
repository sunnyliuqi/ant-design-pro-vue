<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <a-input :value="value" @change="handleChange" @pressEnter="checkSuccess" /><a-icon
        type="check"
        class="editable-cell-icon-check"
        @click="save"
      />
    </div>
    <div v-else class="editable-cell-text-wrapper">
      {{ value || ' ' }}
      <a-icon type="edit" class="editable-cell-icon" @click="edit" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditableCell',
  props: {
    text: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: undefined
    }
  },
  data () {
    return {
      value: this.text,
      oldValue: this.text,
      editable: false
    }
  },
  methods: {
    handleChange (e) {
      const value = e.target.value
      if (!this.checkSuccess(value)) {
        this.$message.warn('选项值已经存在，请重新输入', 1)
      }
      this.value = value
    },
    checkSuccess (value) {
      if (this.oldValue === value) {
        return true
      }
      if (this.list) {
        const error = this.list.find(item => item.value === value)
        if (error) {
          return false
        } else {
          return true
        }
      }
    },
    save () {
      if (this.checkSuccess(this.value)) {
        this.editable = false
        this.$emit('change', this.value)
      } else {
        this.$message.warn('选项值已经存在，请重新输入')
      }
    },
    edit () {
      this.editable = true
      this.oldValue = this.value
    }
  }
}
</script>

<style lang="less" scoped>
  .editable-cell {
    position: relative;
  }

  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    line-height: 18px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell:hover .editable-cell-icon {
    display: inline-block;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
</style>
