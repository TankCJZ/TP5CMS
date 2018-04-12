<?php
namespace app\admin\controller;

use think\Request;
use app\admin\model\Category as Cate;
use app\admin\model\Modeler;
use think\Config as C;

class Category extends Common
{
    public function index()
    {
        return $this->fetch();
    }

    //获取json栏目数据
    public function getCateJsonData(Request $request){
        $cate = new Cate;

        $modelid = $request->param('modelid');
        $id = $request->param('id');

        if( isset($modelid) && isset($id) ){
           if( is_numeric($id) && is_numeric($modelid) ){
                $cs = $cate->field('id,modelid,pid,type,catename')
                    ->where('id','neq',$id)
                    ->where('type','eq',1)
                    ->where('modelid','eq',$modelid)
                    ->select();
                return json(['code'=>1,'data'=>$cs]);
            }else{
                return json(['code'=>0,'msg'=>'参数错误！']);
            } 
        }

        $cates = $cate->field('c.id,c.pid,c.sort,c.catename,c.type,c.level,c.modelid,m.name as modelname')
                    ->alias('c')
                    ->order('sort ASC')
                    ->join("__MODELER__ m"," c.modelid=m.id","LEFT")
                    ->select();
        $data = reorgnCates($cates);//重组
        return json(['code'=>1,'data'=>$data]);
    }

    //添加
    public function add(Request $request)
    {
        $cate = new Cate;
        if('POST' == strtoupper($request->method())){

            if('' == $request->param('catename','')) return json(['code'=>0,'msg'=>'栏目名称必须填写!']);
            $type = $request->param('type','');

            if('' == $type) return json(['code'=>0,'msg'=>'栏目类型必须填写!']);
            if( 1 == (int)$type ){
                if('' == $request->param('modelid','')) return json(['code'=>0,'msg'=>'栏目模型必须填写!']);
            }

            $rs = $cate->saveOrUpdate(1,$request);//1添加，2更新
            if(false !== $rs){
                return json(['code'=>1,'msg'=>'添加成功!']);
            }else{
                return json(['code'=>0,'msg'=>'添加失败!']);
            }
        }else{
            $type = $request->param('cate_type','1');
            switch ($type) {
                case '1':
                    $type_name = '栏目';
                    break;
                case '2':
                    $type_name = '单篇';
                    break;
                case '3':
                    $type_name = '链接';
                    break;
                default:
                    $type_name = '栏目';
                    break;
            }
            $pid = $request->param('pid','0');
            //获取所有栏目并排序
            $cates = $cate->field(['id','catename','pid','sort','type'])->select();
            $cates = reorgnCates($cates);//重组
            //获取模型
            $model = new Modeler;
            $mode = $model->field('name,id,disabled')->where('disabled','0')->select();

            $this->assign('mode',$mode);
            $this->assign('type',$type);
            $this->assign('type_name',$type_name);
            $this->assign('cates',$cates);
            $this->assign('pid',$pid);
            return $this->fetch();
        }   
    }

    //删除
    public function del(Request $request)
    {
        $id = $request->param('id');
        $cate = new Cate;
        
        $cates = $cate->field('id,pid')->select();

        //获取子栏目ID
        $ids = getCateChildByPid($cates,$id);
        $ids[] = (int)$id;

        $rs = $cate->destroy($ids);

        if(false !== $rs){
            return json(['code'=>1,'msg'=>'删除成功！','ids'=>$ids]);  
        }else{
            return json(['code'=>0,'msg'=>'删除失败！>>' . $cate->getError()]);
        }
    }

    //修改
    public function edit(Request $request)
    {
        $cateModel = new Cate;
        if('POST' == strtoupper($request->method())){
            
            $rs = $cateModel->saveOrUpdate(2,$request);//1添加，2更新
            if(false !== $rs){
                return json(['code'=>1,'msg'=>'修改成功!']);
            }else{
                return json(['code'=>0,'msg'=>'修改失败!']);
            }
        }else{
            $id = $request->param('id');
            //获取需要修改的栏目
            $cate = $cateModel->where('id',$id)->find();
            //获取所有栏目并重组
            $cates = $cateModel->field('id,catename,pid,sort,type')->select();
            $cates = reorgnCates($cates);//重组
            //获取模型
            $model = new Modeler;
            $mode = $model->field('name,id,disabled')->where('disabled','0')->select();
            //赋值
            $this->assign('mode',$mode);
            $this->assign('cates',$cates);
            $this->assign('cate',$cate);
            return $this->fetch();
        }
        
    }

    //修改栏目名称
    
    public function setName(Request $request)
    {
        $id = $request->param('id');
        $catename = $request->param('catename');
        
        if( '' == $catename ) return json(['code'=>0,'msg'=>'名称能为空！']);
        
        if( is_numeric($id) ){
            $cate = new Cate();
            $has = $cate->where('id','neq',$id)->where('catename',$catename)->find();
            if( $has ) return json(['code'=>0,'msg'=>'名称已经存在！']);
            $rs = $cate->where('id',$id)->setField('catename',$catename);
            if( false !== $rs ){
               return json(['code'=>1,'msg'=>'修改成功!']);  
            }
        }else{
           return json(['code'=>0,'msg'=>'参数错误!']); 
        }
    }

    //更新栏目排序
    public function sort(Request $request)
    {
        $post = $_POST;
        if(isset($post['editabledatatable_length'])) unset($post['editabledatatable_length']);
        $ids = $post;
        
        if('' == $ids) return json(['code'=>0,'msg'=>'缺少参数id!']);

        $cateModel = new Cate;
        foreach($ids as $k=>$v){
            $cateModel->where('id',$k)->update(['sort'=>$v]);
        }
        return json(['code'=>1,'msg'=>'更新排序成功!']);
    }

}
?>