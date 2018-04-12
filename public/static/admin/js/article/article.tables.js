//显示所有栏目===========//
$('#cateTree').jstree({ 'core' : {
    "multiple" : false,
    'data' : getCateJsonData('/admin/category/getJson')
} });

//获取栏目数据===========//
function getCateJsonData(url){
    var data = [];
    $.ajax({
        url: url,
        method: 'POST',
        async: false,
        dataType: 'json',
        success: function(res){
            console.log('---获取到所有栏目---');
            console.log(res);
            if(1 == res.code){
                data = reorgnData(res.data);
            }
        }
    });
    return data;
}
//重组栏目数组========//
function reorgnData(data){
    var arr = [];
    if(data.length>0){
        for(var i=0;i<data.length;i++){
            var _obj = {
                'id':data[i].id,
                'modelid':data[i].modelid,
                'parent':(data[i].pid==0?'#':data[i].pid),
                'text':data[i].catename,
                'icon':'fa fa-folder green',
                'type': 1,
            };
            if( '单篇' == data[i].type ){
               _obj.icon = 'fa fa-file-text orange'; 
               _obj.type = 2;
            }else if( '链接' == data[i].type ){
                _obj.icon = 'fa fa-link blue'; 
                _obj.type = 3;
            }
            arr.push(_obj);
        }
    }
    return arr;
}

//table初始化 显示文章的table===========//
var oTable = $('#editabledatatable').DataTable({
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
        "zeroRecords": "该分类下没有文章或者你还未选择分类！",
        //下面三者构成了总体的左下角的内容。
        'info': "总共_PAGES_ 页，显示第_START_ 到第 _END_ ，筛选之后得到 _TOTAL_ 条，初始_MAX_ 条 ",//左下角的信息显示，大写的词为关键字。
        'infoEmpty': "0篇文章",//筛选为空时左下角的显示。
        'infoFiltered': ""//筛选之后的左下角筛选提示，
    },
    "columns": [
        { "data": 'id'},
        { "data": 'listorder' },
        { "data": 'title' },
        { "data": 'id'}
    ],
    "columnDefs":[{
        "render": function(data, type, row, meta) {
            //渲染 把数据源中的标题和url组成超链接
            return '<label class="margin-b0"><input data-id="'+data+'" type="checkbox"><span class="text"></span></label>';
        },
        //指定是第1列
        "targets": 0
    },{
        "render": function(data, type, row, meta) {
            //渲染 把数据源中的标题和url组成超链接
            return '<input type="text" class="form-control" style="height:25px;width:50px;" name="'+row.id+'" value="'+data+'">';
        },
        //指定是第2列
        "targets": 1
    },{
        "render": function(data, type, row, meta) {
            //渲染 
            return '<div class="btn-group"><a data-id="'+data+'" href="javascript:;" class="btn btn-info btn-xs edit"><i class="fa fa-edit"></i> 修改</a><a data-id="'+data+'" href="javascript:;" class="btn btn-danger btn-xs delete"><i class="fa fa-trash-o"></i> 删除</a></div>';
        },
        //指定是第4列
        "targets": 3
    }]
});

//获取选中栏目获取对应的文章==========//
$('#cateTree').on('changed.jstree', function (e, data) {
    //获取选中栏目对象
    var sele = data.instance.get_node(data.selected);
    //获取模型id
    var modelid = sele.original.modelid;
    var catetype = sele.original.type;
    if( 1 !== catetype ){
        activeBtns('.ar-add,.ar-update,.ar-move,.ar-del',false);
        return false;
    }
    //获取栏目id
    var catid = sele.id;
    //设置栏目id
    $('.cateid').val(catid);
    //设置获取文章json接口
    var url = '/admin/article/getArticle/' + modelid +'/'+ catid;
    //ajax获取文章并刷新table文章列表
    oTable.ajax.url( url ).load(function(res){
        //输出服务器返回结果
        console.log('---获取到模型'+res.model.tablename+'所有文章---');
        console.log(res);
        //设置模型名
        $('.model_name').val(res.model.tablename);
        $('.modelid').val(res.model.id);
        //激活添加新闻按钮
        activeBtns('.ar-add',true);
        //设置新闻按钮的data-catid
        setBtnsData('.ar-add',catid);
        if(res.data.length>0){
            //存在数据激活更新移动删除按钮
            activeBtns('.ar-update,.ar-move,.ar-del',true);
        }else{
            //没有数据则禁用相关按钮
            activeBtns('.ar-update,.ar-move,.ar-del',false);  
        }
    });
});

//启用按钮组方法========//
function activeBtns(ele,flag){
    var btns = $(ele);
    if(btns){
        if(flag){
            btns.removeClass('disabled'); 
        }else{
            btns.addClass('disabled'); 
        }
    }
}

//给按钮重新设置data-catid方法=========//
function setBtnsData(ele,catid)
{
    var btns = $(ele);
    if(btns){
        btns.attr('data-catid',catid);
    }
}

//添加文章============//
$('.ar-add').on('click',function(){
    var catid = $(this).data('catid');
    window.location.href = '/admin/article/add/' + catid;
});

