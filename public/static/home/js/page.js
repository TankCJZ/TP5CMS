(function(){
    var PAGE_INDEX = $('.pager .next').data('page') || 1;//当前页、默认第一页
    var PAGE_SIZE = 5;//默认每页5条数据
    //获取归档日期或者栏目id
    var PAGE_CATID = $('#articleList').data('catid');
    var PAGE_DATE = $('#articleList').data('moth');
    
    //如果是第一页则禁用上一页
    if(PAGE_INDEX == 1) disabled('.pager .prev');

    //单击事件
    $('.pager').on('click','a',function(){
        var type = $(this).attr('class');
        if( type.indexOf('next') > -1 ){
            //下一页
            var p = $('.pager .next').data('page') + 1;
            getArticleJson(PAGE_CATID,PAGE_DATE,p,PAGE_SIZE,function(err,res){
                if(res.data.length > 0){
                    console.log(res.data);
                    render('#articleList',res.data);
                    //启动上一页
                    undiabled('.pager .prev');
                    //增加页数
                    PAGE_INDEX++;
                    //设置当前页数
                    $('.pager .next').data('page',PAGE_INDEX);
                }
                //禁用下一页
                if( res.data.length < 5 ){
                    //没有数据了 禁用下一页
                    disabled('.pager .next');
                }
            });
        }else if( type.indexOf('prev') > -1 ){
            //上一页
            var p = $('.pager .next').data('page') - 1;
            getArticleJson(PAGE_CATID,PAGE_DATE,p,PAGE_SIZE,function(err,res){
                if(res.data.length > 0){
                    //渲染
                    render('#articleList',res.data);
                    //禁用下一页
                    undiabled('.pager .next');
                    //减少页数
                    PAGE_INDEX--;
                    //设置当前页数
                    $('.pager .next').data('page',PAGE_INDEX);
                }
                if( p < 2 ){
                    //没有数据了 禁用上一页
                    disabled('.pager .prev');
                }
            });
        }
    });

    //渲染博客
    function render(ele,data){
        if( Array.isArray(data) && data.length>0 ){
        var _html = '';
        data.forEach(function(ele){
            _html += '<div class="blog-post"><h2 class="blog-post-title">'+ele.title+'</h2><p class="blog-post-meta">这篇文章发布于 '+ele.addtime+'</p><p>'+ele.description+'</p><div class="blog-mread-more"><strong><a href="/article/'+ele.id+'.html">查看更多</a></strong></div></div>';
        },this);
        $(ele).stop(true).fadeOut('slow',function(){
            $(ele).html(_html).stop(true).fadeIn('slow');
        });
        }
    }
    //禁用按钮
    function disabled(ele){
        $(ele).attr('disabled','disabled').addClass('disabled');
    }
    //不禁用按钮
    function undiabled(ele){
        $(ele).removeAttr('disabled').removeClass('disabled');
    }

    /*  ajax获取博客分页数据
     * @param catid 栏目id
     * @param date 归档日期
     * @param page 页数
     * @param size 每页个数
     * @param callback 请求成功后的回调函数
     */
    function getArticleJson(catid,date,page,size,callback){
        var _url = '/page/getArticle';
        var data = {
            catid: catid,
            date: date,
            page: page,
            size: size
        };
        $.ajax({
            method: 'GET',
            url: _url,
            data: data,
            dataType: 'json',
            success: function(res){
                if(res.code == 1){
                    callback(false,res);
                }else{
                    callback(true,res.msg);
                }
            }
        });
    }

    })();