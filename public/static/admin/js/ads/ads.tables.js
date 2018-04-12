var PlateModel = function(){
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
                    { "data": 'create_time' },
                    { "data": 'id'}
                ],
                "columnDefs":[{
                    "render": function(data, type, row, meta) {
                        //渲染 
                        return '<div class="btn-group"><a href="/admin/adsList/add/'+data+'" class="btn btn-success btn-xs"><i class="fa fa-plus"></i> 添加广告</a><a href="/admin/adsList/index/'+data+'" class="btn btn-default btn-xs"><i class="fa fa-plus"></i> 广告列表</a><a href="javascript:;" data-id="'+data+'" class="btn btn-info btn-xs edit"><i class="fa fa-edit"></i> 修改</a><a data-id="'+data+'" href="javascript:;" class="btn btn-danger btn-xs delete"><i class="fa fa-trash-o"></i> 删除</a></div>';
                    },
                    //指定是第4列
                    "targets": 4
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

        //删除单个栏目
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

        //重新加载数据
        reload: function(){
            this.Otable.ajax.reload();
        }
    };
}();
//初始化数据
PlateModel.init('#adstables','/admin/ads/ajaxData');

//添加板块==============//
var addLayer = null;
$('.add-plate').on('click',function(){
    $('#addPlateModel input,#addPlateModel textarea').val('');
    PlateModel.openModel('#addPlateModel','添加板块',['380px','250px'],function(_layer){
        addLayer = _layer;
    });
});
$('.add-plate-btn').on('click',function(){
    var form = $('#addPlateModel').find('form').serialize();
    $.post('/admin/ads/add',form,function(res){
        Common.showMsg(res,function(){
            layer.close(addLayer);
            PlateModel.reload();
        });
    });
});
//删除板块==============//
$('#adstables').on('click','a.delete',function(){
    var id = $(this).data('id');
    layer.confirm('你确定要删除？该板块下的所有广告也会被删除!', {
        btn: ['确定','取消'] //按钮
    }, function(){
        PlateModel.delOne('/admin/ads/del/'+id,function(res){
            Common.showMsg(res,function(){
                PlateModel.reload();
            });
        });
    });
});
//修改板块==============//
var editLayer = null;
$('#adstables').on('click','a.edit',function(){
    $('#editPlateModel input,#editPlateModel textarea').val('');
    var id = $(this).data('id');
    $.get('/admin/ads/edit/'+id,function(res){
        if(res.code == 1){
            //设置模型数据
            setModeVal(res.ads);
        }else{
            layer.msg(res.msg);
        }
    });
});
//提交修改
$('.edit-plate-btn').on('click',function(){
    var form = $('#editPlateModel #edit-plate-form').serialize();
    PlateModel.edit('/admin/ads/edit',form,function(res){
        Common.showMsg(res,function(){
            layer.close(editLayer);
            PlateModel.reload();
        });
    });
});
//赋值
function setModeVal(data){
    $('#editPlateModel .name').val(data.name);
    $('#editPlateModel #id').val(data.id);
    $('#editPlateModel .desc').val(data.description);
    PlateModel.openModel('#editPlateModel','修改板块',['380px','250px'],function(_layer){
        editLayer = _layer;
    });
}