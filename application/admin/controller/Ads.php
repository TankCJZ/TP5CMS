<?php
namespace app\admin\controller;

use think\Request;
use app\admin\model\Ads as AdsModel;

class Ads extends Common
{
    public function index()
    {
        return $this->fetch();
    }

    public function getAdsJson()
    {
        $data = AdsModel::all(function($query){
            $query->field('id,name,description,create_time');
        });
        return json(['code'=>1,'data'=>$data]);
    }

    public function add(Request $request)
    {
        $ads = new AdsModel();
        $post = $request->param();
        if('' == $post['name']) return json(['code'=>0,'msg'=>'板块名称必须填写!']);
        $ads->data([
            'name' => $post['name'],
            'description' => $post['description']
        ]);
       
        if( $ads->save() ){
            return json(['code'=>1,'msg'=>'添加成功!']);
        }else{
            return json(['code'=>0,'msg'=>'添加失败!']);
        }

    }

    public function del($id = '')
    {   
        if( ''== $id ) return json(['code'=>0,'msg'=>'缺少参数ID!']);
        $ads = AdsModel::get((int)$id);
        if($ads->delete()){
            // 删除所有的关联的广告数据
            $ads->adsLists()->delete();
            return json(['code'=>1,'msg'=>'删除成功!']);
        }else{
            return json(['code'=>0,'msg'=>'删除失败!']);
        }
    }
    
    public function edit($id = '',Request $request)
    {
        $method = strtoupper($request->method()); 

        if( 'POST'==$method ){
            //修改
            $post = $request->param();
            $ads = AdsModel::get((int)$id);
            $ads->name = $post['name'];
            $ads->description = $post['description'];
            $ads->id = $post['id'];
            if (false !== $ads->save()) {
                return json(['code'=>1,'msg'=>'修改成功!']);
            } else {
                return json(['code'=>0,'msg'=>$ads->getError()]);
            }
        }else if( 'GET'==$method ){
            //获取信息
            $ads = AdsModel::get((int)$id);
            return json(['code'=>1,'ads'=>$ads]);
        }
    }
}
?>