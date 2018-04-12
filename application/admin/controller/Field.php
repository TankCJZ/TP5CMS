<?php
namespace app\admin\controller;

use think\Request;
use app\admin\model\ModelerField as ModelField;
use app\admin\model\Modeler;

class Field extends Common
{

    public function index($id = '',Request $request)
    {
        if('' == $id) return json(['code'=>0,'msg'=>'参数错误!']);
        $mode = Modeler::get($id);
        $fieldModel = new ModelField;
        $fields = $fieldModel->where('modelid',$id)
                    ->order('sort','asc')
                    ->select();
        $this->assign('mode',$mode);
        $this->assign('fields',$fields);
        return $this->fetch();
    }

    public function add(Request $request)
    {
        if(strtoupper($request->method()) == 'POST'){
            //获取表单数据
            $post = $request->param();
            //创建模型
            $fieldModel = new ModelField;
            //非空验证
            if('' == $post['fieldname']) return json(['code'=>0,'msg'=>'字段名不能为空！']);
            if('' == $post['name']) return json(['code'=>0,'msg'=>'字段别名不能为空！']);
            //验证字段名
            if( $fieldModel->hasName($post['name']) ){
                return json(['code'=>0,'msg'=>'字段名已经存在！']);
            }
            //验证字段别名
            if( $fieldModel->hasFieldName($post['fieldname']) ){
                return json(['code'=>0,'msg'=>'字段别名已经存在！']);
            }
            //获取模型ID
            $modelid = $request->param('modelid');
            //给表添加字段
            if(!$fieldModel->addField($post['name'],$modelid,$post['datatype']))
            {
                return json(['code'=>0,'msg'=>'添加表[' . $post['name'] . ']字段失败！']);
            }
            //字段模型标表添加数据
            $rs = $fieldModel->data($post)->allowField(true)->save();
            if( false !== $rs ){
                return json(['code'=>1,'msg'=>'添加成功！']);
            }else{
                return json(['code'=>0,'msg'=>'添加失败！']);
            }
        }else{
            $modelid = $request->param('id');
            $this->assign('modelid', $modelid);
            return $this->fetch();
        }
        
    }

    public function edit(Request $request)
    {
        if('POST' == strtoupper($request->method())){
            $post = $request->param();
            $field = ModelField::get($post['id']);
            $field['fieldname'] = $post['fieldname'];
            $field['sort'] = (int)$post['sort'];
            $field['prom'] = $post['prom'];
            $rs = $field->save();
            if(false !== $rs){
                return json(['code'=>1,'msg'=>'修改成功!']);
            }else{
                return json(['code'=>0,'msg'=>'修改失败!']);
            }
        }else{
            $fieldid = $request->param('id');
            $fieldModel = new ModelField;
            $field = $fieldModel->where('id','=',$fieldid)->find();
            $this->assign('field',$field);
            return $this->fetch();
        }
        
    }

    public function del($id = '')
    {
        if('' == $id) return json(['code'=>0,'msg'=>'参数错误!']);
        //创建模型
        $fieldModel = new ModelField;
        $field = $fieldModel->where('id','=',$id)->find();
        //系统字段不能删除
        if(1 == (int)$field['is_system']) return json(['code'=>0,'msg'=>'系统字段不能删除!']);
        //删除表字段
        $rs = $fieldModel->delField($field['name'],$field['modelid']);
        //表字段不存在
        if(!$rs) return json(['code'=>0,'msg'=>'字段不存在!']);    
        //删除记录的字段
        $rs = $field->delete();
        if(false !== $rs){
            return json(['code'=>1,'msg'=>'删除成功']);
        }else{
            return json(['code'=>0,'msg'=>'删除失败']);
        }
    }

    //禁用字段
    public function disabled($field_id,$flag)
    {
        if('' == $field_id || '' == $flag) return json(['code'=>0,'msg'=>'参数错误!']);
        $flag = (int)$flag;
        $field_id = (int)$field_id;
        $fieldModel = new ModelField;
        $rs = $fieldModel->where('id',$field_id)
                    ->update(['disabled'=>$flag]);
        if(false !== $rs){
            if(1 == $flag){
                return json(['code'=>1,'msg'=>'已禁用!']); 
            }else{
                return json(['code'=>1,'msg'=>'已启用!']); 
            }
        }else{
            return json(['code'=>0,'msg'=>'操作失败!']);  
        }
    }

    //更新排序
    public function sort(Request $request)
    {
        $modelid = $request->param('modelid');
        $arr = $request->only(['sort'])['sort'];
        $fieldModel = new ModelField;
        foreach($arr as $k=>$v){
            $fieldModel->where('id',$k)->update(['sort'=>$v]);
        }
        return $this->redirect('/admin/field/index/'.$modelid);
    }
}
?>