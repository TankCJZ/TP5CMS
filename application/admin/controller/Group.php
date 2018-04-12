<?php
//管理员组控制器
namespace app\admin\controller;
use app\admin\model\AuthGroup;
use app\admin\model\AuthRule as Rule;
use think\Request;

class Group extends Common
{
    public function index()
    {
        return $this->fetch();
    }

    //获取json数据
    public function getGroupJson()
    {
        $authGroup = new AuthGroup;
        $rs = $authGroup->field('id,title,status,sort')->order('sort','ASC')->select();
        return json(['code'=>1,'data'=>$rs]);
    }

    public function add(Request $request)
    {
       //获取post参数
       $post = $request->param();
       //非空验证码
       if('' == $post['title'] ) return json(['code'=>0,'msg'=>'管理员组名不能为空！']); 
       if('' == $post['sort'] ) return json(['code'=>0,'msg'=>'排序不能为空！']); 
       //创建模型对象
       $authGroup = new AuthGroup($post);
       //重复的不添加
       $has = $authGroup->where('title',$post['title'])->find();
       if($has) return json(['code'=>0,'msg'=>'名称已经存在，请更换！']); 
       //添加
       $rs = $authGroup->allowField(true)->save();
       //返回json
       if(false !== $rs){
            return json(['code'=>1,'msg'=>'添加成功!']); 
       }else{
            return json(['code'=>0,'msg'=>'添加失败!']); 
       }
    }

    public function edit($id = '',Request $request)
    {
        $authGroup = new AuthGroup;
        if('POST' == strtoupper($request->method())){
            $post = $request->param();
            if('' == $post['id']) return json(['code'=>0,'msg'=>'参数ID不能为空！']);
            $rs = $authGroup->where('id',$post['id'])
                    ->update([
                        'title' => $post['title'],
                        'sort' => $post['sort'],
                        'status' => $post['status']
                    ]);
            if(false !== $rs){
                return json(['code'=>1,'msg'=>'修改成功!']); 
            }else{
                return json(['code'=>0,'msg'=>'修改失败!']); 
            }
        }else{
            $rs = $authGroup->where('id',$id)->field('id,title,status,sort')->find();
            return json($rs);
        }
    }

    public function sort()
    {
        $post = $_POST;
        if(isset($post['editabledatatable_length'])) unset($post['editabledatatable_length']);
        $ids = $post;
        
        if('' == $ids) return json(['code'=>0,'msg'=>'缺少参数id!']);
        //更新排序
        foreach ($ids as $k => $v) {
            AuthGroup::where('id',$k)
                ->update(['sort'=>$v]);  
        }
        return json(['code'=>1,'msg'=>'更新排序成功!']);
    }

    public function del(Request $request)
    {
        $id = $request->param('id');
        if('' == $id) return json(['code'=>0,'msg'=>'参数ID不能为空!']);
        $rs = AuthGroup::destroy((int)$id);
        if(false !== $rs){
            return json(['code'=>1,'msg'=>'删除成功!']);
        }else{
            return json(['code'=>0,'msg'=>'删除失败!']);
        }
    }

    //禁用
    public function disabled($id = '',$status = '')
    {
        if( '' == $id ) return json(['code'=>0,'msg'=>'参数ID不能为空!']);
        if( '' == $status ) return json(['code'=>0,'msg'=>'参数status不能为空!']);
        //禁用
        $rs = AuthGroup::where('id',$id)->update(['status'=>$status]);
        
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
    
    //设置权限
    public function setRule(Request $request)
    {
        $ruleModel = new Rule;
        $groupModel = new AuthGroup;

        //设置权限
        $rule_ids = $request->param('id');
        $group_id = $request->param('gid');
        if('' == $group_id) return json(['code'=>0,'msg'=>'参数错误！']);
        
        //写入数据
        $data['id'] = $group_id;
        $data['rules'] = $rule_ids;

        $rs = AuthGroup::update($data);
        if(false !== $rs){
            return json(['code'=>1,'msg'=>'设置成功!']);
        }else{
            return json(['code'=>0,'msg'=>'设置失败!']);
        }
    }

    //获取权限
    public function getRule(Request $request,$id = '')
    {
        if( '' == $id ) return json(['code'=>0,'msg'=>'参数错误！']);
        $groupModel = new AuthGroup;
        //获取所有权限,并选中已经存在的权限
        $rules = $groupModel->getRulesAndChecked($id);
        return json(['code'=>1,'data'=>$rules]);
    }					

}

?>