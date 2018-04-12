<?php
namespace app\admin\model;

use think\Model;
use think\Request;

class Category extends Model
{
    //自动写入时间戳
    protected $autoWriteTimestamp = true;

    protected function getTypeAttr($value){
        $types = [1=>'栏目',2=>'单篇',3=>'链接'];
        return $types[$value];
    }
    
    //添加或者更新栏目
    public function saveOrUpdate($type=1,$request)
    {
        //3.获取post字段
        $data = $request->param();
        //4.判断栏目类型
        switch($data['type']){
            case '1':
                //栏目
                $data['content'] = '';
                $data['url'] = '';
                break;
            case '2':
                //单篇
                $data['url'] = '';
                break;
            case '3':
                //链接
                $data['content'] = '';
                break;
        }
        if(!isset($data['status'])) $data['status'] = 0;
        //5.保存到数据库
        // 过滤post数组中的非数据表字段数据
        if($type == 1){
            //保存
            $rs = $this->data($data,true)->allowField(true)->save();
        }else if($type == 2){
            //更新
            $rs = $this->where('id',$data['id'])->update($data);
        }
        return $rs;
    }
}
?>