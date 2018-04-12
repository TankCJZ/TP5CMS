<?php
namespace app\home\controller;

use think\Controller;
use think\Db;
use think\Cache;

class Home extends Controller{
    //获取栏目
    protected function category(){
        $c = Cache::get('Category');
        if( !$c ){
            //获取栏目
            $category = Db::name('category')
                        ->order('sort','ASC')
                        ->field('id,pid,catename,description,thumb,sort')
                        ->where('status',1)
                        ->select();
            //设置缓存
            Cache::set('Category',$category);
            return $category;
        }else{
            return $c;
        }
        
    }

    //获取指定栏目和模型的文章 栏目ID为0则获取所有
    protected function article($catid=0,$limit='5',$model='blog'){
        $c = Cache::get('article_'.$catid);
        if( !$c ){
            $fields = 'id,catid,title,description,content,keywords,add_time';
            $article = [];
            //获取文章
            if($catid == 0){
                $article = Db::name($model)
                        ->field($fields)
                        ->order('listorder','ASC')
                        ->limit($limit)
                        ->select();
            }else{
                $article = Db::name($model)
                        ->field($fields)
                        ->order('listorder','ASC')
                        ->where('catid',$catid)
                        ->limit($limit)
                        ->select();
            }
            //设置缓存
            Cache::set('article_'.$catid,$article);
            return $article;
        }else{
            return $c;
        }
        
    }

    //获取文章详情页面
    protected function getArticleInfo($id='',$model="blog"){
        $c = Cache::get('ArticleInfo_'.$id);

        if( !$c ){
            if( '' == $id ) return '';
            //$fields = 'id,catid,title,description,content,keywords,add_time';
            $info = Db::name($model)
                //->field($fields)
                ->where('status',1)
                ->find((int)$id);

            //设置缓存
            Cache::set('ArticleInfo_'.$id,$info);
            return $info;
        }else{
            return $c;
        }
        
    }

    //获取指定栏目信息
    protected function getCateInfo($catid=0){
        if( '' == $id ) return '';
        $c = Cache::get('CateInfo_'.$id);

        if( !$c ){
            $cate = Db::name('Category')->field('id,pid,catename,description,content,thumb')->find($catid);
            //设置缓存
            Cache::set('CateInfo_'.$id,$cate);
            return $cate;
        }else{
            return $c;
        }
        
    }

    //获取文章归档分类
    protected function getBlogArchiv($table='blog'){
        $c = Cache::get('BlogArchiv');

        if( !$c ){
            $tablename = config('database.prefix').$table;
            $sql = "select distinct FROM_UNIXTIME(a.create_time, '%Y%m') as date from " . $tablename . " as a order by a.create_time DESC";
            $result = Db::query($sql);

            //设置缓存
            Cache::set('BlogArchiv',$result);
            return $result;
        }else{
            return $c;
        }

        
    }

    //获取归档文章
    protected function getArticleByArchiv($date="",$table="blog"){
        $c = Cache::get('ArticleByArchiv_'.$date);

        if( !$c ){
            $tablename = config('database.prefix').$table;
            $fields = 'id,catid,title,description,content,keywords,add_time';
            $sql = "select ".$fields." from ".$tablename." as a where FROM_UNIXTIME(a.create_time, '%Y%m') = '".$date."';  ";
            $result = Db::query($sql);
            //设置缓存
            Cache::set('ArticleByArchiv_'.$date,$result);
            return $result;
        }else{
            return $c;
        }
    }

}
?>