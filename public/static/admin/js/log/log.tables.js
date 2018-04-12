var LogModel = function(){
    this.Otable = null;
    return {
        init: function(ele,url){
            this.Otable = $(ele).DataTable({
                'ajax': url,//获取ajax信息
                "aLengthMenu": [
                    [5, 10, 20, 50, 100, -1],
                    [5, 10, 20, 50, 100, "All"]
                ],
                'paging': true,//分页
                'ordering': false,//是否启用排序
                "iDisplayLength": 20,//默认显示多少页
                "sPaginationType": "bootstrap",//分页样式
                "sDom": "Tflt<'row DTTTFooter'<'col-sm-6'i><'col-sm-6'p>>",
                "language": {
                    "search": "",
                    "sLengthMenu": "_MENU_",
                    "oPaginate": {
                        "sPrevious": "上一页",
                        "sNext": "下一页"
                    },
                    "zeroRecords": "没有数据！",
                    //下面三者构成了总体的左下角的内容。
                    'info': "总共_PAGES_ 页，显示第_START_ 到第 _END_ ，筛选之后得到 _TOTAL_ 条，初始_MAX_ 条 ",//左下角的信息显示，大写的词为关键字。
                    'infoEmpty': "0个数据",//筛选为空时左下角的显示。
                    'infoFiltered': ""//筛选之后的左下角筛选提示，
                },
                "columns": [
                    { "data": 'id'},
                    { "data": 'model_name' },
                    { "data": 'rule' },
                    { "data": 'user_name' },
                    { "data": 'create_time' },
                    { "data": 'ip' }
                ],
                "columnDefs":[{
                    "render": function(data, type, row, meta) {
                        //渲染 
                        var time = new Date(data*1000);
                        time = time.toLocaleString();
                        return time;
                    },
                    //指定是第4列
                    "targets": 4
                }]
            });
        }, 
        
        //重新加载数据
        reload: function(){
            this.Otable.ajax.reload();
        }
    };
}();
//初始化数据
LogModel.init('#adstables','/admin/log/ajaxData');