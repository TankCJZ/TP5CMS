 //水印类型
$('.water-type').on('click','input[type=radio]',function(){
    var type = $(this).val();
    if( '1' == type ){
        $('.type_img').show();
        $('.type_font').hide();
    }else if( '2' == type ){
        $('.type_font').show();
        $('.type_img').hide();
        //获取字体文件
        getttf('/admin/setup/getVaterTtf');
    }
});
$('.water-type input[type=radio]:checked').trigger('click');
//提交设置
$('.btn-set-vater').on('click',function(e){
    e.preventDefault();
    $.post('/admin/setup/vater',$('#set-vater-form').serialize(),function(res){
        if( res.code == 0){
            layer.msg(res.msg);
        }else{
            layer.msg(res.msg,{icon:res.code},function(){
                if(res.code == 1) window.location.reload();
            });
        }
    },'json');
    return false;
});
//获取字体文件
function getttf(url){
    $.getJSON(url,function(res){
        var ops = '';
        res.files.forEach(function(ele,index) {
            if(index > 1){
                if(ele == res._selected){
                    ops += '<option selected value="'+ele+'">'+ele+'</option>';
                }else{
                    ops += '<option value="'+ele+'">'+ele+'</option>';
                }
            }
        }, this);
        $('#fontttf').html(ops);
    });
}