<?php
namespace app\admin\controller;

use think\Controller;
use think\Session;
use think\Request;
use think\Db;

//后台首页
class Index extends Common
{
    //显示首页
    public function index()
    {
        //获取当前环境等信息
        $sys = getSysInfo();
        $this->assign('sys',$sys);
        return $this->fetch();
    }

    //退出登录
    public function logout()
    {
        Session::set('uid',null);
        Session::set('uname',null);
        $this->redirect('/admin/login');
    }

    //修改密码
    public function edit(Request $request)
    {
        if($request->isAjax()){

            return json(['code'=>0,'msg'=>'静止操作！']);

            //获取post参数
            $data = $request->param();
            //验证密码长度
            if(strlen($data['password'])<5) return json(['code'=>0,'msg'=>'密码长度不小于5位数']);
            if( !isset($data['id']) ) return json(['code'=>0,'msg'=>'缺少参数ID']);
            //处理头像
            /*if(empty($data['thumb'])){
                unset($data['thumb']);
            }else{
                $path = './upload/thumb/' . $data['username'] . '.jpg';
                try{
                    base64toimg($data['thumb'],$path);
                    $data['thumb'] = '/upload/thumb/' . $data['username'] . '.jpg';
                }catch(Exception $e){
                    return json(['code'=>0,'msg'=>'保存头像出错了!' . $e->getMessage()]);
                }
            }*/
            //验证两次密码是否一致
            if( $data['password'] !== $data['repassword'] ){
                return json(['code'=>0,'msg'=>'两次密码不一致！']);
            }

            //验证旧密码是否正确
            if( $data['password'] !== $data['repassword'] ){
                return json(['code'=>0,'msg'=>'两次密码不一致！']);
            }

            //获取加密串entry
            $u = Db::name('admin')->where('id',$data['id'])->field('entry,password')->find();

            //验证旧密码是否正确
            if( md5($data['oldpassword'].$u['entry']) !== $u['password'] ){
                return json(['code'=>0,'msg'=>'旧密码错误！']);
            }
            //设置新密码
            $newpass = md5($data['password'].$u['entry']);
            //更新数据库
            $res = Db::name('admin')->where('id',$data['id'])->setField('password',$newpass);
            //返回json
            if(false !== $res){
                return json(['code'=>1,'msg'=>'修改密码成功！']);
            }else{
                return json(['code'=>0,'msg'=>'修改密码失败!']);
            }
        }else{
            //通过id获取管理员信息
            $id = $request->param('id');
            $user = Db::name('admin')->field('id,username')->where('id',$id)->find();
            $this->assign('user',$user);
            //显示模板
            return $this->fetch('admin/edit');
        }
    }
}
?>