var GroupModel = function(){
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
                    { "data": 'name' },
                    { "data": 'description' },
                    { "data": 'usernum'},
                    { "data": 'status'},
                    { "data": 'id'}
                ],
                "columnDefs":[{
                    "render": function(data, type, row, meta) {
                        //渲染 
                        var _html = null;
                        if(0 == data){
                            _html = '<div style="position: relative;"><label class="height20 margin-b0"><input data-id="'+row.id+'" checked="checked" class="checkbox-slider slider-icon disabled-member" type="checkbox" value="'+data+'" name="status"><span class="text"></span></label></div>';
                        }else if(1 == data){
                            _html = '<div style="position: relative;"><label class="height20 margin-b0"><input data-id="'+row.id+'" class="checkbox-slider slider-icon disabled-member" type="checkbox" value="1" name="status"><span class="text"></span></label></div>'; 
                        }
                        //渲染 
                        return _html;
                    },
                    //指定是第8列
                    "targets": 4
                },{
                    "render": function(data, type, row, meta) {
                        //渲染 
                        return '<div class="btn-group"><a href="javascript:;" data-id="'+data+'" class="btn btn-info btn-xs edit"><i class="fa fa-edit"></i> 修改</a><a data-id="'+data+'" href="javascript:;" class="btn btn-danger btn-xs delete"><i class="fa fa-trash-o"></i> 删除</a></div>';
                    },
                    //指定是第8列
                    "targets": 5
                }]
            });
        }, 
        
        openModel: function(modelID,title,size,callback){
            layer.open({
                type: 1,
                title: title,
                closeBtn: 1,
                area: size,
                skin: 'layui-layer-nobg', //没有背景色
                shadeClose: true,
                resize: true,
                content: $(modelID),
                success: function(layero,index){
                    callback(index);
                }
            });
        },

        //删除单个
        delOne: function(url,callback){
            $.getJSON(url,function(res){
                callback(res);
            });
        },

        //更新排序
        edit: function(url,data,callback){
            $.post(url,data,function(res){
                callback(res);
            });
        },

        //禁用
        disabled: function(url,bool,callback){
            var _url = null;
            if(bool){
                _url = url + '/0';
            }else{
                _url = url + '/1';
            }
            $.getJSON(_url,function(res){
                callback(res);
            });
        },

        //重新加载数据
        reload: function(){
            this.Otable.ajax.reload();
        }
    };
}();
//初始化数据
GroupModel.init('#adstables','/admin/member/getGroup');

//添加会员组==============//
var addLayer = null;
$('.add-group').on('click',function(){
    //清空数据
    $('#addGroupModel input[type=text],#addGroupModel textarea').val('');
    GroupModel.openModel('#addGroupModel','添加会员组',['415px','245px'],function(_layer){
        addLayer = _layer;
    });
});
//添加
$('.add-group-btn').on('click',function(){
    var form = $('#addGroupModel').find('form').serialize();
    //验证
    var name = $('#addGroupModel .name');
    if( !Validate.isGroup(name.val()) ){
        tips('名称格式不正确!为4-10位数，数字在字母下划线组合',name);
        return false;
    }
    $.post('/admin/member/addGroup',form,function(res){
        Common.showMsg(res,function(){
            if(res.code == 1) layer.close(addLayer);
            GroupModel.reload();
        });
    });
});
//删除会员组==============//
$('#adstables').on('click','a.delete',function(){
    var id = $(this).data('id');
    layer.confirm('你确定要删除该会员组吗？该组下的所有会员也将被删除', {
        btn: ['确定','取消'] //按钮
    }, function(){
        GroupModel.delOne('/admin/member/delGroup/'+id,function(res){
            Common.showMsg(res,function(){
                GroupModel.reload();
            });
        });
    });
});
//禁用状态==============//
$('#adstables').on('click','.disabled-member',function(){
    var that = $(this);
    var id = $(this).data('id');
    var bool = false;
    if(that.prop('checked')) bool = true;
    GroupModel.disabled('/admin/member/disabledGroup/'+id,bool,function(res){
        layer.msg(res.msg,function(){
            if( res.code == 0 ){
                that.prop('checked',!bool);
            }
        });
    });
});
//修改会员组==============//
var editLayer = null;
$('#adstables').on('click','a.edit',function(){
    var id = $(this).data('id');
    $.get('/admin/member/editGroup/'+id,function(res){
        if(res.code == 1){
            //设置模型数据
            setModeVal(res.group);
        }else{
            layer.msg(res.msg);
        }
    });
});
//提交修改
$('.edit-group-btn').on('click',function(){

    //验证
    var name = $('#editGroupModel .name');
    if( !Validate.isGroup(name.val()) ){
        tips('名称格式不正确!为4-10位数，数字在字母下划线组合',name);
        return false;
    }
    
    var form = $('#editGroupModel #edit-group-form').serialize();
    GroupModel.edit('/admin/member/editGroup',form,function(res){
        Common.showMsg(res,function(){
            if(res.code == 1) layer.close(editLayer);
            GroupModel.reload();
        });
    });
});
//赋值
function setModeVal(data){
    $('#editGroupModel .name').val(data.name);
    $('#editGroupModel .description').val(data.description);
    $('#editGroupModel .id').val(data.id);
    GroupModel.openModel('#editGroupModel','修改会员组信息',['415px','245px'],function(_layer){
        editLayer = _layer;
    });
}
function tips(msg,ele){
    layer.tips(msg, ele, {
        tips: 3
    });
}