//点击删除文章-单个=========//
$('#editabledatatable').on("click", 'a.delete', function (e) {
    e.preventDefault();
    var _this = $(this);
    //询问框
    layer.confirm('你确定要删除文章吗？', {
        btn: ['确定','取消'] //按钮
    }, function(){
        //ajax删除成功
        var url = '/admin/article/del/'+$('.model_name').val()+'/' + _this.data('id');
        delArticle(url,function(){
            //删除成功回调方法
            //删除节点
            var nRow = _this.parents('tr')[0];
            removeTrs(nRow);
        });
    }, function(){
        //取消删除
        //layer.msg('已取消！');
    });
});

//批量删除=============//
$('.ar-del').on('click',function(){
    var trs = $('#editabledatatable tbody tr');
    var ids = [],trsCheked = [];

    //获取选中的文章ids和trs
    Array.from(trs).forEach(function(index){
        var checkBox = $(index).find('input[type=checkbox]');
        if(checkBox.prop('checked')){
            ids.push(checkBox.data('id'));
            trsCheked.push(index);
        }
    },this);
    //未选中
    if(trsCheked.length < 1){
        layer.msg('请选中需要删除的文章!');
        return false;
    }
    //询问是否删除
    layer.confirm('你确定要删除选中的文章吗？', {
        btn: ['确定','取消'] //按钮
    },function(){
        //删除
        var url = '/admin/article/del/'+$('.model_name').val()+'/' + ids.toString();
        delArticle(url,function(){
            //删除成功回调
            //删除节点
            removeTrs(trsCheked);
        });
    },function(){
        //取消删除
    });
});

//批量移动=============//
(function(){
    var ids = [],trsCheked = [],rlayer=null;
    $('.ar-move').on('click',function(){
        var trs = $('#editabledatatable tbody tr');

        //获取选中的文章ids和trs
        Array.from(trs).forEach(function(index){
            var checkBox = $(index).find('input[type=checkbox]');
            if(checkBox.prop('checked')){
                ids.push(checkBox.data('id'));
                trsCheked.push(index);
            }
        },this);
        //未选中
        if(trsCheked.length < 1){
            layer.msg('请选中需要移动的文章!');
            return false;
        }

        rlayer = layer.open({
            type: 1,
            title: '移动文章',
            closeBtn: 1,
            area: ['400px', '275px'],
            skin: 'layui-layer-nobg', //没有背景色
            shadeClose: true,
            content: $('#removeModel'),
            success: function(){
                var data = {
                    id: $('.cateid').val(),
                    modelid: $('.modelid').val()
                };
                $.get('/admin/category/getJson',data,function(res){
                    if(res.code == 1){
                        var _html = '';
                        res.data.forEach(function(ele) {
                            _html += '<div class="radio"><label><input value="'+ele.id+'" name="cid" type="radio"><span class="text">'+ele.catename+'</span></label></div>';
                        }, this);
                        $('#cates-lis').html(_html);
                    }else{
                        layer.msg(res.msg);
                    }
                });
            }
        });
        
    });

    //点击提交移动按钮===//
    $('#removeModel .remove-model-btn').on('click',function(){
        var url = '/admin/article/remove';
        //获取需要移动目标栏目id
        var cid = $('#removeModel input:checked').val();
        $.post(url,{cid:cid,aids:ids.toString(),table:$('.model_name').val()},function(res){
            if( res.code == 1 ){
                layer.msg(res.msg,{icon:res.code},function(){
                   layer.close(rlayer);
                   oTable.ajax.reload();
                   trsCheked = [];
                   ids = [];
                });
            }else{
                layer.msg(res.msg);
            }
        });
    });
})();


//更新排序============//
$('.ar-update').on('click',function(){
    var sort_form = $('.sort-form').serializeArray();
    sort_form.shift();
    sort_form.push({'name':'tablename','value':$('.model_name').val()});
    var param = $.param(sort_form);
    $.post('/admin/article/sort',param,function(res){
        layer.msg(res.msg,{icon:res.code},function(){
            //重载数据
            oTable.ajax.reload();
        });
    });
});

//修改文章=================//
$('#editabledatatable').on('click','a.edit',function(){
    var tablename = $('.model_name').val();
    var modelid = $('.modelid').val();
    var id = $(this).data('id');
    window.location.href = '/admin/article/edit/' + tablename + '/' + modelid +'/'+ id;
});

//ajax删除文章=============//
function delArticle(url,callback){
    $.getJSON(url,function(res){
        console.log('删除文章操作!');
        layer.msg(res.msg,{icon:res.code});
        if(res.code == 1){
            callback();
        }
    });
}

//删除节点并重绘================//
function removeTrs(trs){
    oTable.row(trs).remove().draw();
}

//全选|取消全选=================//
$('#editabledatatable thead').on('click','input[type=checkbox]',function(){
    var bodyCks = $('#editabledatatable tbody input[type=checkbox]');
    if($(this).prop('checked')){
        bodyCks.prop('checked','checked');
    }else{
        bodyCks.prop('checked','');
    }
});