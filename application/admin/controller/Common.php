<?php
namespace app\admin\controller;

use think\Controller;
use think\Session;
use auth\Auth;
use think\Request;
use think\Config as C;
use think\Db;

class Common extends Controller
{
    public function _initialize()
    {

        //登录验证
        $uid = Session::get('uid');
        $uname = Session::get('uname');
        if(!$uid || !$uname){
            //未登录,跳转到登录
            $this->redirect('/admin/login');
        }

        //操作日志记录
        $this->log();

        //权限验证
        //创建request对象
        $request = Request::instance();
        //获取当前控制器和方法名
        $action = $request->controller() .'/'. $request->action();

        //过滤不需要验证的权限
        $notAction = C::get('auth.not_check');
        if( $uid == 1 || in_array($action,$notAction)){
            return true;
        }

        //验证权限
        $auth = new Auth();
        $bool = $auth->check($action,$uid);
        
        if($bool){
            return true;
        }else{
            return $this->error(C::get('auth.not_check_msg'));
        }
        
    }

    //记录操作日志
    private function log()
    {
        //获取当前操作模块、控制器、方法
        $request = Request::instance();
        $method = strtoupper($request->method());
        $rule = $request->module() .'/'. $request->controller() .'/'. $request->action();
        
        if( 'GET' == $method && (!$request->isAjax()) ) {
            //写入日志到数据库
            Db::name('log')->insert([
                'rule' => $rule,
                'model_name' => $request->controller(),
                'user_id' => Session::get('uid'),
                'user_name' => Session::get('uname'),
                'create_time' => time(),
                'ip'        => $request->ip()
            ]);
        }
    }

}
?>