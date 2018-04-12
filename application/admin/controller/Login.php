<?php
namespace app\admin\controller;

use think\Controller;
use app\admin\model\Admin;
use think\Request;
use think\Config as C;

class Login extends Controller {
    public function index()
    {
        return $this->fetch('login');
    }

    //处理表单登录
    public function doLogin(Request $request)
    {
        if($request->method() == 'POST'){

            $user = new Admin;

            //判断验证码
            if( C::get('captcha.on') ){
                if (true !== $this->validate($request->param(),[
                        'captcha|验证码'=>'require|captcha'
                    ])) {
                    return json(['code'=>0,'msg'=>'验证码错误！']);
                }
            }

            //登录用户是否存在
            if(!$user->checkUserName()){
                return json(['code'=>2,'msg'=>'管理员不存在!']);
            }

            //登录验证
            $userCode = $user->checkLogin($request);

            if( -1 == $userCode ){
                //登录失败
                return json(['code'=>3,'msg'=>'密码错误!']);
            }else if( 0 == $userCode ){
                //禁止登录
                return json(['code'=>2,'msg'=>'用户被禁止登录!']);
            }else if( 1 == $userCode ){
                //登录成功
                return json(['code'=>1,'msg'=>'登陆成功!']);
            }
            
        }
    }
}
?>