<?php
namespace app\admin\controller;

use app\admin\model\Modeler as M;
use think\Request;
use think\Db;
use think\Config as C;

//模型操作控制器
class Modeler extends Common
{
    public function index()
    {
        return $this->fetch();
    }

    public function getModelerJsonData()
    {
       $modes = M::field('id,name,tablename,description,disabled')->select();
       return json(['code'=>1,'data'=>$modes]);
    }

    public function add(Request $request)
    {
        $name = $request->param('name','');
        $tablename = $request->param('tablename','');
        $description = $request->param('description','');
        if(empty($name)) return json(['code'=>0,'msg'=>"模型名称必须填写!"]);
        if(empty($tablename)) return json(['code'=>0,'msg'=>"数据表名称必须填写!"]);

        $modeler = new M;
        //检测模型是否存在
        if($modeler->hasName($name)){
            return json(['code'=>0,'msg'=>'模型名称已经存在！']);
        }
        if($modeler->hasTablename($tablename)){
            return json(['code'=>0,'msg'=>'数据表已经存在！']);
        }
        $modeler->data([
            'name' => $name,
            'tablename' => $tablename,
            'description' => $description,
        ])->allowField(true)->save();
        $model_id = $modeler->id;
        //创建模型表
        if(!$modeler->createModelTable($request,$model_id)){
            //删除表
            Db::execute('Drop table if exists think_' . $tablename);
            return json(['code'=>0,'msg'=>"创建模型失败!"]);
        }
        //添加模型字段表信息
        if(!$modeler->insertModelField($model_id)){
            Db::execute('Drop table if exists think_' . $tablename);
            return json(['code'=>0,'msg'=>"创建模型失败!"]);
        }
        return json(['code'=>1,'msg'=>"创建模型成功!"]);
    }

    public function edit(Request $request)
    {
        if('POST' == strtoupper($request->method())){
            //修改
            $mode['id'] = $request->param('id');
            $mode['name'] = $request->param('name'); 
            $mode['description'] = $request->param('description');
            $rs = M::update($mode);
            if(false !== $rs){
                return json(['code'=>1,'msg'=>'修改成功!']);
            }else{
                return json(['code'=>0,'msg'=>'修改失败!']);
            }
        }else{
            $mode = M::get($request->param('id'));
            if($mode){
                return json(['code'=>1,'mode'=>$mode,'msg'=>'']);
            }else{
                return json(['code'=>1,'msg'=>'模型不存在!']);
            }
        }
    }

    //禁用
    public function disabled($model_id='',$flag = '')
    {
        if('' == $flag || '' == $model_id){
            return json(['code'=>0,'msg'=>'操作失败！']);
        }
        $mode['id'] = (int)$model_id;
        if('1' == $flag){
            $mode['disabled'] = '1';
            $rs = M::update($mode);
            if(false !== $rs){
                return json(['code'=>1,'msg'=>'已禁止!']);
            }else{
                return json(['code'=>0,'msg'=>'操作失败!']);
            }
        }elseif('0' == $flag){
            $mode['disabled'] = '0';
            $rs = M::update($mode);
            if(false !== $rs){
                return json(['code'=>1,'msg'=>'已启动!']);
            }else{
                return json(['code'=>0,'msg'=>'操作失败!']);
            }
        }else{
            return json(['code'=>0,'msg'=>'参数错误！']);
        }
    }

    //删除
    public function del($id = '')
    {
        if('' == $id) return json(['code'=>0,'msg'=>'参数错误!']);

        $mode = M::get($id);
        if($mode){
            //获取模型表名
            $tablename = $mode['tablename'];
            //删除所有关联字段表字段
            if($mode->delete()){
                $mode->fields()->delete();
            }
            //删除模型表
            Db::execute('Drop table if exists ' .C::get('database.prefix').$tablename);
            //删除模型字段
            $mode->delete();

            return json(['code'=>1,'msg'=>'删除成功!']);
        }else{
            return json(['code'=>0,'msg'=>'模型不存在!']);
        }
    }
}
?>