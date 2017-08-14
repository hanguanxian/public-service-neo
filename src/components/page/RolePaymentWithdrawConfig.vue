<template>
<div class="table">
  <!-- 搜索区域开始 -->
  <base-form :child-form-items="baseFormConfig.columns"
             :child-form-options="baseFormConfig.options"
             @submitCallBack="formCallBack">
  </base-form>

</div>
</template>

<script>

import BaseForm from  "./BaseForm.vue"
export default {
  data() {
    const self = this;
    return {
        // baseFormConfig 页面展示字段配置
        //   name 页面字段显示的label文字
        //   key  取值的key
        //   insearch 是否在搜索框出现
        //   inDialog 是否在弹出页面显示
        //   type 字段输入时的类型 默认inpute  目前有 date select editor inpute
        //   selectOptions 当type 为select的时候 option的枚举值
        //   tableActions 表格里面的操作按钮以及事件
        //   dialogActions 弹出框里面的操作按钮以及事件
      baseFormConfig: {
        columns: [{
          name: '活动ID',
          inSearch: true,
          key: 'actAutoId'
        }, {
          name: '活动名称',
          inDialog: true,
          inSearch: true,
          key: 'actName'
        }, {
          name: '加息标签',
          inDialog: true,
          key: 'appendLable'
        }, {
          name: '加息年利率(%)',
          inDialog: true,
          key: 'appendYearRate'
        }, {
          name: '加息天利率(%)',
          inDialog: true,
          key: 'appendDayRate'
        }, {
          name: '加息有效天数',
          inDialog: true,
          key: 'appendDayCount'
        }, {
          name: '有效期开始',
          inDialog: true,
          type: "date",
          rules: { type: 'date', required: true, message: '必填', trigger: 'blur'},
          key: 'beginDate'
        }, {
          name: '有效期截止',
          inDialog: true,
          type: "date",
          rules: { type: 'date', required: true, message: '必填', trigger: 'blur'},
          key: 'endDate'
        }, {
          name: '是否上架',
          inSearch: true,
          type: 'select',
          selectOptions: [{
            label: "是",
            value: "1"
          }, {
            label: "否",
            value: "0"
          }],
          key: 'isOnsale'
        }, {
          name: '产品上限期限',
          inDialog: true,
          key: 'termUpperLimit'
        }, {
          name: '产品下限期限',
          inDialog: true,
          key: 'termLowerLimit'
        }, {
          name: '起购金额上限',
          inDialog: true,
          key: 'amountUpperLimit'
        }, {
          name: '起购金额下限',
          inDialog: true,
          key: 'amountLowerLimit'
        }, {
          name: '备注',
          inDialog: true,
          type: "editor",
          key: 'remark'
        }, {
          name: '创建时间',
          key: 'createTime'
        }],
        options: {
            defaultRules: { required: true, message: '必填', trigger: 'blur'},//表单默认校验规则
            submitUrl: "/interface/act/add_act_vip_append.do", //新建的链接
            formClass: 'query-form',//向表单添加样式
            labelWidth: "130px",
            inline: true,//是否内联
            submitName: '提交'//提交按钮文字
        }
      }
    }
  },
  components: {
    BaseForm
  },
  methods: {
      formCallBack(res){
          console.log(res);
      }
  }
}
</script>
