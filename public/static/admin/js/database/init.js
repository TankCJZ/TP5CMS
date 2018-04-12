//全选|取消全选
$('#adstables thead').on('click','input[type=checkbox]',function(){
    var bodyCks = $('#adstables tbody input[type=checkbox]');
    if($(this).prop('checked')){
        bodyCks.prop('checked','checked');
    }else{
        bodyCks.prop('checked','');
    }
});
//定义变量
var tables = [],cksObj = [];
function setChecksTables(msg){
    //获取选中的checkbox
    var checkboxs = $('#adstables tbody input[type=checkbox]:checked');
    Array.from(checkboxs).forEach(function(ele){
        var dom = $(ele);
        tables.push(dom.val());
        cksObj.push(dom);
    },this);
    if( tables.length < 1){
        layer.msg(msg);
        return false;
    }
    return true;
}

//备份表====////
$('a.database-backup').on('click',function(){
    var flag = setChecksTables('请选择要备份的表');
    if(!flag) return false;
    //开始备份
    var databack_url = '/admin/database/export'
    Database.back_init(databack_url,tables,function(res){
        if(res.code == 1){
            //初始化成功，开始备份
            (function start(index){
                if( index >= cksObj.length){
                    layer.msg('备份完成!',{icon:1},function(){
                        window.location.reload();
                    });
                    return false;
                }
                Database.back_start(databack_url,index,0,function(res){
                    //显示状态
                    Database.status(cksObj[index],res.msg);
                    //继续下一个
                    start(index+1);
                });
            })(0);
        }else{
            layer.msg(res.msg);
        }
    });
});

//修复表====////
$('a.database-repair').on('click',function(){
    if(!setChecksTables('请选择要修复的表')){
        return false;
    }
    var url = '/admin/database/repair';
    Database.repair(url,tables,function(res){
        layer.msg(res.msg,{icon:res.code},function(){
            window.location.reload();
        });
    });
});

//优化表====////
$('a.database-optimize').on('click',function(){
    if(!setChecksTables('请选择要优化的表')){
        return false;
    }
    var url = '/admin/database/optimize';
    Database.optimize(url,tables,function(res){
        layer.msg(res.msg,{icon:res.code},function(){
            window.location.reload();
        });
    });
});
//表模型
var Database = function(){
    return {
        back_init: function(url,tables,callback){
            $.post(url,{tables:tables},function(res){
                callback(res);
            },'json');
        },
        back_start: function(url,id,start,callback){
            $.get(url,{id:id,start:start},function(res){
                callback(res);
            },'json');
        },
        //优化表  
        optimize: function(url,tables,callback){
            $.post(url,{tables:tables},function(res){
                callback(res);
            },'json');
        },
        //修复表
        repair: function(url,tables,callback){
            $.post(url,{tables:tables},function(res){
                callback(res);
            },'json');
        },
        status: function(dom,msg){
            dom.parents('tr').find('span.status').attr('class','status label label-success').text(msg);
        }
    }
}();


//删除数据库备份文件======//
$('#adstables').on('click','a.delete',function(){
    var file = $(this).data('file');
    layer.confirm('你确定要删除吗？', {
        btn: ['确定','取消'] //按钮
    }, function(){
        $.getJSON('/admin/database/del/file/'+file,function(res){
            layer.msg(res.msg,{icon:res.code},function(){
                window.location.reload();
            });
        }); 
    });
});
//还原数据库备份文件======//
$('#adstables').on('click','a.import',function(){
    var time = $(this).data('time');
    layer.confirm('你确定要还原数据库吗？', {
        btn: ['确定','取消'] //按钮
    }, function(){
        var url = '/admin/database/import';
        $.get(url,{time:time},function(res){
            if(res.data.part){
                $.get(url,{time:time,part:res.data.part,start:res.data.start},function(res){
                    layer.msg(res.msg,{icon:res.code},function(){
                        if(res.code == 0){
                            layer.msg(res.msg);
                        }
                    });
                });
            }else{
                layer.msg(res.msg);
            }
        },'json'); 
    });
});