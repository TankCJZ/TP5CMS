;(function(){
    //引入日期插件================//
    $('.date-picker').datepicker({
        language: 'zh-CN'
    });
    //上传缩略图 单个=============//
    $('.article-thumb').bind('change',function(){
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

    //上传附件 单个===========//
    $('.article-file').bind('change',function(){
        var that = $(this);
        //上传
        FileUpload.upload('/admin/upload/uploadFile',that,function(err,res){
            if('err' == err){
                console.log('上传失败!');
            }else{
                layer.msg(res.msg,{icon:res.code},function(){
                    if('1' == res.code){
                        console.log(res);
                        FileUpload.setInfo(that.parents('.form-group'),res);
                    }
                });
            }
        });
    });

    //上传图组===============//
    $('table.images-upload-comp .article-images').bind('change',function(){

        var that = $(this);
        //上传文件不能多于10个
        var trs = that.parents('table.images-upload-comp').find('tbody tr');
        if( trs.length > 9){
            layer.msg('最多上传10张图片文件！');
            return false;
        }
        //上传单个
        FileUpload.upload('/admin/upload/uploadImg',that,function(err,res){
            if('err' == err){
                console.log('上传失败!');
            }else{
                layer.msg(res.msg,{icon:res.code},function(){
                    if('1' == res.code){
                        console.log(res);
                        setImg(res);
                    }
                });
            }
        });
    });

    //设置上传文件成功后的信息在table中
    function setImg(res){
        var tbody = $('table.images-upload-comp tbody');
        var inputName = tbody.data('input-name');
        var _html = '<tr><td><input type="text" name="'+inputName+'_img_url[]" class="form-control input-sm" value="'+res.url+'"></td><td class="col-xs-4 col-sm-4"><input name="'+inputName+'_img_name[]" type="text" class="form-control input-sm" value="'+res.info.name+'"></td><td><a class="btn btn-xs btn-danger remove-file">移除</a></td></tr>';
        tbody.append(_html);
    }

    //上传文件组===============//
    $('table.files-upload-comp .article-files').bind('change',function(){

        var that = $(this);
        //上传文件不能多于10个
        var trs = that.parents('table.files-upload-comp').find('tbody tr');
        if( trs.length > 9){
            layer.msg('最多上传10张图片文件！');
            return false;
        }
        //上传单个
        FileUpload.upload('/admin/upload/uploadFile',that,function(err,res){
            if('err' == err){
                console.log('上传失败!');
            }else{
                layer.msg(res.msg,{icon:res.code},function(){
                    if('1' == res.code){
                        console.log(res);
                        setFile(res);
                    }
                });
            }
        });
    });

    //设置上传文件成功后的信息在table中
    function setFile(res){
        var tbody = $('table.files-upload-comp tbody');
        var inputName = tbody.data('input-name');
        var _html = '<tr><td><input type="text" name="'+inputName+'_file_url[]" class="form-control input-sm" value="'+res.url+'"></td><td class="col-xs-4 col-sm-4"><input name="'+inputName+'_file_name[]" type="text" class="form-control input-sm" value="'+res.info.name+'"></td><td><a class="btn btn-xs btn-danger remove-file">移除</a></td></tr>';
        tbody.append(_html);
    }
    //移除上传的图片
    $('table.files-upload-comp tbody,table.images-upload-comp tbody').on('click','a.remove-file',function(){
        $(this).parents('tr').remove();
    });

    //添加文章===========//
    $('.article-add').on('click',function(event){
        event.preventDefault();

        var datedom = $('#article-add-form input[data-time]');
        
        //格式化时间格式
        Array.from(datedom).forEach(function(ele) {
            var t = $(ele).val();
            
            $(ele).val(Common.toTimestamp(t));
        }, this);;

        var form = $('#article-add-form').serialize();
        console.log(form);
        $.ajax({
            url: '/admin/article/add',
            method: 'post',
            data: form,
            dataType: 'json',
            beforeSend: function(){
                Common.disabled('.article-add',true);
            },
            success: function(res){
                Common.disabled('.article-add',false);
                layer.msg(res.msg,{icon: res.code});
            },
            error: function(res){
                Common.disabled('.article-add',false);
            }
        });
        return false;
    });
    
    //修改文章==============//
    $('.article-edit').on('click',function(event){
        event.preventDefault();
        var datedom = $('#article-edit-form input[data-time]');
        //格式化时间格式
        Array.from(datedom).forEach(function(ele) {
            var t = $(ele).val();
            $(ele).val(Common.toTimestamp(t));
        }, this);
        var form =  $('#article-edit-form').serialize();
        console.log(form);
        $.ajax({
            url: '/admin/article/edit',
            method: 'post',
            data: form,
            dataType: 'json',
            beforeSend: function(){
                Common.disabled('.article-edit',true);
            },
            success: function(res){
                Common.disabled('.article-edit',false);
                layer.msg(res.msg,{icon: res.code});
            },
            error: function(res){
                Common.disabled('.article-edit',false);
            }
        });
        return false;
    });
    
})();