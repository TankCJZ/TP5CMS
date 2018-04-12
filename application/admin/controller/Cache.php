<?php
namespace app\admin\controller;
use think\Cache as C;

class Cache extends Common
{
    public function index(){
        try{
            C::clear();
            return json(['code'=>1,'msg'=>'清空缓存文件成功!']);
        }catch(Exception $e){
            return json(['code'=>0,'msg'=>'清空缓存文件失败，请检查权限!']);
        }
    }
}

?>