//模型管理
var ModeModel = function () {
    this.Otable = null;
    return {
        init: function (ele,url) {
            //Datatable Initiating
            this.Otable = $(ele).DataTable({
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
                    { "data": 'name' },
                    { "data": 'tablename' },
                    { "data": 'disabled' },
                    { "data": 'id'}
                ],
                "columnDefs":[{
                    "render": function(data, type, row, meta) {
                        var _html = null;
                        if(0 == data){
                            _html = '<div style="position: relative;"><label class="height20 margin-b0"><input data-id="'+row.id+'" checked="checked" class="checkbox-slider slider-icon disabled-model" type="checkbox" value="'+data+'" name="status"><span class="text"></span></label></div>';
                        }else if(1 == data){
                            _html = '<div style="position: relative;"><label class="height20 margin-b0"><input data-id="'+row.id+'" class="checkbox-slider slider-icon disabled-model" type="checkbox" value="0" name="status"><span class="text"></span></label></div>'; 
                        }
                        //渲染 
                        return _html;
                    },
                    //指定是第4列
                    "targets": 3
                },{
                    "render": function(data, type, row, meta) {
                        //渲染 
                        return '<div class="btn-group"><a href=javascript:redirect("/admin/field/index/'+data+'") class="btn btn-default btn-xs"><i class="fa fa-list"></i> 字段管理</a><a data-id="'+data+'" href="javascript:;" class="edit-model btn btn-info btn-xs"><i class="fa fa-edit"></i> 修改</a><a data-id="'+data+'" href="javascript:;" class="del-model btn btn-danger btn-xs"><i class="fa fa-trash-o"></i> 删除</a></div>';
                    },
                    //指定是第4列
                    "targets": 4
                }]
                
            });
        },

        //添加
        add: function(url,data,callback){
            $.post(url,data,function(res){
                callback(res);
            });
        },

        //删除
        del: function(url,data,callback){
            $.get(url,data,function(res){
                callback(res);
            });
        },

        //重新加载数据
        reload: function(){
            this.Otable.ajax.reload();
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

//初始化
ModeModel.init('#editabledatatable','/admin/modeler/ajaxData');
//添加
var addLayer = null;
$('.add-model').on('click',function(){
    addLayer = layer.open({
        type: 1,
        title: '添加模型',
        resize: false,
        closeBtn: 1, //不显示关闭按钮
        area: ['430px','auto'],
        anim: 2,
        content: $('#addModel'),
        success: function(){
           $('#addModel input[type=text]').val(''); 
        }
    });
    
});
//添加模型事件
$('.add-model-btn').click(function(){
    var flag = Validate.require('#add-model-form');
    if(!flag) return false;
    ModeModel.add('/admin/modeler/add',$('#add-model-form').serialize(),function(res){
        if(res.code == 0){
            layer.msg(res.msg);
        }else{
            layer.msg(res.msg,{icon:res.code},function(){
                if(1 == res.code){
                    layer.close(addLayer);
                    ModeModel.reload();
                    addLayer = null;
                }
            });
        }
    });
});
//删除
$('#editabledatatable').on("click", 'a.del-model', function (e) {
    e.preventDefault();
    var id = $(this).data('id');
    //询问框
    layer.confirm('你确定要删除该模型吗？', {
        btn: ['确定','取消'] //按钮
    }, function(){
        ModeModel.del('/admin/modeler/del/' + id,'',function(res){
            if(res.code == 0){
                layer.msg(res.msg);
            }else{
                layer.msg(res.msg,{icon:res.code});
            }
            ModeModel.reload();
        });
    }, function(){
        //取消删除
        layer.msg('取消删除！');
    });
});
//修改模型
var editLayer = null;
$('#editabledatatable').on('click','.edit-model',function(){
    var id = $(this).data('id');
    editLayer = layer.open({
        type: 1,
        title: '修改模型',
        resize: false,
        closeBtn: 1, //不显示关闭按钮
        area: ['430px','auto'],
        anim: 2,
        content: $('#editModel'),
        success: function(){
            $.getJSON('/admin/modeler/edit/' + id,function(res){
                if(res.code == 1){
                    setInputVal(res);
                }else{
                    layer.msg(res.msg);
                }
            });
        }
    });
    
});
function setInputVal(res){
    $('#edit-model-form input[type=text]').val('');
    //赋值
    $data = res.mode;
    $('#edit-model-form #name').val($data.name);
    $('#edit-model-form #tablename').val($data.tablename);
    $('#edit-model-form #description').val($data.description);
    $('#edit-model-form #model_id').val($data.id);
}
//修改模型事件
$('.edit-model-btn').click(function(){
    var flag = Validate.require('#edit-model-form');
    if(!flag) return false;
    //ajax修改
    ModeModel.edit('/admin/modeler/edit',$('#edit-model-form').serialize(),function(res){
        if(res.code == 0){
            layer.msg(res.msg);
        }else{
            layer.msg(res.msg,{icon:res.code},function(){
                if(1 == res.code){
                    layer.close(editLayer);
                    ModeModel.reload();
                    editLayer = null;
                }
            });
        }
    });
});
//禁用
$('#editabledatatable').on('click','.disabled-model',function(){
    if($(this).prop('checked')){
        var flag = false;//开启
    }else{
        var flag = true;//禁用
    }
    var id = $(this).data('id');
    ModeModel.disabled('/admin/modeler/disabled/'+id,flag,function(res){
        layer.msg(res.msg);
        ModeModel.reload();
    });
});