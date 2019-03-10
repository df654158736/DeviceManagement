const menuList = [
{
  title: '基本信息',
  key: "/base",
  children: [{
    title: '商品管理',
    key: "/base/goods"
  }, {
    title: '销售厅管理',
    key: "/base/departments"
  }]
},
{
  title: '入库管理',
  key: "/in",
  children: [{
    title: '入库管理',
    key: "/in/management"
  }, {
    title: '入库统计',
    key: "/in/statistics"
  }]
},
{
  title: '出库管理',
  key: "/out",
  children: [{
    title: '出库管理',
    key: "/out/management"
  }, {
    title: '出库统计',
    key: "/out/statistics"
  }]
},
{
  title: '收货管理',
  key: "/receiving",
  children: [{
    title: '收货管理',
    key: "/receiving/management"
  }, {
    title: '收货统计',
    key: "/receiving/statistics"
  }]
},
{
  title: '退货管理',
  key: "/return",
  children: [{
    title: '退货管理',
    key: "/return/management"
  }, {
    title: '退货统计',
    key: "/return/statistics"
  }]
},

];

export default menuList;