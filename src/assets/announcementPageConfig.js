module.exports = {
  tableColumns: [
    {
      name: '公告ID',
      width: "180px",
      key: 'announcementId'
    }, {
      name: '所属项目',
      key: 'projectName'
    }, {
      name: '推送位置',
      key: 'positionNames'
    }, {
      name: '公告标题',
      type: 'richText',
      key: 'announcementName'
    }, {
      name: '公告内容',
      type: 'richText',
      key: 'announcementContent'
    }, {
      name: '公告日期',
      type: 'date',
      key: 'announcementDate'
    }, {
      name: '是否启用',
      type: 'boolean',
      boolName: ['是','否'],
      key: 'isEnable'
    }, {
      name: '备注',
      type: 'richText',
      key: 'remark'
    }
  ],
  searchItems:[
          {name: '公告ID',placeholder: '公告ID',key: 'announcementId'},
          {name: '所属项目',placeholder: '所属项目', key: 'projectId',type: 'select',
          // relative: 'positionCodes',
          // event(value) {
          //   self.positionSelectList(value,self.searchForm.items[2]);
          // },
          selectOptions: []},
          {name: '推送位置',placeholder: '推送位置', key: 'positionCodes',type: 'select',
          selectOptions: []},
          {name: '公告标题',placeholder: '公告标题', key: 'announcementName'}
        ],
  dialogItems:[
    {name: '所属项目',placeholder: '所属项目', key: 'projectId',type: 'select',relativeType: 'multipleSelect'
    // ,relative: 'positionCodes',
    // event(value) {
    //   self.positionSelectList(value,self.dialogForm.items[1]);
    // }
    },
    {name: '推送位置',placeholder: '推送位置', key: 'positionCodes',type: 'select',
    selectOptions: []}, {
      name: '公告标题',
      key: 'announcementName'
    }, {
      name: '公告内容',
      type: 'textarea',
      row: 4,
      key: 'announcementContent'
    }, {
      name: '公告日期',
      type: 'date',
      rules: {type: 'date',required: true,message: '必填',trigger: 'blur'},
      key: 'announcementDate'
    }, {
      name: '备注',
      type: 'textarea',
      rules: {required: false},
      key: 'remark'
    }
  ]
}
