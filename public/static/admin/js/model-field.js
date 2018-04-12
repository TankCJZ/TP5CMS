;
(function(){
    //禁用字段
    $('#editabledatatable .disabled-field').on('click',function(){
        var field_id = $(this).parents('tr').data('id');
        var url = '';
        if($(this).prop('checked')){
            //启用
            url = '/admin/field/disabled/' + field_id + '/0';
        }else{
            //禁用
            url = '/admin/field/disabled/' + field_id + '/1';
        }
        $.getJSON(url,function(res){
            layer.msg(res.msg);
        });
    });
    //添加字段
    
})();
(function(){
    var name = $('#name');
    var fieldname = $('#fieldname');
    name.on('keyup',function(){
        //验证字段名是否合法
        if(!checkName($(this).val())){
            layer.tips('输入字母数字下划线，开头结尾不能是数字和下划线!', '#name',{
                tips: [2,'#FF5722']
            });
        }else{
            layer.tips('格式正确!', '#name',{
                tips: [2,'green']
            });
        }
    });
    fieldname.on('keyup',function(){
        //验证字段名是否合法
        if(!checkTablename($(this).val())){
            layer.tips('请输入中文!', '#fieldname',{
                tips: [2,'#FF5722']
            });
        }else{
            layer.tips('格式正确!', '#fieldname',{
                tips: [2,'green']
            });
        }
    });

    function checkName(val){
        var reg = /^[a-z|A-Z]\w[a-z|A-Z]{1,10}/;
        if(reg.test(val)){
            return true;
        }else{
            return false;
        }
    }
    function checkTablename(val){
        var reg = /^[\u4e00-\u9fa5]{2,10}/;
        if(reg.test(val)){
            return true;
        }else{
            return false;
        }
    }

    //ajax提交表单
    $('.field-add').on('click',function(){
        
        $.ajax({
            url: '/admin/field/add',
            method: 'post',
            data: $('#field-add-form').serialize(),
            dataType: 'json',
            beforeSend: function(){
                Common.disabled('.field-add',true);
            },
            success: function(res){
                layer.msg(res.msg,{icon: res.code});
                Common.disabled('.field-add',false);
            },
            error: function(res){
                console.log('err'+res);
                layer.msg('出现错误!',{icon:2});
                Common.disabled('.field-add',false);
            }
        });
        return false;
    });

    //修改
    $('.field-edit').on('click',function(){
        var id = $('#fieldid').val();
        $.ajax({
            url: '/admin/field/edit/' + id,
            method: 'post',
            data: $('#field-edit-form').serialize(),
            dataType: 'json',
            beforeSend:function(){
                Common.disabled('.field-edit',true);
            },
            success: function(res){ 
                layer.msg(res.msg,{icon: res.code});
                Common.disabled('.field-edit',false);
            },
            error: function(res){
                Common.disabled('.field-edit',false);
            }

        });

        return false;
    });
})();