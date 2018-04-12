<?php
namespace app\admin\model;

use think\Model;

class AuthRule extends Model
{
    //自动写入时间戳
    protected $autoWriteTimestamp = true;

    //添加
    public function addRule($post){
        $this->data($post);
        $rs = $this->save();
        return $rs;
    }

    //添加是否存在的权限
    /*protected function getCheckedAttr($value,$data)
    {
        return 
    }*/
}

?>