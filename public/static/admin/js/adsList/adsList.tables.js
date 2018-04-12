var AdsModel = function(){
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
                    { "data": 'title' },
                    { "data": 'img' },
                    { "data": 'create_time' },
                    { "data": 'id'}
                ],
                "columnDefs":[{
                    "render": function(data, type, row, meta) {
                        //渲染 
                        return '<img style="display:block;max-height:60px;width:auto;margin: 0 auto;" src="/public/upload/'+data+'" class="img-responsive">';
                    },
                    //指定是第2列
                    "targets": 2
                },{
                    "render": function(data, type, row, meta) {
                        //渲染 
                        return '<div class="btn-group"><a href="javascript:;" data-id="'+data+'" class="btn btn-info btn-xs edit"><i class="fa fa-edit"></i> 修改</a><a data-id="'+data+'" href="javascript:;" class="btn btn-danger btn-xs delete"><i class="fa fa-trash-o"></i> 删除</a></div>';
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
                area: 'auto',
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

        //重新加载数据
        reload: function(){
            this.Otable.ajax.reload();
        }
    };
}();
//初始化数据
AdsModel.init('#adstables','/admin/adsList/ajaxData/' + $('.ads_id').val());

//添加广告==============//
var addLayer = null;
$('.add-ads').on('click',function(){
    $('#add-ads-form input[type=text]').val('');
    AdsModel.openModel('#addAdsModel','添加广告',['415px','330px'],function(_layer){
        addLayer = _layer;
    });
});
$('.add-ads-btn').on('click',function(){
    var form = $('#addAdsModel').find('form').serialize();
    $.post('/admin/adsList/add',form,function(res){
        Common.showMsg(res,function(){
            layer.close(addLayer);
            AdsModel.reload();
        });
    });
});
//删除广告==============//
$('#adstables').on('click','a.delete',function(){
    var id = $(this).data('id');
    layer.confirm('你确定要删除？', {
        btn: ['确定','取消'] //按钮
    }, function(){
        AdsModel.delOne('/admin/adsList/del/'+id,function(res){
            Common.showMsg(res,function(){
                AdsModel.reload();
            });
        });
    });
});
//修改广告==============//
var editLayer = null;
$('#adstables').on('click','a.edit',function(){
    var id = $(this).data('id');
    $.get('/admin/adsList/edit/'+id,function(res){
        if(res.code == 1){
            //设置模型数据
            setModeVal(res.adsList);
        }else{
            layer.msg('获取板块信息失败!');
        }
    });
});
//提交修改
$('.edit-ads-btn').on('click',function(){
    var form = $('#editAdsModel #edit-ads-form').serialize();
    AdsModel.edit('/admin/adsList/edit',form,function(res){
        Common.showMsg(res,function(){
            layer.close(editLayer);
            AdsModel.reload();
        });
    });
});
//赋值
function setModeVal(data){
    //显示图片
    if( data.img.length >0 ) {
        $('#editAdsModel .upload-img').attr('src','/public/upload/'+data.img).addClass('show');
        $('#editAdsModel .upload-input').val(data.img);
        $('#editAdsModel .upload-cancel').removeClass('hide');
    }
    $('#editAdsModel .title').val(data.title);
    $('#editAdsModel .url').val(data.url);
    $('#editAdsModel .alt').val(data.alt);
    $('#editAdsModel #id').val(data.id);
    AdsModel.openModel('#editAdsModel','修改广告',['415px','auto'],function(_layer){
        editLayer = _layer;
    });
}

//上传图片
$('#thumb').bind('change',function(){
    var that = $(this);
    //上传
    FileUpload.upload('/admin/upload/uploadImg',that,function(err,res){
        if('err' == err){
            console.log('上传失败!');
        }else{
            layer.msg(res.msg,{icon:res.code},function(){
                if('1' == res.code){
                    $('#addAdsModel .upload-img').attr('src','/public/upload/'+res.url).addClass('show');
                    $('#addAdsModel .upload-input').val(res.url);
                    $('#addAdsModel .upload-cancel').removeClass('hide');
                }
            });
        }
    });
});
$('#thumb_edit').bind('change',function(){
    var that = $(this);
    //上传
    FileUpload.upload('/admin/upload/uploadImg',that,function(err,res){
        if('err' == err){
            console.log('上传失败!');
        }else{
            layer.msg(res.msg,{icon:res.code},function(){
                if('1' == res.code){
                    $('#editAdsModel .upload-img').attr('src','/public/upload/'+res.url).addClass('show');
                    $('#editAdsModel .upload-input').val(res.url);
                    $('#editAdsModel .upload-cancel').removeClass('hide');
                }
            });
        }
    });
});