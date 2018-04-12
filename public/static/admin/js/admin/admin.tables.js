var AdminModel = function(){
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
                    { "data": 'username' },
                    { "data": 'group_name' },
                    { "data": 'lastloginip' },
                    { "data": 'lastlogintime' },
                    { "data": 'status' },
                    { "data": 'id' }
                ],
                "columnDefs":[{
                    "render": function(data, type, row, meta) {
                        
                        //转换时间格式
                        var time = new Date(data * 1000);
                        time = time.toLocaleString();
                        return time;
                    },
                    //指定是第4列
                    "targets": 4
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
                    "targets": 5
                },{
                    "render": function(data, type, row, meta) {
                        if(data == 1){
                            return '<div class="btn-group"><a data-id="'+data+'" href="javascript:;" class="btn btn-blue btn-xs edit"><i class="fa fa-edit"></i> 修改</a><a data-id="'+data+'" href="javascript:;" class="disabled btn btn-danger btn-xs delete"><i class="fa fa-trash-o"></i> 删除</a></div>';
                        }else{
                            return '<div class="btn-group"><a data-id="'+data+'" href="javascript:;" class="btn btn-blue btn-xs edit"><i class="fa fa-edit"></i> 修改</a><a data-id="'+data+'" href="javascript:;" class="btn btn-danger btn-xs delete"><i class="fa fa-trash-o"></i> 删除</a></div>';
                        }
                    },
                    //指定是第4列
                    "targets": 6
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
                    title: '添加管理员',
                    closeBtn: 1,
                    area: opts.modelSize,
                    skin: 'layui-layer-nobg', //没有背景色
                    shadeClose: true,
                    resize: false,
                    content: opts.modelEle,
                    success: opts.onModelOpenAfter
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
            $.get(url,data,function(res){
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
AdminModel.init('#admintables','/admin/admin/ajaxData');
//添加
AdminModel.add({
    url: '/admin/admin/add',
    modelEle: $('#addAdminModel'),
    modelSize: ['400px','420px'],
    clickEle: '.add-admin',
    submitEle: '.add-admin-btn',
    formEle: '#add-admin-form',
    onModelOpenAfter: function(){
        //清空表单数据
        $("#add-admin-form input[type=text]").val('');
        //获取管理员组并显示
        var groupEle = $('#addAdminModel #group_id');
        $.getJSON('/admin/admin/add',function(res){
            var _html = '';
            if(res.code > 0){
                if(res.groups.length > 0){
                    res.groups.forEach(function(ele) {
                        _html += '<option value="'+ele.id+'">'+ele.title+'</option>';
                    }, this);
                }
                groupEle.html(_html);
            }else{
                layer.msg(res.msg);
            }
        });
    },
    success: function(res){
        if(0 == res.code){
            layer.msg(res.msg);
        }else{
            layer.msg(res.msg,{icon:res.code},function(){
                if(res.code == 1){
                    layer.close(res.layer);
                    //添加成功,ajax重新加载数据
                    AdminModel.relaod();
                }
            });
        }
    }
});

//删除
$('table').on('click','a.delete',function(){
    var id = $(this).data('id');
    var title = $($(this).parents('tr').find('td')[1]).text();
    layer.confirm('你确定要删【'+title+'】管理员吗？', {
        btn: ['确定','取消'] //按钮
    },function(){
        AdminModel.del('/admin/admin/del',{id:id},function(res){
            layer.msg(res.msg,{icon:res.code},function(){
                AdminModel.relaod();
            });
        });
    });
});

//禁用
$('table').on('click','.disabled-group',function(){
    var that = this;
    var id = $(this).data('id');
    var bool = false;
    if($(this).prop('checked')) bool = true;

    AdminModel.disabled('/admin/admin/disabled/' + id,bool,function(res){
        if(0 == res.code){
            layer.msg(res.msg,function(){
                $(that).prop('checked',!bool);
            });
        }else{
            layer.msg(res.msg,{icon:res.code});
        }
    });
});


//修改
var ly = null;
$('table').on('click','.edit',function(){
    //ajax获取数据并设置
    var id = $(this).data('id');
    $.getJSON('/admin/admin/edit/' + id,function(res){
        if(res.code == 1){
            //清空input数据
            $('#editAdminModel input[type=text]').val('');
            setInputVal(res);
            openModel();
        }else{
            layer.msg(res.msg);
        }
    });

    function openModel(){
        ly = layer.open({
            type: 1,
            title: '修改管理员',
            closeBtn: 1,
            area: ['400px','420px'],
            skin: 'layui-layer-nobg', //没有背景色
            shadeClose: true,
            content: $('#editAdminModel')
        });
    }

    //设置Input值
    function setInputVal(res){
        $('#editAdminModel .username').val(res.admin.username);
        $('#editAdminModel .email').val(res.admin.email);
        $('#editAdminModel .id').val(res.admin.id);
        if(1 == res.admin.status){
            $('#editAdminModel .checked').prop('checked',true);
        }else{
            $('#editAdminModel .unchecked').prop('checked',true);
        }
        var _options = '';
        if(res.groups.length > 0){
            res.groups.forEach(function(ele){
                if(ele.checked){
                    _options += '<option selected="selected" value="'+ele.id+'">'+ele.title+'</option>';
                }else{
                    _options += '<option  value="'+ele.id+'">'+ele.title+'</option>';
                }
            }, this);
        }
        //设置管理员组
        $('#editAdminModel .group_id').html(_options);
    }

    
});
//ajax修改
$('.edit-admin-btn').on('click',function(){
    AdminModel.edit('/admin/admin/edit',$('#edit-admin-form').serialize(),function(res){
        console.log(res);
        if(0 == res.code){
            layer.msg(res.msg);
        }else{
            layer.msg(res.msg,{icon:res.code},function(){
                layer.close(ly);
                AdminModel.relaod();
            });
        }
    });
});