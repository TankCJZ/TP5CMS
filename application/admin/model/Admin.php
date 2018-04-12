<?php
namespace app\admin\model;

use think\Model;
use think\Request;

class Admin extends Model
{
    //自动写入时间戳
    protected $autoWriteTimestamp = true;

    protected $pk = 'id';

    protected $type = [
        'lastlogintime' => 'timestamp:Y-m-d',
    ];

    //一对一关联管理员组
    /*public function authGroup()
    {
        return $this->belongsTo('AuthGroup');
    }*/

    //定义多对多关系
    public function group()
    {
        // 用户 BELONGS_TO_MANY 角色
        return $this->belongsToMany('AuthGroup', 'auth_group_access','group_id','id');
    }

    //检测用户名
    public function checkUserName(){
        $username = input('post.username');
        $user = Admin::get(['username'=>$username]);
        if($user){
            return true;
        }else{
            return false;
        }
    }

    //检测登录
    public function checkLogin($request){
        $username = input('post.username');
        $password = input('post.password');
        if(empty($username) || empty($password)){
            return ['code'=>0,'msg'=>'error login'];
        }

        $user = Admin::get(['username'=>$username]);
        
        if($user){
            $entry = $user['entry'];
            $password = md5($password . $entry);

            if($password == $user['password']){
                //是否禁用
                if( 0 == $user['status'] ) return 0;
                //更新数据库信息
                $user->lastlogintime = time();
                $user->lastloginip = $request->ip();
                $user->save();
                //写入session
                session('uname', $user['username']);
                session('uid', $user['id']);
                //返回用户
                return 1;
            }else{
                return -1; 
            }
        }else{
            return -1; 
        }
    }
}
?>