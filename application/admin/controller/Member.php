<?php
namespace app\admin\controller;

use app\admin\model\Member as MemberModel;
use app\admin\model\MemberGroup as MemberGroupModel;
use think\Request;
use think\Db;

class Member extends Common
{
    public function index()
    {
        return $this->fetch();
    }

    //获取会员json数据
    public function getMemberJson()
    {
        $data = Db::name('member')
                ->field('m.id,m.username,m.regip,m.status,m.lastlogintime,m.group_id,m.email,g.name as group_name,g.usernum')
                ->alias('m')
                ->join("__MEMBER_GROUP__ g"," g.id=m.group_id")
                ->select();
        return json(['code'=>1,'data'=>$data]);
    }

    //获取会员组
    public function getGroup()
    {
        $groups = MemberGroupModel::all();
        return json(['code'=>1,'groups'=>$groups,'data'=>$groups]);
    }

    //添加会员
    public function add(Request $request)
    {
        $member = new MemberModel();
        $post = $request->param();

        if( '' == $post['username'] )  return json(['code'=>0,'msg'=>'用户名必须填写!']);
        if( '' == $post['email'] )  return json(['code'=>0,'msg'=>'邮箱必须填写!']);
        if( '' == $post['group_id'] )  return json(['code'=>0,'msg'=>'请选择用户组!']);
        
        if( '' == $post['password'] ) return json(['code'=>0,'msg'=>'密码不能为空!']);
        //会员名存在
        $m = $member->where('username','=',$post['username'])->find();
        if($m){
           return json(['code'=>0,'msg'=>'该会员名已经存在!']); 
        }
        $post['password'] = md5($post['password']);
        $rs = $member->data($post)->save();
        if( false !== $rs ){
            //增加会员个数
            Db::name('member_group')->where('id', $post['group_id'])->setInc('usernum');
            return json(['code'=>1,'msg'=>'添加会员成功!']);
        }else{
            return json(['code'=>0,'msg'=>'添加会员失败!']);
        }
        
    }

    //删除会员
    public function del($id = '')
    {
        $member = MemberModel::get((int)$id);
        $rs = $member->delete();
        if( false !== $rs ){
            //减少会员个数
            Db::name('member_group')
                ->where('id', $member['group_id'])
                ->where('usernum','>',0)
                ->setDec('usernum');
            return json(['code'=>1,'msg'=>'删除成功!']);
        }else{
            return json(['code'=>0,'msg'=>'删除失败!']);
        }
    }

    //会员修改
    public function edit(Request $request,$id = '')
    {
        $method = strtoupper($request->method());
        
        if( 'POST' == $method ){
            $post = $request->param();
            if( '' == $post['password'] ) {
                unset($post['password']);
            }else{
                $post['password'] = md5($post['password']);
            }
            //不能修改用户名
            if( isset($post['username']) ) unset($post['username']);
            $rs = MemberModel::update($post);

            if( false !== $rs ){
                return json(['code'=>1,'msg'=>'更新成功!']);
            }else{
                return json(['code'=>0,'msg'=>'更新失败!']);
            }
        }else if( 'GET' == $method ){
            if( '' == $id )  return json(['code'=>0,'msg'=>'缺少参数ID!']);
            $member = new MemberModel();
            $rs = $member->field('id,group_id,username,nickname,email,regip,lastlogintime,status,phone')->find($id);
            $groups = MemberGroupModel::all();
            return json(['code'=>1,'member'=>$rs,'groups'=>$groups]);
        }
    }

    //禁用会员
    public function disabled($id = '',$status = '')
    {
        if( '' == $id ) return json(['code'=>0,'msg'=>'缺少参数ID!']);
        if( '' == $status ) return json(['code'=>0,'msg'=>'缺少参数status!']);
        //禁用
        $member['id'] = (int)$id;
        $member['status'] = $status;
        $rs = MemberModel::update($member);
        
        if(false !== $rs){
            if(1 == (int)$status){
                return json(['code'=>1,'msg'=>'已禁用!']);
            }else{
                return json(['code'=>1,'msg'=>'已启用!']);
            }
        }else{
            return json(['code'=>0,'msg'=>'操作失败!']);
        }
    }

    //显示会员组
    public function group()
    {
        return $this->fetch();
    }

    //添加会员组
    public function addGroup(Request $request)
    {
        $post = $request->param();
        if( ''==$post['name'] ) return json(['code'=>0,'msg'=>'名称不能为空!']);
        $group = new MemberGroupModel();
        $result = $group->where('name',$post['name'])->find();

        if($result){
            return json(['code'=>0,'msg'=>'用户组名称已经存在!']);
        }

        $rs = $group->data($post)->allowField(true)->save();
        if( false !== $rs ){
            return json(['code'=>1,'msg'=>'添加成功!']);
        }else{
            return json(['code'=>0,'msg'=>'添加失败!']);
        }
        
    }

     //删除会员组
    public function delGroup($id = '')
    {
        if( '' == $id )  return json(['code'=>0,'msg'=>'缺少参数ID!']);
        $group = MemberGroupModel::get((int)$id);

        if($group->delete()){
            //删除关联的会员
            $group->members()->delete();
            return json(['code'=>1,'msg'=>'删除成功!']);
        }else{
            return json(['code'=>0,'msg'=>'删除失败!']);
        }
    }

    //会员组修改
    public function editGroup(Request $request,$id = '')
    {
        $method = strtoupper($request->method());
        if( 'POST' == $method ){
            //获取post数据
            $post = $request->param();
            //验证是否存在相同用户名
            $memberModel = new MemberGroupModel();
            $has = $memberModel
                ->where('id','neq',$post['id'])
                ->where('name','=',$post['name'])
                ->find();
            if( $has ) return json(['code'=>0,'msg'=>'会员组名称已经存在!']);
            //更新
            $rs = MemberGroupModel::update($post);
            //返回
            if( false !== $rs ){
                return json(['code'=>1,'msg'=>'更新成功!']);
            }else{
                return json(['code'=>0,'msg'=>'更新失败!']);
            }
        }else if( 'GET' == $method ){
            $group = MemberGroupModel::get((int)$id);
            return json(['code'=>1,'group'=>$group]);
        }
    }

    //禁用会员组
    public function disabledGroup($id = '',$status = '')
    {
        //禁用
        $member['id'] = (int)$id;
        $member['status'] = $status;
        $rs = MemberGroupModel::update($member);
        
        if(false !== $rs){
            if(1 == (int)$status){
                return json(['code'=>1,'msg'=>'已禁用!']);
            }else{
                return json(['code'=>1,'msg'=>'已启用!']);
            }
        }else{
            return json(['code'=>0,'msg'=>'操作失败!']);
        }
    }
}

?>