//表单验证
var Validate = function(){
    return {
        require: function(formdom){
            var falg = true;
            var inputs = $(formdom).find('input[require]');
            inputs.each(function(index,ele){
                if(ele.value.length < 1){
                    var err = $(ele).parent().next().attr('require-err') || '必填项!';
                    $(ele).parent().next().html(err);
                    falg = false;
                }
            });
            return falg;
        },
        isEmail: function(email){
            var reg = /^(?:[a-zA-Z0-9]+[_\-\+\.]?)*[a-zA-Z0-9]+@(?:([a-zA-Z0-9]+[_\-]?)*[a-zA-Z0-9]+\.)+([a-zA-Z]{2,})+$/;
            return reg.test(email)? true:false;
        },
        isPhone: function(phone){
            var reg = /^0?(13|14|15|18)[0-9]{9}$/;
            return reg.test(phone)? true:false;
        },
        isTelphone: function(tel){
            var reg = /^[0-9-()（）]{7,18}$/;
            return reg.test(tel)? true:false;
        },
        isMember: function(member){
            var reg = /^[A-Za-z0-9_\-\u4e00-\u9fa5]{3,10}$/;
            return reg.test(member)? true:false;
        },
        isGroup: function(group){
            var reg = /^[A-Za-z0-9_\-\u4e00-\u9fa5]{2,10}$/;
            return reg.test(group)? true:false;
        },
        isPassword: function(pass){
            var reg = /^[A-Za-z0-9_\-\u4e00-\u9fa5]{6,12}$/;
            return reg.test(pass)? true:false;
        }
    }
}();
//常用的
var Common = function(){
    return {
        disabled: function(ele,type){
            if(type){
                $(ele).attr('disabled','disabled');
            }else{
                $(ele).removeAttr('disabled');
            }
        },
        showMsg: function(res,callback){
            var code = parseInt(res.code);
            if(code === 1){
                layer.msg(res.msg,{icon:code});
            }else if(code === 0){
                layer.msg(res.msg);
            }else{
                layer.msg(res.msg,{icon:code});
            }
            window.setTimeout(function(){
                if(callback) callback();
            },1500);
        },
        toTimestamp: function(val){
            return ((new Date(val)).getTime() / 1000);
        }
    };
}();

//文件上传 只支持单文件上传
var FileUpload = function(){
    //初始化：删除缩略图
    function cancel(){
        $('.upload-cancel').on('click',function(){
            var parent = $(this).parents('.form-group');
            parent.find('.upload-img').attr('src','').removeClass('show');
            parent.find('.upload-info').text('').removeClass('show');
            parent.find('.upload-input').val('');
            parent.find('.upload-cancel').addClass('hide');
        });
    }
    //激活取消文件事件
    cancel();
    return {
        upload: function(url,ele,callback){
            if(!url) return callback('err',null);
            if(!ele) return callback('err',null);
            var call = callback || function(){};
            
            var formData = new FormData();
            var file = ele[0].files[0];
            var name = ele.attr('name');
            formData.append(name,file);
            $.ajax({  
                url: url,  
                type: 'POST',  
                data: formData,  
                // 告诉jQuery不要去处理发送的数据
                processData : false, 
                // 告诉jQuery不要去设置Content-Type请求头
                contentType : false,
                success: function (res) {  
                    call(null,res);
                },  
                error: function (res) {  
                    call(null,res);;
                }  
            }); 
        },
        //设置上传成功后返回的信息并显示
        setInfo: function(ele,res){
            var parent = ele;
            var uploadinfo = parent.find('.upload-info');
            var uploadinput = parent.find('.upload-input');
            var uploadcancel = parent.find('.upload-cancel');

            uploadinfo.text(res.url).addClass('show');
            uploadinput.val(res.url);
            uploadcancel.removeClass('hide');
        }
    };
}();
//日期格式化
Date.prototype.toLocaleString = function() {
    return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate() + " " + this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds() + " ";
};
//页面跳转
function redirect(url){
    if( '' == url) return false;
    $.get(url,{url:url},function(res){
        if(res.code == 0){
            layer.msg(res.msg);
        }else{
            window.location.href = url;
        }
    });
}
//显示消息
