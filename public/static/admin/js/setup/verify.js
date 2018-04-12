//验证码设置---------------------------//
//设置字体文件
$('.widget-body').on('click','.usZh input[type=radio]',function(){
    if($(this).prop('checked')){
        var val = $(this).val();
        if(val == 'true'){
            getFontList('cn');
        }else if(val == 'false'){
            getFontList('en');
        }
    }
    
});
$('.usZh input[type=radio]:checked').trigger('click');
//获取字体列表
function getFontList(type){
    $.getJSON('/admin/setup/getFonts/' + type,function(res){
        if(res.code == 1){
            var _opts = '';
            res.files.forEach(function(ele,index) {
                if(index > 1){
                    if(ele == res._checked){
                        _opts += '<option selected value="'+ele+'">'+ele+'</option>';
                    }else{
                            _opts += '<option value="'+ele+'">'+ele+'</option>';
                    }
                }
            }, this);
            $('#fontttf').html(_opts);
        }else{
            layer.msg(res.msg);
        }
    });
}
//提交设置
$('.btn-set-verify').on('click',function(e){
    e.preventDefault();
    $.post('/admin/setup/verify',$('#set-verify-form').serialize(),function(res){
        if(res.code == 1){
            layer.msg(res.msg,{icon:1},function(){
                window.location.reload();
            });
        }else if(res.code == 0){
            layer.msg(res.msg);
        }else{
            layer.msg(res.msg,{icon:res.code});
        }
    });
});