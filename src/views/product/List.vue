<!--
 * @Author: yifei
 * @CreateTime: 2020-07-09 15:22:32
 * @Description:
 * @LastEditors: yifei
 * @LastEditTime: 2020-07-11 12:17:01
-->
<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="进价区间">
                <a-col :span="11">
                  <a-input-number
                    style="width: 100%;"
                    v-model="queryParam.minPurchasePrice"
                    :default-value="1000"
                    :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                  />
                </a-col>
                <a-col :span="2">
                  <div style="text-align: center;">至</div>
                </a-col>
                <a-col :span="11">
                  <a-input-number
                    style="width: 100%;"
                    v-model="queryParam.maxPurchasePrice"
                    :default-value="1000"
                    :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                  />
                </a-col>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="售价区间">
                <a-col :span="11">
                  <a-input-number
                    style="width: 100%;"
                    v-model="queryParam.minSellingPrice"
                    :default-value="1000"
                    :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                  />
                </a-col>
                <a-col :span="2">
                  <div style="text-align: center;">至</div>
                </a-col>
                <a-col :span="11">
                  <a-input-number
                    style="width: 100%;"
                    v-model="queryParam.maxSellingPrice"
                    :default-value="1000"
                    :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                  />
                </a-col>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="库存">
                <a-col :span="11">
                  <a-input-number style="width: 100%;" v-model="queryParam.minStock" />
                </a-col>
                <a-col :span="2">
                  <div style="text-align: center;">至</div>
                </a-col>
                <a-col :span="11">
                  <a-input-number style="width: 100%;" v-model="queryParam.maxStock" />
                </a-col>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="产品规格">
                <a-select
                  v-model="queryParam.size"
                  @change="$refs.table.refresh(true)"
                  mode="multiple"
                  placeholder="请选择产品规格"
                >
                  <a-select-option v-for="sText in sizeList" :key="sText">{{ sText }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="16" :sm="24">
              <a-form-item label="关键字">
                <a-input v-model="queryParam.key" placeholder="产品名称" />
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="{ float: 'right', overflow: 'hidden' } || {} "
              >
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
        <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1">
              <a-icon type="delete" />删除
            </a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作
            <a-icon type="down" />
          </a-button>
        </a-dropdown>-->
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record">{{ record.id }}</span>
        <span slot="company" slot-scope="text">
          <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">修改</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" @confirm="handleDel(record)">
              <a>删除</a>
            </a-popconfirm>
          </template>
        </span>
      </s-table>

      <add-product-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import lodash from 'lodash'
import AddProductForm from './modules/AddProductForm'

const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '产品名称',
    dataIndex: 'name',
    sorter: true
  },
  {
    title: '产品规格',
    dataIndex: 'size',
    sorter: true
  },
  {
    title: '进价',
    dataIndex: 'purchasePrice',
    sorter: true
  },
  {
    title: '售价',
    dataIndex: 'sellingPrice',
    sorter: true
  },
  {
    title: '库存',
    dataIndex: 'stock',
    sorter: true
  },
  {
    title: '更新时间',
    dataIndex: 'updatedTime',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'List',
  components: {
    STable,
    Ellipsis,
    AddProductForm
  },
  data () {
    this.columns = columns
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      sortField: '',
      sortOrder: '',
      // DB数据
      dbData: {
        data: []
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        const { sortField, sortOrder } = requestParameters
        this.sortField = sortField
        this.sortOrder = sortOrder
        const pageNo = parseInt(requestParameters.pageNo)
        const pageSize = parseInt(requestParameters.pageSize)
        const totalCount = this.tData.length
        const totalPage = Math.ceil(totalCount / pageSize)

        return new Promise((resolve, reject) => { resolve() }).then(() => {
          return {
            pageSize: pageSize,
            pageNo: pageNo,
            totalCount: totalCount,
            totalPage: totalPage,
            data: this.tData
          }
        })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
    if (window.utools) {
      let data = window.utools.db.get('product')
      if (!data) {
        window.utools.db.put({
          _id: 'product',
          data: []
        })
        data = window.utools.db.get('product')
      }
      this.dbData = data
    }
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    },

    sizeList () {
      const groupObj = lodash.groupBy(this.dbData.data, 'size')
      const keys = Object.keys(groupObj)
      return keys
    },

    // 筛选后的表格数据
    tData () {
      let data = [...this.dbData.data]
      const { key, minPurchasePrice, maxPurchasePrice, minSellingPrice, maxSellingPrice, minStock, maxStock, size } = this.queryParam
      const hasSort = this.sortField && this.sortOrder
      if (key) {
        data = data.filter(item => item.name.indexOf(key) > -1)
      }
      if (minPurchasePrice) {
        data = data.filter(item => item.purchasePrice >= minPurchasePrice)
      }
      if (maxPurchasePrice) {
        data = data.filter(item => item.purchasePrice <= maxPurchasePrice)
      }
      if (minSellingPrice) {
        data = data.filter(item => item.sellingPrice >= minSellingPrice)
      }
      if (maxSellingPrice) {
        data = data.filter(item => item.sellingPrice <= maxSellingPrice)
      }
      if (minStock) {
        data = data.filter(item => item.stock >= minStock)
      }
      if (maxStock) {
        data = data.filter(item => item.stock <= maxStock)
      }
      if (size && size.length > 0) {
        data = data.filter(item => size.indexOf(item.size) > -1)
      }
      if (hasSort) {
        data = lodash.orderBy(data, [this.sortField], [this.sortOrder === 'ascend' ? 'asc' : 'desc'])
      }
      return data
    }
  },
  methods: {
    handleAdd () {
      this.mdl = null
      this.visible = true
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          if (values.id > 0) {
            // 修改
            this.visible = false
            this.confirmLoading = false

            const updatedData = {
              ...values,
              updatedTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            }
            const index = lodash.findIndex(this.dbData.data, (item) => item.id === updatedData.id)
            this.$set(this.dbData.data, index, updatedData)

            if (window.utools) {
              window.utools.db.put(this.dbData)
            }

            // 重置表单数据
            form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()
            this.$message.info('修改成功')
          } else {
            // 新增
            this.visible = false
            this.confirmLoading = false

            var last = lodash.maxBy(this.dbData.data, 'id') || {}
            const pushData = {
              ...values,
              id: (last.id || 0) + 1,
              updatedTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            }
            this.dbData.data.push(pushData)

            if (window.utools) {
              window.utools.db.put(this.dbData)
            }
            // 重置表单数据
            form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()
            this.$message.info('新增成功')
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleDel (record) {
      // 删除已选中
      const selectedRowIndex = this.selectedRowKeys.indexOf(record.id)
      if (selectedRowIndex > -1) {
        this.selectedRowKeys.splice(selectedRowIndex, 1)
        this.selectedRows.splice(selectedRowIndex, 1)
      }
      // 删除表格数据
      const index = lodash.findIndex(this.dbData.data, (item) => item.id === record.id)
      this.dbData.data.splice(index, 1)
      if (window.utools) {
        window.utools.db.put(this.dbData)
      }
      // 刷新表格
      if (this.tData.length === 0) {
        this.resetSearchForm()
      } else {
        this.$refs.table.refresh()
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {}
      this.$refs.table.refresh()
    }
  }
}
</script>
