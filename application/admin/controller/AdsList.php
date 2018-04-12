<?php
namespace app\admin\controller;

use think\Request;
use app\admin\model\Ads as AdsModel;
use app\admin\model\AdsList as AdsListModel;
use think\Config as C;

class AdsList extends Common
{
    public function index(Request $request,$id = '')
    {
        if( '' == $id ) return json(['code'=>0,'msg'=>'缺少参数ID!']);
        $this->assign('id',$id);
        return $this->fetch();
    }

    //ajax获取json数据
    public function getAdsListJson($id = '')
    {
        if( '' == $id ) return json(['code'=>0,'msg'=>'缺少参数ID!']);
        $adsList = AdsModel::get((int)$id);
        $list = $adsList->adsLists;
        return json(['code'=>1,'data'=>$list]);
    }

    public function add(Request $request)
    {
        //获取post参数
        $post = $request->param();
        //非空验证
        if( '' == $post['ads_id'] ) return json(['code'=>0,'msg'=>'缺少参数ads_id!']);
        if( '' == $post['title'] ) return json(['code'=>0,'msg'=>'标题必须填写!']);
        //创建模型对象
        $adsList = new AdsListModel($_POST);
        //是否存在该名称
        $has = $adsList->where('title',$post['title'])->find();
        if( $has ) return json(['code'=>0,'msg'=>'名称已经存在!']);
        //添加并返回json
        if($adsList->save()){
            return json(['code'=>1,'msg'=>'添加成功!']);
        }else{
            return json(['code'=>0,'msg'=>'添加失败!==>' . $adsList->getError()]);
        }
    }

    public function edit(Request $request,$id = '')
    {
        $method = strtoupper($request->method());
        if( 'POST' == $method ){
            //获取post参数
            $post = $request->param();
            //非空验证
            if( '' == $post['id'] ) return json(['code'=>0,'msg'=>'缺少参数ID!']);
            if( '' == $post['title'] ) return json(['code'=>0,'msg'=>'标题必须填写!']);
            //创建模型
            $adsList = new AdsListModel();
            //不能存在重复
            $has = $adsList->where('id','neq',$post['id'])->where('title',$post['title'])->find();
            if( $has ) return json(['code'=>0,'msg'=>'名称已经存在!']);
            //添加
            $rs = $adsList->allowField(true)->save($_POST,['id' => $post['id']]);
            //返回json
            if (false !== $rs) {
                return json(['code'=>1,'msg'=>'修改成功!']);
            } else {
                return json(['code'=>0,'msg'=>$adsList->getError()]);
            }
        }else if( 'GET' == $method ){
            if( '' == $id ) return json(['code'=>0,'msg'=>'缺少参数ID!']);
            $adsList = AdsListModel::get((int)$id);
            return json(['code'=>1,'adsList'=>$adsList]);
        }
    }

    public function del($id = '')
    {
        if(AdsListModel::destroy((int)$id)){
            return json(['code'=>1,'msg'=>'删除成功!']);
        }else{
            return json(['code'=>0,'msg'=>'删除失败!']);
        }
    }
   
}
?>