var RuleModel = function(){
    this.table = null;
    return {
        init: function(ele,url){
            this.table = $(ele).DataTable({
                'ajax': url,//获取规则信息
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
                    "zeroRecords": "该分类下没有文章！",
                    //下面三者构成了总体的左下角的内容。
                    'info': "总共_PAGES_ 页，显示第_START_ 到第 _END_ ，筛选之后得到 _TOTAL_ 条，初始_MAX_ 条 ",//左下角的信息显示，大写的词为关键字。
                    'infoEmpty': "0个数据",//筛选为空时左下角的显示。
                    'infoFiltered': ""//筛选之后的左下角筛选提示，
                },
                "columns": [
                    { "data": 'id'},
                    { "data": 'sort' },
                    { "data": 'title' },
                    { "data": 'name' },
                    { "data": 'id'}
                ],
                "columnDefs":[{
                    "render": function(data, type, row, meta) {
                        //渲染 把数据源中的标题和url组成超链接
                        return '<input type="text" class="form-control" style="height:25px;width:50px;" name="'+row.id+'" value="'+data+'">';
                    },
                    //指定是第2列
                    "targets": 1
                },{
                    "render": function(data, type, row, meta) {
                       return row.html + data;
                    },
                    //指定是第3列
                    "targets": 2
                },{
                    "render": function(data, type, row, meta) {
                        if(row.pid == 0){
                            var _html = '<div class="btn-group"><a data-pid="'+row.pid+'" data-id="'+data+'" href="javascript:;" class="btn btn-success btn-xs add_sub"><i class="fa fa-plus"></i> 添加权限</a><a data-id="'+data+'" href="javascript:;" class="btn btn-danger btn-xs delete"><i class="fa fa-trash-o"></i> 删除</a></div>';
                        }else{
                            var _html = '<div class="btn-group"><a data-pid="'+row.pid+'" data-id="'+data+'" href="javascript:;" class="disabled btn btn-success btn-xs add_sub"><i class="fa fa-plus"></i> 添加权限</a><a data-id="'+data+'" href="javascript:;" class="btn btn-danger btn-xs delete"><i class="fa fa-trash-o"></i> 删除</a></div>';
                        }
                        
                        //渲染 
                        return _html;
                    },
                    //指定是第4列
                    "targets": 4
                }]
            });
        },

        add: function(opts){
            if(opts == undefined || '' == opts) layer.msg('opts未定义!');
            $('.page-body').on('click',opts.clickEle,function(e){
                e.preventDefault();
                var id = $(this).data('id');
                //清空input 的value
                $('#addRuleModel input,#addRuleModel textarea').val('');
                layer.open({
                    type: 1,
                    title: '添加权限',
                    closeBtn: 1,
                    area: ['400px', '375px'],
                    skin: 'layui-layer-nobg', //没有背景色
                    shadeClose: true,
                    content: opts.modelEle,
                    success: function(){
                        //获取分组并显示
                        $.getJSON('/admin/rule/getRuleGroup',function(res){
                            var _opts = '';
                            res.forEach(function(ele) {
                                if(ele.id == id){
                                    _opts += '<option selected value="'+ele.id+'">'+ele.title+'</option>';
                                }else{
                                    _opts += '<option value="'+ele.id+'">'+ele.title+'</option>';
                                }
                            }, this);
                            $('#rule_pid').html(_opts);
                        });
                    }
                });
            });
            $(opts.submitEle).on('click',function(){
                $.ajax({
                    url: opts.url,
                    method: 'post',
                    dataType: 'json',
                    data: $(opts.formEle).serialize(),
                    success: function(res){
                        opts.success(res);
                    },
                    error: function(res){
                        console.log('add rule error' + res);
                    }
                });
            });
        },

        del: function(url,data,callback){
            $.post(url,data,function(res){
                callback(res);
            });
        },

        relaod: function(){
            this.table.ajax.reload();
        },

        sort: function(url,data,callback){
            $.post(url,data,function(res){
                callback(res);
            });
        }
    };
}();

//初始化数据
RuleModel.init('#editabledatatable','/admin/rule/ajaxData');
//添加权限
RuleModel.add({
    url: '/admin/rule/add',
    modelEle: $('#addRuleModel'),
    clickEle: '.rule_add,.add_sub',
    submitEle: '.add-rule-btn',
    formEle: '#add-rule-form',
    success: function(res){
        layer.msg(res.msg,{icon:res.code},function(){
            if(res.code == 1){
                //添加成功,ajax重新加载数据
                RuleModel.relaod();
            }
        });
    }
});

//删除权限
$('table').on('click','a.delete',function(){
    var id = $(this).data('id');
    var title = $($(this).parents('tr').find('td')[2]).text();
    layer.confirm('你确定要删除规则【'+title+'】吗？', {
        btn: ['确定','取消'] //按钮
    },function(){
        RuleModel.del('/admin/rule/del',{id:id},function(res){
            layer.msg(res.msg,{icon:res.code},function(){
                RuleModel.relaod();
            });
        });
    });
});
//更新排序
$('.rule_sort').on('click',function(){
    RuleModel.sort('/admin/rule/sort',$('#rule-sort-form').serialize(),function(res){
        layer.msg(res.msg,{icon:res.code},function(){
            RuleModel.relaod();
        });
    });
});
//添加分组
var groupLayer = null;
$('.rule_add_group').on('click',function(){
    //清空input 的value
    $('#addGroupModel input,#addGroupModel textarea').val('');
    groupLayer = layer.open({
        type: 1,
        title: '添加分组',
        closeBtn: 1,
        area: ['400px', '278px'],
        skin: 'layui-layer-nobg', //没有背景色
        shadeClose: true,
        content: $('#addGroupModel')
    });
    
});
$('.add-group-btn').on('click',function(){
    $.post('/admin/rule/addGroup',$('#add-group-form').serialize(),function(res){
        console.log(res); 
        if(0 ==  res.code){
            layer.msg(res.msg);
        }else{
            layer.msg(res.msg,{icon:res.code},function(){
                layer.close(groupLayer);
                RuleModel.relaod();
            });
        }
    });
});