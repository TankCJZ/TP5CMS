var GroupModel = function(){
    this.table = null;
    return {
        //初始化数据
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
                    "zeroRecords": "没有数据！",
                    //下面三者构成了总体的左下角的内容。
                    'info': "总共_PAGES_ 页，显示第_START_ 到第 _END_ ，筛选之后得到 _TOTAL_ 条，初始_MAX_ 条 ",//左下角的信息显示，大写的词为关键字。
                    'infoEmpty': "0个数据",//筛选为空时左下角的显示。
                    'infoFiltered': ""//筛选之后的左下角筛选提示，
                },
                "columns": [
                    { "data": 'id'},
                    { "data": 'sort' },
                    { "data": 'title' },
                    { "data": 'status' },
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
                        var _html = null;
                        if(1 == data){
                            _html = '<div style="position: relative;"><label class="height20 margin-b0"><input data-id="'+row.id+'" checked="checked" class="checkbox-slider slider-icon disabled-group" type="checkbox" value="'+data+'" name="status"><span class="text"></span></label></div>';
                        }else if(0 == data){
                            _html = '<div style="position: relative;"><label class="height20 margin-b0"><input data-id="'+row.id+'" class="checkbox-slider slider-icon disabled-group" type="checkbox" value="0" name="status"><span class="text"></span></label></div>'; 
                        }
                        //渲染 
                        return _html;
                    },
                    //指定是第4列
                    "targets": 3
                },{
                    "render": function(data, type, row, meta) {
                        //渲染 
                        return '<div class="btn-group"><a data-id="'+data+'" href="javascript:;" class="btn btn-success btn-xs setRule"><i class="fa fa-cogs"></i> 配置权限</a><a data-id="'+data+'" href="javascript:;" class="btn btn-blue btn-xs edit"><i class="fa fa-edit"></i> 修改</a><a data-id="'+data+'" href="javascript:;" class="btn btn-danger btn-xs delete"><i class="fa fa-trash-o"></i> 删除</a></div>';
                    },
                    //指定是第4列
                    "targets": 4
                }]
            });
        },
        //添加
        add: function(opts){
            var addLayer = null;
            if(opts == undefined || '' == opts) layer.msg('opts未定义!');
            $(opts.clickEle).on('click',function(){
                    addLayer = layer.open({
                    type: 1,
                    title: '添加管理员组',
                    closeBtn: 1,
                    area: ['400px', '275px'],
                    skin: 'layui-layer-nobg', //没有背景色
                    shadeClose: true,
                    content: opts.modelEle
                });
            });
            $(opts.submitEle).on('click',function(){
                $.ajax({
                    url: opts.url,
                    method: 'post',
                    dataType: 'json',
                    data: $(opts.formEle).serialize(),
                    success: function(res){
                        res.layer = addLayer;
                        opts.success(res);
                    },
                    error: function(res){
                        console.log('add group error' + res);
                    }
                });
            });
        },
        //删除
        del: function(url,data,callback){
            $.post(url,data,function(res){
                callback(res);
            });
        },
        //重新加载数据
        relaod: function(){
            this.table.ajax.reload();
        },
        //排序
        sort: function(url,data,callback){
            $.post(url,data,function(res){
                callback(res);
            });
        },
        //禁用
        disabled: function(url,bool,callback){
            var _url = null;
            if(bool){
                _url = url + '/1';
            }else{
                _url = url + '/0';
            }
            $.getJSON(_url,function(res){
                callback(res);
            });
        },
        //修改
        edit: function(url,data,callback){
            $.post(url,data,function(res){
                callback(res);
            });
        }
    };
}();

//初始化数据
GroupModel.init('#editabledatatable','/admin/group/ajaxData');
//添加
GroupModel.add({
    url: '/admin/group/add',
    modelEle: $('#addGroupModel'),
    clickEle: '.group_add',
    submitEle: '.add-group-btn',
    formEle: '#add-group-form',
    success: function(res){
        if(0 == res.code){
            layer.msg(res.msg);
        }else{
            layer.msg(res.msg,{icon:res.code},function(){
                if(res.code == 1){
                    layer.close(res.layer);
                    //添加成功,ajax重新加载数据
                    GroupModel.relaod();
                }
            });
        }
    }
});

