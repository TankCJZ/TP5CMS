//引入summernote编辑器
(function(){
    var $summernote = $('#summernote,.summernote').summernote({
        height: 300,
        lang: 'zh-CN',
        callbacks: {
            onImageUpload: function(files) {  
                var data = new FormData();  
                data.append("_image", files[0]);  
                $.ajax({  
                    data : data,  
                    type : "POST",  
                    //图片上传出来的url，返回的是图片上传后的路径，http格式  
                    url : "/admin/upload/uploadImg",
                    cache : false,  
                    contentType : false,  
                    processData : false,  
                    dataType : "json",  
                    success: function(data) { 
                        $summernote.summernote('insertImage', '/upload/'+data.url);
                    },  
                    error:function(data){  
                        layer.msg('上传图片失败!');
                    }  
                });
            }
        }
    });
})();