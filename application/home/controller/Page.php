<?php
namespace app\home\controller;

use think\Request;
use think\Db;

//博客分页用于ajax调用，返回json数据
// url: /page/getArticle?catid=64&page=1&size=1
class Page extends Home{
    public function index(Request $request){
        $catid = $request->param('catid',0,'intval');//栏目id
        $date = $request->param('date',0,'intval'); //归档分类
        $page = $request->param('page',1,'intval');//页数
        $size = $request->param('size',10,'intval');//每页个数
        
        if( $page < 1 ) $page = 1;
        if( $size < 1 ) $size = 10;

        $fields = 'id,catid,title,description,content,keywords,add_time';
        $map['status'] = 1;
        if( $catid > 0 ){
            $map = ['status'=>1,'catid'=>$catid];
        }

        if( $date > 0 ){
            //按归档分类分页
            $start = ($page-1) * $size;
            $tablename = config('database.prefix') . 'blog';
            $sql = "select ".$fields." from ".$tablename." as a where FROM_UNIXTIME(a.create_time, '%Y%m') = '".$date."' limit ".$start.",".$size.";";
            $data = Db::query($sql);
        }else{
            //按栏目分类分页
            $data = Db::name('blog')
                ->field($fields)
                ->where($map)
                ->order('listorder','ASC')
                ->page($page,$size)
                ->select();
        }
        if( count($data) < 1 ){
           return json(['code'=>0,'data'=>[],'msg'=>'no data']); 
        }
        return json(['code'=>1,'data'=>$data,'msg'=>'success']);
    }

    

}
?>