<!--
 * @Author: yifei
 * @CreateTime: 2020-07-09 17:23:42
 * @Description:
 * @LastEditors: yifei
 * @LastEditTime: 2020-07-11 11:53:40
-->

<template>
  <a-modal
    :title="model && model.id > 0 ? '修改产品' : '新建产品'"
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
        <a-form-item label="产品名称">
          <a-input v-decorator="['name', {rules: [{required: true, message: '请输入产品名称'}]}]" />
        </a-form-item>
        <a-form-item label="产品规格">
          <a-input v-decorator="['size', {rules: [{required: true, message: '请输入产品规格'}]}]" />
        </a-form-item>
        <a-form-item label="进价">
          <a-input-number
            style="width: 100%;"
            :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
            v-decorator="['purchasePrice', {rules: [{required: true, message: '请输入进价'}]}]"
          />
        </a-form-item>
        <a-form-item label="售价">
          <a-input-number
            style="width: 100%;"
            :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
            v-decorator="['sellingPrice', {rules: [{required: true, message: '请输入售价'}]}]"
          />
        </a-form-item>
        <a-form-item label="库存">
          <a-input-number
            style="width: 100%;"
            v-decorator="['stock', {rules: [{required: true, message: '请输入库存'}]}]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['name', 'size', 'purchasePrice', 'sellingPrice', 'stock', 'id']

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
