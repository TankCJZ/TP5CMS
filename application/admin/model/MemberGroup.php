<?php
namespace app\admin\model;

use think\Model;
class MemberGroup extends Model
{
    //自动写入时间戳
    protected $autoWriteTimestamp = true;
    protected $type = [
        'create_time' => 'timestamp:Y-m-d H:i:s',
    ];

    //一对多关联
    public function members()
    {
        return $this->hasMany('Member','group_id');
    }

}
?>