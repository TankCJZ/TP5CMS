<?php
namespace app\home\controller;

//列表页面
class Lists extends Home{
    public function index($catid=0){
        //获取栏目
        $category = $this->category();
        //获取文章
        $article = $this->article($catid,6);
        //获取文章归档分类
        $moth = $this->getBlogArchiv();

        //赋值
        $this->assign('category',$category);
        $this->assign('article',$article);
        $this->assign('moth',$moth);
        $this->assign('active',$catid);
        
        return $this->fetch('blog/lists');
    }

    //获取按年月归档分类 的博客
    public function date($date = '201709'){
        $time = empty($date)?(date('Ym')):$date;
        $article = $this->getArticleByArchiv((int)$date);

        //获取栏目
        $category = $this->category();
        //获取文章归档分类
        $moth = $this->getBlogArchiv();

        $this->assign('category',$category);
        $this->assign('article',$article);
        $this->assign('moth',$moth);
        $this->assign('active',null);
        $this->assign('active_moth',$date);

        return $this->fetch('blog/lists');
    }
}
?>