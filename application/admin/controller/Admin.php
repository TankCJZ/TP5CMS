<?php
/**
* 管理员控制器
*/
namespace app\admin\controller;

use think\Request;
use think\Db;
use app\admin\model\AuthGroup as Group;
use app\admin\model\Admin as AdminModel;

class Admin extends Common
{
    //管理员页面
    public function index()
    {
        return $this->fetch();
    }

    //ajax获取所有管理员
    public function getAdminJson()
    {
        $admins = Db::name('auth_group')
                ->field('a.title group_name,g.id id,g.username,g.status,g.lastlogintime,g.lastloginip,g.group_id')
                ->alias('a')
                ->join("__ADMIN__ g"," g.group_id=a.id")
                ->select();

        return json(['code'=>1,'data'=>$admins]);
    }

    //添加管理员
    public function add(Request $request)
    {
        if( 'POST' == strtoupper($request->method()) ){
            $post = $request->param();
            if( '' == $post['group_id'] ) return json(['code'=>0,'msg'=>'缺少参数group_id！']);
            
            //验证用户名是否合法
            if( '' == $post['username'] ) return json(['code'=>0,'msg'=>'用户名必须填写！']);
            $checkUsername = preg_match('/^\w{4,8}/', $post['username']);
            if($checkUsername < 1) return json(['code'=>0,'msg'=>'用户名必须为4~8位数，数字字符和下划线组成！']);

            $hashName = Db::name('admin')->where('username',$post['username'])->find();
            if($hashName) return json(['code'=>0,'msg'=>'用户名已经存在！']);

            //验证密码
            $passCode = $this->checkPass($post['password'],$post['password2']);
            if( true !== $passCode){
                return json($passCode);
            }
            //验证email
            $mailCode = $this->checkEmail($post['email']);
            if( true !== $mailCode){
                return json($mailCode);
            }

            $group = Group::field('id,title,sort')->find($post['group_id']);
            // 增加一个关联管理员
            $entry = create_entry();
            $pass = md5($post['password'] . $entry);
            $rs = $group->admins()->save([
                'username' => $post['username'],
                'password' => $pass,
                'entry' => $entry,
                'email' => $post['email'],
                'status' => $post['status'],
                'lastloginip' => $request->ip(),
                'group_id' => $post['group_id']

            ]);
            if(false !== $rs){
                return json(['code'=>1,'msg'=>'添加管理员成功！']);
            }else{
                return json(['code'=>0,'msg'=>'添加管理员失败!']);
            }
        }else{
            //获取所有管理员组
            $gs = Group::field('id,title,status,sort')->where('status',1)->select();
            return json(['code'=>1,'groups'=>$gs]);
        }

    }

    //修改
    public function edit(Request $request,$id = '')
    {

        if( "POST" == strtoupper($request->method()) ){
            $post = $request->param();
            //表单字段非空验证
            if( '' == $post['group_id'] ) return json( ['code'=>0, 'msg'=>'缺少参数group_id' ] );
            if( '' == $post['id'] ) return json( ['code'=>0, 'msg'=>'缺少参数ID' ] );
            //获取管理员
            $admin = AdminModel::field('id,username,password,email,status,entry,group_id')->find($post['id']);

            //设置密码
            if( '' !== $post['password']){
                //验证密码
                $passCode = $this->checkPass($post['password'],$post['password2']);
                if( true !== $passCode){
                    return json($passCode);
                }
                //设置密码
                $admin['password'] = md5( $post['password'].$admin['entry']);
            }else{
                unset($admin['password']);
            }
            //设置email
            if( '' !== $post['email'] ){
                //验证email
                $checkEmail = preg_match('/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/', $post['email']);
                if($checkEmail < 1) return json(['code'=>0,'msg'=>'邮箱格式不正确！']);
                //设置email
                $admin['email'] = $post['email'];
            }else{
                $admin['email'] = '';
            }
            //设置状态
            $admin['status'] = $post['status'];
            //设置管理员组
            $admin['group_id'] = $post['group_id'];
            //更新中间表
            Db::name('auth_group_access')
                ->where('uid',$admin['id'])
                ->update([
                    'group_id'=>$admin['group_id']
                ]);
            //保存
            $rs = $admin->save();
            //返回json
            if(false !== $rs){
                return json(['code'=>1,'msg'=>'修改成功！']);
            }else{
                return json(['code'=>0,'msg'=>'修改失败!']);
            }
        }else{
            if( '' == $id ) return json( ['code'=>0, 'msg'=>'缺少参数ID' ] );
            $groups = Group::field('id,title')->select();
            $admin = AdminModel::field('id,username,status,email,group_id')->find($id);
            foreach ($groups as $k => $v) {
                if( $admin['group_id'] == $v['id'] ){
                    $v['checked'] = true;
                    break;
                }
            }
            if($admin){
                return json( ['code'=>1, 'admin'=>$admin, 'groups'=>$groups ] );
            }else{
                return json( ['code'=>0, 'msg'=>'管理员不存在!' ] );
            }
        }
        
    }

    //删除
    public function del($id = '')
    {
        if( '' == $id ) return json(['code'=>0,'msg'=>'缺少参数ID!']);
        //删除管理员
        $rs = AdminModel::destroy($id);
        //删除中间表记录
        Db::name('auth_group_access')
            ->where('uid',$id)
            ->delete();
        //返回json
        if(false !== $rs){
            return json(['code'=>1,'msg'=>'删除成功！']);
        }else{
            return json(['code'=>0,'msg'=>'删除失败!']);
        }
    }

    //修改状态
    public function disabled($id = '',$status = '')
    {
        if( '' == $id ) return json(['code'=>0,'msg'=>'缺少参数ID!']);
        if( '' == $status ) return json(['code'=>0,'msg'=>'缺少参数status!']);
        //禁用
        $rs = AdminModel::where('id',$id)->update(['status'=>$status]);
        
        if(false !== $rs){
            if(1 == (int)$status){
                return json(['code'=>1,'msg'=>'已启用!']);
            }else{
                return json(['code'=>1,'msg'=>'已禁用!']);
            }
        }else{
            return json(['code'=>0,'msg'=>'操作失败!']);
        }
    }

    //验证密码格式是否正确
    private function checkPass($str,$str2){
        //验证密码是否合法
        if( '' == $str ) return ['code'=>0,'msg'=>'密码必须填写！'];
        $checkPass = preg_match('/^[a-zA-Z]\w{5,17}$/', $str);
        if($checkPass < 1) return ['code'=>0,'msg'=>'密码必须以字母开头，长度在6~18之间，只能包含字符、数字和下划线！'];

        //密码是否一致
        if($str !== $str2) return ['code'=>0,'msg'=>'两次密码不一致!'];

        return true;
    }

    //验证邮箱格式是否正确
    private function checkEmail($mail){
        //验证邮箱格式
        if(strlen($mail) > 0){
            $checkEmail = preg_match('/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/', $mail);
            if($checkEmail < 1) return json(['code'=>0,'msg'=>'邮箱格式不正确！']);
        }
        return true;
    }
}
?>