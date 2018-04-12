<?php

/**
*   权限控制器
*/
namespace app\admin\controller;

use think\Request;
use app\admin\model\AuthRule;
use think\Db;

class Rule extends Common{

    public function index()
    {
        return $this->fetch();
    }

    //获取所有权限
    public function getRuleJson()
    {
        $rules = AuthRule::all(function($query){
            $query->where('status', 1)->order('sort', 'ASC');
        });
        //重组rule
        $rules = reorgnCates($rules);
        $data['data'] = $rules;
        return json($data);
    }

    //获取分组数据
    public function getRuleGroup()
    {
        $rs = AuthRule::where(['pid'=>0])
            ->field('id,title,pid,sort,status')
            ->select();
        return json($rs);
    }

    //添加权限
    public function add(Request $request)
    {
        if('' == $request->param('title')) return json(['code'=>0,'msg'=>'权限名称必填!']);
        if('' == $request->param('pid')) return json(['code'=>0,'msg'=>'请选择分组!']);
        
        $authRule = new AuthRule;
        $rs = $authRule->addRule($request->param());

        if(false !== $rs){
            return json(['code'=>1,'msg'=>'添加成功!']);
        }else{
            return json(['code'=>0,'msg'=>'添加失败!']);
        }
        
    }

    //添加分组
    public function addGroup(Request $request)
    {
        $post = $request->param();

        if('' == $post['title']) return json(['code'=>0,'msg'=>'分组名称必填!']);
        
        $authRule = new AuthRule;
        $rs = $authRule->addRule($post);

        if(false !== $rs){
            return json(['code'=>1,'msg'=>'添加成功!']);
        }else{
            return json(['code'=>0,'msg'=>'添加失败!']);
        }

    }

    public function del(Request $request)
    {
        $id = $request->param('id');
        if('' == $id) return json(['code'=>0,'msg'=>'参数ID不能为空!']);
        $rs = AuthRule::destroy((int)$id);
        if(false !== $rs){
            return json(['code'=>1,'msg'=>'删除成功!']);
        }else{
            return json(['code'=>0,'msg'=>'删除失败!']);
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
            AuthRule::where('id',$k)
                ->update(['sort'=>$v]);    
        }
        return json(['code'=>1,'msg'=>'更新排序成功!']);
    }
}


?>