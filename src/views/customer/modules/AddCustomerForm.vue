<!--
 * @Author: yifei
 * @CreateTime: 2020-07-09 17:23:42
 * @Description:
 * @LastEditors: yifei
 * @LastEditTime: 2020-07-09 18:32:20
-->

<template>
  <a-modal
    :title="model && model.id > 0 ? '修改客户' : '新建客户'"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="model && model.id > 0" label="主键ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="客户姓名">
          <a-input v-decorator="['name', {rules: [{required: true, message: '请输入客户姓名'}]}]" />
        </a-form-item>
        <a-form-item label="联系电话">
          <a-input v-decorator="['phone', {rules: [{required: true, message: '请输入联系电话'}]}]" />
        </a-form-item>
        <a-form-item label="公司">
          <a-input v-decorator="['company']" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['name', 'phone', 'company', 'id']

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data () {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      form: this.$form.createForm(this)
    }
  },
  created () {
    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  }
}
</script>
