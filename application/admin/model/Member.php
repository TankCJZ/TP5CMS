<?php
namespace app\admin\model;

use think\Model;
class Member extends Model
{
    //自动写入时间戳
    protected $autoWriteTimestamp = true;
    protected $type = [
        'create_time' => 'timestamp:Y-m-d H:i:s',
        'lastlogintime' => 'timestamp:Y-m-d H:i:s'
    ];

    //定义关联方法
    public function group()
    {
        return $this->belongsTo('MemberGroup');
    }
}
?>