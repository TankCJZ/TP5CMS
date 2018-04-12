var InitFieldTables = function () {
    return {
        init: function () {
            //Datatable Initiating
            var oTable = $('#editabledatatable').dataTable({
                'paging': false,//分页
                'ordering': false,//是否启用排序
                "iDisplayLength": 50,//默认显示多少页
                "sPaginationType": "bootstrap",//分页样式
                "sDom": "Tflt<'row DTTTFooter'<'col-sm-6'i><'col-sm-6'p>>",
                "language": {
                    "search": "",
                    "sLengthMenu": "_MENU_",
                    "oPaginate": {
                        "sPrevious": "上一页",
                        "sNext": "下一页"
                    },
                    //下面三者构成了总体的左下角的内容。
                    'info': "总共_PAGES_ 页，显示第_START_ 到第 _END_ ，筛选之后得到 _TOTAL_ 条，初始_MAX_ 条 ",//左下角的信息显示，大写的词为关键字。
                    'infoEmpty': "0个模型",//筛选为空时左下角的显示。
                    'infoFiltered': ""//筛选之后的左下角筛选提示，
                },
                "aoColumns": [
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  { "bSortable": false }
                ]
            });

            var isEditing = null;

            $('#editabledatatable').on("click", 'a.field-del', function (e) {
                e.preventDefault();
                var fieldid = $(this).parents('tr').data('id');
                var nRow = $(this).parents('tr')[0];
                //询问框
                layer.confirm('你确定要删除该字段吗？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                    $.ajax({
                        url: '/admin/field/del/' + fieldid,
                        method: 'get',
                        dataType: 'json',
                        success: function(res){
                            layer.msg(res.msg,{icon: res.code});
                            //删除节点
                            if(res.code == '1') oTable.fnDeleteRow(nRow);
                        },
                        error: function(res){
                            console.log(res);
                            layer.msg('出现错误！',{icon:2});
                        }
                    });
                }, function(){
                    //取消删除
                    layer.msg('取消删除！');
                });
            });
        }
    };
}();