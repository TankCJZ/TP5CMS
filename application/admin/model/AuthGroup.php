<?php
namespace app\admin\model;

use think\Model;
use app\admin\model\AuthRule as Rule;

class AuthGroup extends Model
{
    //自动写入时间戳
    //protected $autoWriteTimestamp = true;
    
    // 定义一对多关联方法
    public function admins()
    {
        return $this->belongsToMany('Admin','auth_group_access','uid','group_id');
    }

    //获取所有rule 并给自己有的rule 加上checked:true属性
    public function getRulesAndChecked($groupId)
    {
        //获取自己有的权限
        $group = $this->field('id,rules')->find($groupId);
        $ownRulesIds = explode(',',$group['rules']);
        //获取所有权限
        $allRule = Rule::all(function($query){
            $query->field('id,sort,name,title,pid')->order('sort', 'asc');
        });
        //设置存在的权限
        foreach ($allRule as $k => $v) {
            if(in_array($v['id'], $ownRulesIds)){
                $v['checked'] = true;
            }
        }
        return $allRule;
    } 
}

?>