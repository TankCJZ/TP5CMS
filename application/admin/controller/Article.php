<?php
namespace app\admin\controller;

use think\Controller;
use think\Request;
use think\Db;
use think\Config as C;

class Article extends Common
{
    public function index()
    {
        return $this->fetch();
    }

    //添加文章
    public function add($id = '',Request $request)
    {
        if('POST' == strtoupper($request->method())){

            $post = $request->post();
            if(isset($post['files'])) unset($post['files']);
            if(isset($post['_thumb'])) unset($post['_thumb']);
            //获取模型
            $modeler = Db::name('modeler')->field('id,name,tablename')->where('id',$post['modelid'])->find();
            //移除不需要的字段
            if(isset($post['modelid'])) unset($post['modelid']);
            //数据类型转换
            //$post['add_time'] = strtotime($post['add_time']);
            $post['create_time'] = time();
            //数据验证
            $validate = validate('Article');
            if ( !$validate->check($post) ) {
                return json(['code'=>0,'msg'=>$validate->getError()]);
            }
            //处理上传图片组字段 _img_url _img_name
            $post = $this->doUploadFiles($post);
            //写入数据
            $rs = Db::name($modeler['tablename'])->insert($post);
            //返回信息
            if( false !== $rs ){
                return json(['code'=>1,'msg'=>'添加成功!']);
            }else{
                return json(['code'=>0,'msg'=>'添加失败!']);
            }
        }else{
            $cate = Db::name('Category')->field('id,modelid,catename')->where('id',(int)$id)->find();
            //获取字段
            $fields = Db::name('modeler_field')
                ->field('id,modelid,fieldname,name,datatype,sort,prom,setting')
                ->where('disabled','0')
                ->where('modelid',$cate['modelid'])
                ->order('sort ASC')
                ->select();
            
            $this->assign('fields',$fields);
            $this->assign('cate',$cate);
            return $this->fetch();
        }
    }

    //删除文章（支持批量删除）
    public function del( $ids = '', $tablename = '')
    {
        $ids = explode(',',$ids);
        //delete([1,2,3]);
        $rs = Db::name($tablename)->delete($ids);
        if( false !== $rs) {
            return json(['code'=>1,'msg'=>'删除成功!']);
        }else{
            return json(['code'=>0,'msg'=>'删除失败!']);
        }
    }

    //更新排序
    public function sort(){
        $post = $_POST;
        $tablename = $post['tablename'];
        unset($post['tablename']); 
        $ids = $post;
        
        if('' == $tablename) return json(['code'=>0,'msg'=>'缺少参数tablename!']);
        if('' == $ids) return json(['code'=>0,'msg'=>'缺少参数id!']);
        //更新排序
        foreach ($ids as $k => $v) {
            Db::name($tablename)
                ->where('id',$k)
                ->setField('listorder',$v);    
        }
        return json(['code'=>1,'msg'=>'更新排序成功!']);
    }

    //修改
    public function edit($modelid = '', $tablename = '', $id = '',Request $request)
    {
        if('POST' == strtoupper($request->method())){
            
            $post = $request->post();
            
            if(isset($post['files'])) unset($post['files']);
            if(isset($post['_thumb'])) unset($post['_thumb']);
            
            //获取模型
            $modeler = Db::name('modeler')
                ->field('id,name,tablename')
                ->where('id',$post['modelid'])
                ->find();
                
            //移除不需要的字段
            if(isset($post['modelid'])) unset($post['modelid']);
            //处理状态字段
            if(!isset($post['status'])) $post['status'] = 0;

            //处理上传图片组字段 _img_url _img_name
            $post = $this->doUploadFiles($post);
            //更新数据
            $rs = Db::name($modeler['tablename'])
                ->where('id',$post['id'])
                ->update($post);
            
            if(false !== $rs){
                return json(['code'=>1,'msg'=>'修改成功!']);
            }else{
                return json(['code'=>0,'msg'=>'修改失败!']);
            }
        }else{
            //获取字段
            $fields = Db::name('modeler_field')
                ->field('id,modelid,fieldname,name,datatype,sort,prom')
                ->where('disabled','0')
                ->where('modelid',$modelid)
                ->order('sort ASC')
                ->select();
            //筛选出表的字段名
            $fs = [];
            $fs[] = 'id';//加入id
            foreach ($fields as $k => $v) {
                $fs[] = $v['name'];
            }
            $fs = implode(',',$fs);
            //获取文章
            $article = Db::name($tablename)
                ->field($fs)
                ->where('id',$id)
                ->find();
            //获取栏目
            $cate = Db::name('Category')
                ->field('id,catename,pid,modelid')
                ->where('id',$article['catid'])
                ->find();
            //赋值
            $this->assign('fields',$fields);
            $this->assign('article',$article);
            $this->assign('cate',$cate);
            return $this->fetch();
        }
    }

    //获取指定栏目下的文章
    public function getArticle(Request $request,$modelid='',$id='')
    {
        //获取模型
        $model = Db::name('modeler')->field('id,tablename')->where('id',$modelid)->find();
        if(!$model) return json(['code'=>0,'data'=>[],'msg'=>'model not found']);
        //获取文章
        $article = Db::name($model['tablename'])->where('catid',$id)->field('id,catid,listorder,title')->order('listorder ASC')->select();
        //返回json
        return json(['code'=>1,'data'=>$article,'model'=>$model]);
    }

    //移动文章
    public function remove(Request $request)
    {
        $method = strtoupper( $request->method() );
        if( 'POST'==$method ){
            $cid = $request->param('cid');
            $aids = $request->param('aids');
            $table = $request->param('table');
            
            if( isset($cid) && isset($table) && isset($table) ){
                Db::name($table)->where('id','in',$aids)->setField('catid',$cid);
            }
            return json(['code'=>1,'msg'=>'移动成功!']);
        }
    }

    //处理上传图组和文件组
    private function doUploadFiles($post=null)
    {
        //处理上传图片组字段 _img_url _img_name
        foreach ($post as $k => $v) {
            //如果是组图
            if( strend($k,'_img_url') ){
                //1.获取字段名
                $name = str2arr($k,'_img_url')[0];
                //2.获取图片路径和名称数据
                $arr = array(
                    'url'  => $post[$name.'_img_url'],
                    'name' => $post[$name.'_img_name']
                );
                //赋值
                $post[$name] = json_encode($arr,JSON_UNESCAPED_UNICODE);
                //3.移除无效字段
                unset($post[$name.'_img_url']);
                unset($post[$name.'_img_name']);
            //如果是文件组
            }else if( strend($k,'_file_url') ){
                //1.获取字段名
                $name = str2arr($k,'_file_url')[0];
                //2.获取图片路径和名称数据
                $arr = array(
                    'url'  => $post[$name.'_file_url'],
                    'name' => $post[$name.'_file_name']
                );
                //赋值
                $post[$name] = json_encode($arr,JSON_UNESCAPED_UNICODE);
                //3.移除无效字段
                unset($post[$name.'_file_url']);
                unset($post[$name.'_file_name']); 
            }
        }
        return $post;
    }
}
?>