//删除
$('table').on('click','a.delete',function(){
    var id = $(this).data('id');
    var title = $($(this).parents('tr').find('td')[2]).text();
    layer.confirm('你确定要删【'+title+'】组吗？', {
        btn: ['确定','取消'] //按钮
    },function(){
        GroupModel.del('/admin/group/del',{id:id},function(res){
            layer.msg(res.msg,{icon:res.code},function(){
                GroupModel.relaod();
            });
        });
    });
});

//更新排序
$('.group_sort').on('click',function(){
    GroupModel.sort('/admin/group/sort',$('#group-sort-form').serialize(),function(res){
        layer.msg(res.msg,{icon:res.code},function(){
            GroupModel.relaod();
        });
    });
});

//禁用
$('table').on('click','.disabled-group',function(){
    var that = $(this);
    var id = $(this).data('id');
    var bool = false;
    if(that.prop('checked')) bool = true;

    GroupModel.disabled('/admin/group/disabled/' + id,bool,function(res){
        if(0 == res.code){
            layer.msg(res.msg,function(){
                that.prop('checked',!bool);
            });
        }else{
            layer.msg(res.msg,{icon:res.code});
        }
    });
});

//修改
$('table').on('click','.edit',function(){
    var id = $(this).data('id');
    var ly = null;
    ly = layer.open({
        type: 1,
        title: '修改管理员组',
        closeBtn: 1,
        area: ['400px', '275px'],
        skin: 'layui-layer-nobg', //没有背景色
        shadeClose: true,
        content: $('#editGroupModel'),
        success: function(){
            $.getJSON('/admin/group/edit/' + id,function(res){
                $('#title').val(res.title);
                $('#sort').val(res.sort);
                $('#group_id').val(res.id);
                if(1 == res.status){
                    $('.checked').prop('checked',true);
                }else{
                    $('.unchecked').prop('checked',true);
                }
            });
        }
    });
    //ajax修改
    $('.edit-group-btn').on('click',function(){
        GroupModel.edit('/admin/group/edit',$('#edit-group-form').serialize(),function(res){
            if(0 == res.code){
                layer.msg(res.msg);
            }else{
                layer.msg(res.msg,{icon:res.code},function(){
                    layer.close(ly);
                    GroupModel.relaod();
                });
            }
        });
    });
});

var setRuleLayerIndex = null;
//配置权限
$('table').on('click','.setRule',function(){
    var group_id = $(this).data('id') || '';
    $('#setRule .group_id').val(group_id);
    //显示
    setRuleLayerIndex = layer.open({
        type: 1,
        title: '设置权限',
        closeBtn: 1,
        area: ['290px', '400px'],
        skin: 'layui-layer-nobg', //没有背景色
        shadeClose: true,
        resize: false,
        content: $('#setRule'),
        success: function(){
            //获取权限
            getRule('/admin/group/getRule/' + group_id);
        }
    });
});

//获取rule
function getRule(url){
    //清空数据
    $('#ruleTree').data('jstree',false);
    //初始化
    $('#ruleTree').jstree({ 
        'core' : {
            'data' : getData(url)
        },
        'plugins':["checkbox"],
        'checkbox': {
            "three_state": false,
            "tie_selection": false
        }
    });
}

//ajax获取rule数据
function getData(url){
    var data = [];
    $.ajax({
        url: url,
        method: 'GET',
        async: false,
        dataType: 'json',
        success: function(res){
            console.log('---获取到所有rule---');
            console.log(res);
            if(1 == res.code){
                data = reorgnData(res.data);
            }
        }
    });
    return data;
}
//重组rule数组
function reorgnData(data){
    var arr = [];
    if(data.length>0){
        for(var i=0;i<data.length;i++){
            arr.push({'state':{checked:data[i].checked},'id':data[i].id,'parent':(data[i].pid==0?'#':data[i].pid),'text':data[i].title,'icon':'fa fa-folder palegreen'});
        }
    }
    return arr;
}

//设置权限
$('.setRule-btn').on('click',function(){
    //获取选择的rule id
    var rule_ids = $("#ruleTree").jstree("get_checked");
    var group_id = $('#setRule .group_id').val();
    rule_ids = rule_ids.join(',');
    //ajax设置权限
    $.post('/admin/group/setRule',{'id':rule_ids,'gid':group_id},function(res){
        if(0 == res.code){
            layer.msg(res.msg);
        }else{
            layer.msg(res.msg,{icon:res.code},function(){
                layer.close(setRuleLayerIndex);
                GroupModel.relaod();
            });
        }
    });
});