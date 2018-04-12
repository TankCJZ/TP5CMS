var CateModel = function(){
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
                    { "data": 'sort' },
                    { "data": 'catename' },
                    { "data": 'modelname' },
                    { "data": 'type' },
                    { "data": 'id'}
                ],
                "columnDefs":[{
                    "render": function(data, type, row, meta) {
                        //渲染 sort
                        return '<input type="text" style="width:45px;" class="form-control input-xs" name="'+row.id+'" value="'+data+'">';
                    },
                    //指定是第2列
                    "targets": 1
                },{
                    "render": function(data, type, row, meta) {
                        //渲染 sort
                        return row.html + '<input type="text" class="form-control catename input-xs" data-id="'+row.id+'" value="'+data+'">';
                    },
                    //指定是第3列
                    "targets": 2
                },{
                    "render": function(data, type, row, meta) {
                        if('单篇' == data){
                            return '<span class="text-primary">'+data+'</span>';
                        }else if('栏目' == data){
                            return '<span class="text-success">'+data+'</span>';
                        }else if('链接' == data){
                            return '<span class="text-danger">'+data+'</span>';
                        }
                        return data;
                    },
                    //指定是第2列
                    "targets": 4
                },{
                    "render": function(data, type, row, meta) {
                        //渲染 
                        return '<div class="btn-group"><a href="/admin/category/add/pid/'+data+'" class="btn btn-default btn-xs"><i class="fa fa-plus"></i> 添加子栏目</a><a href="/admin/category/edit/'+data+'" class="btn btn-info btn-xs"><i class="fa fa-edit"></i> 编辑</a><a href="/admin/category/del/'+data+'" data-id="'+data+'" class="btn btn-danger btn-xs delete"><i class="fa fa-trash-o"></i> 删除</a></div>';
                    },
                    //指定是第4列
                    "targets": 5
                }]
            });
        }, 

        //删除单个栏目
        delOne: function(url,data,callback){
            $.post(url,data,function(res){
                callback(res);
            });
        },

        //更新排序
        sort: function(url,data,callback){
            $.post(url,data,function(res){
                callback(res);
            });
        },

        //重新加载数据
        reload: function(){
            this.Otable.ajax.reload();
        }
    };
}();

//初始化
CateModel.init('#editabledatatable','/admin/category/getJson');

//删除
$('#editabledatatable').on("click", 'a.delete', function (e) {
    e.preventDefault();
    var id = $(this).data('id');
    //询问框
    layer.confirm('你确定要删除栏目吗？', {
        btn: ['确定','取消'] //按钮
    }, function(){
        //ajax成功
        CateModel.delOne('/admin/category/del',{id:id},function(res){
            console.log('--ajax del category--');
            if(res.code == 0){
                //失败
                layer.msg(res.msg);
            }else if(res.code == 1){
                //成功
                layer.msg(res.msg,{icon:res.code});
                CateModel.reload();
            }else{
                layer.msg(res.msg,{icon:res.code});  
            }
        });
    }, function(){
        //取消删除
        //layer.msg('取消删除！');
    });
});
//排序
$('.sort-cate-btn').on('click',function(e){
    e.preventDefault();
    var data = $('.sort-cate-form').serialize();
    CateModel.sort('/admin/category/sort',data,function(res){
        console.log(res);
        if(res.code == 1){
            layer.msg(res.msg,{icon:res.code});
            CateModel.reload();
        }else if( res.code == 0){
            layer.msg(res.msg);
        }else{
            layer.msg(res.msg,{icon:res.code});
        }
    });
});
//修名称
$('#editabledatatable tbody').on('focus','input.catename',function(e){
    e.preventDefault();
    var val = $(this).val();

    return $(this).one('blur',function(e){
        e.preventDefault();
        var that = $(this);
        var id = that.data('id');
        var catename = that.val();
        if( val === catename ) return false;
        $.post('/admin/category/setName',{id:id,catename:catename},function(res){
            if( res.code == 1 ){
                that.after('<span style="padding-left:10px;" class="text-success">'+res.msg+'</span>');
                that.val(catename);
            }else{
                that.after('<span style="padding-left:10px;" class="text-danger" >'+res.msg+'</span>');
            }
            setTimeout(function(){
                that.next().fadeOut().remove();
            },900);
        },'json');
    });
});
