<?php
namespace app\home\controller;

class Index extends Home{

    //前台首页
    public function index()
    {
        //获取栏目
        $category = $this->category();
        //获取博客
        $article = $this->article($catid=0,$limit='6'); 
        //获取文章归档分类
        $moth = $this->getBlogArchiv();

        $this->assign('category',$category);
        $this->assign('article',$article);
        $this->assign('moth',$moth);
        $this->assign('active','0');
        return $this->fetch('blog/index');
    }

}
?>