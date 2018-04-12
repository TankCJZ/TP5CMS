<?php
namespace app\home\controller;

//列表页面
class Article extends Home{
    public function index($id=0){
        //获取所有栏目信息
        $category = $this->category();
        //获取文章详细信息
        $article = $this->getArticleInfo($id);
        //获取文章归档分类
        $moth = $this->getBlogArchiv();
        //赋值
        $this->assign('category',$category);
        $this->assign('article',$article);
        $this->assign('moth',$moth);
        $this->assign('active',$article['catid']);
        
        return $this->fetch('blog/article');
    }

}
?>