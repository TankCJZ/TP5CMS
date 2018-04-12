//登录
;(function(){
    //登录按钮点击事件
    $('.do-login').on('click',function(){
        //获取输入值
        var uname = $.trim($('.uname').val());
        var pass = $.trim($('.pass').val());
        var code = $.trim($('.captcha-text').val());
        //基本验证
        if(!uname || uname === ''){
            showTips('用户名未填写!',2,'#uname',function(){
                $('.uname').focus();
            },2000);
            return false;
        }
        
        if(!pass || pass === ''){
            showTips('密码未填写!',2,'#pass',function(){
                $('.pass').focus();
            },2000);
            return false;
        }

        if($('.captcha-text').length > 0){
            if(!code || code === ''){
                showTips('请输入验证码!',2,'#code',function(){
                    $('#code').focus();
                },2000);
                return false;
            }
        }
        
        //登录
        var url = '/admin/doLogin';
        var form = $('.login-from').serialize();
        
        ajaxLogin(function(){
            $('.do-login').attr('disabled','disabled');
        },url,form);
        return false;
    });

    //登录方法
    function ajaxLogin(before,url,data){
        $.ajax({
            url: url,
            method: 'post',
            dataType: 'json',
            data: data,
            beforeSend: before,
            success: function(res){
                if(res.code == 0){//验证码错误
                    showTips(res.msg,1,'#code',function(){
                        $('#code').focus().val('');
                    },2000);
                    resetVerify();
                }else if(res.code == 1){//登陆成功
                    layer.msg(res.msg,{icon:1},function(){
                        window.location.href = '/admin/index';
                    });
                }else if(res.code == 2){//禁止登录
                    layer.msg(res.msg,{icon:2});
                }else if(res.code == 3){//密码错误
                    layer.msg(res.msg,{icon:2});
                    resetVerify();
                }
                $('.do-login').removeAttr('disabled');
            },
            error: function(res){
                $('.do-login').removeAttr('disabled');
            }
        });
        return false;
    }

    //显示消息
    function showTips(content,der,ele,callback,time){
        layer.tips(content, ele, {
                tips: der,
                time: time
            });
        //回调
        setTimeout(callback,time);
    }

    //重置验证码
    function resetVerify(){
        $('.captcha').trigger('click');
    }

    //点击更换验证码
    $('.captcha').click(function(){
        $(this).attr('src','/captcha?r=' + Math.random());  
    });
})();