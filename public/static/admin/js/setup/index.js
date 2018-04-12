$(function(){
    //站点设置---------------------------//
    $('.btn-setting').on('click',function(e){
        e.preventDefault();
        $.post('/admin/setup/site',$('#set-site-form').serialize(),function(res){
            if(res.code == 1){
                layer.msg(res.msg,{icon:res.code},function(){
                    window.location.reload();
                });
            }else{
                layer.msg(res.msg);
            }
        });
        return false;
    });
});