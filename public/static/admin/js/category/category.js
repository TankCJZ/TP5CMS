;
(function(){
    //栏目状态
    $('.status input[type="checkbox"]').on('click',function(){
        var status = $(this).val();
        status === '1'?($(this).val('0')):$(this).val('1');
    });
    //切换栏目类型
    $('.type input[type="radio"]').on('click',function(){
        var type = $(this).val().toString();
        switch(type)
        {
            case '1':
                $('.content').fadeOut('fast');
                $('.url').fadeOut('fast');
                $('.cate-model').fadeIn('fast');
                break;
            case '2':
                $('.content').fadeIn('fast');
                $('.url,.cate-model').fadeOut('fast');
                break;
            case '3':
                $('.url').fadeIn('fast');
                $('.content,.cate-model').fadeOut('fast');
                break;
        }
    });
    //激活切换栏目类型
    $('.type input:checked').trigger('click');
    //上传缩略图
    $('#thumb').bind('change',function(){
        var that = $(this);
        //上传
        FileUpload.upload('/admin/upload/uploadImg',that,function(err,res){
            if('err' == err){
                console.log('上传失败!');
            }else{
                layer.msg(res.msg,{icon:res.code},function(){
                    if('1' == res.code){
                        FileUpload.setInfo(that.parents('.form-group'),res);
                    }
                });
            }
        });
    });

    //ajax添加栏目
    $('.cate-add').on('click',function(){
        $.ajax({
            url: '/admin/category/add',
            method: 'post',
            data: $('#cate-add-form').serialize(),
            dataType: 'json',
            beforeSend: function(){
                Common.disabled('.cate-add',true);
            },
            success: function(res){
                console.log(res);
                layer.msg(res.msg,{icon:res.code});
                Common.disabled('.cate-add',false);
            },
            error: function(res){
                Common.disabled('.cate-add',false);
            }
        });
        return false;
    });
    //ajax修改栏目
    $('.cate-edit').on('click',function(){
        $.ajax({
            url: '/admin/category/edit',
            method: 'post',
            data: $('#cate-edit-form').serialize(),
            dataType: 'json',
            beforeSend: function(){
                Common.disabled('.cate-edit',true);
            },
            success: function(res){
                console.log(res);
                layer.msg(res.msg,{icon:res.code});
                Common.disabled('.cate-edit',false);
            },
            error: function(res){
                Common.disabled('.cate-edit',false);
            }
        });
        return false;
    });
})();