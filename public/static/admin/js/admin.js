;
(function(){
    //读取文件并显示在img上
    /*$('.thumb').change(function(){
        var fileInput = $(this)[0];
        var fileImage = $('.thumb-img')[0];
        var fileHidden = $('.thumb-hidden')[0];
        if(!fileInput){
            console.log('file document not found');
            return;
        }
        if(!fileImage){
            console.log('img document not found');
            return;
        }
        //检查文件是否选择
        if(!fileInput.value){
            layer.msg('未选择文件!');
            return;
        }
        //获取file的引用
        var file = fileInput.files[0];
        if(file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif'){
            layer.msg('不是有效的图片!');
            return;
        }
        //读取文件
        var reader = new FileReader();
        reader.onload = function(e){
            var data = e.target.result;
            fileImage.src = data;
            fileHidden.value = data;
        }
        // 以DataURL的形式读取文件:
        reader.readAsDataURL(file);
    });*/

    //删除缩略图
    /*$('#del-thumb').on('click',function(){
        $('.thumb-hidden').val('');
    });
*/
    //修改资料
    $('.submit-btn').on('click',function(e){
        e.preventDefault();
        var id = $('#id').val();
        var oldpass = $.trim($('#oldpassword').val());
        var password = $.trim($('#password').val());
        var repassword = $.trim($('#repassword').val());

        if( '' == oldpass ){
            layer.msg('请输入旧密码！');
            $('#oldpassword').focus();
            return;
        }
        if( password.length < 5 ){
            layer.msg('新密码长度必须大于6位数！');
            $('#password').val('').focus();
            return;
        }
        if( password !== repassword ){
            layer.msg('两次密码不一致！');
            $('#password').focus();
            $('#repassword').val('').focus();
            return;
        }

        $.ajax({
            url: '/admin/edit',
            method: 'post',
            data: $('#edit-form').serialize(),
            dataType: 'json',
            success: function(res){
                layer.msg(res.msg,function(){
                    if(res.code === 1){
                        //刷新页面
                        location.reload(true);
                    }
                });
            },
            error: function(res){
                layer.msg('网络错误!');
            }
        });
        return false;
    });
})();