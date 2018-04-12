//文件上传---------------------------//
$('.btn-setupload').on('click',function(e){
    e.preventDefault();
    $.post('/admin/setup/upload',$('#set-upload-form').serialize(),function(res){
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