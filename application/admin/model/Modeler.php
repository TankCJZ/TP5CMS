<?php
namespace app\admin\model;

use think\Model;
use think\Db;

class Modeler extends Model
{
    //自动写入时间戳
    protected $autoWriteTimestamp = true;

    //指定表
    //protected $name = 'model';
    // 定义关联方法
    public function fields()
    {
        return $this->hasMany('ModelerField','modelid');
    }
    
    //创建模型表
    public function createModelTable($request,$model_id=''){
        if('' == $model_id) return false;
        $tablename = $request->param('tablename','');

        $model_sql = <<<model_sql
                    CREATE TABLE IF NOT EXISTS `think_$tablename` (
                    `id` smallint(8) unsigned NOT NULL AUTO_INCREMENT,
                    `catid` smallint(8) NOT NULL,
                    `title` varchar(55) NOT NULL,
                    `description` varchar(55) DEFAULT NULL,
                    `content` text DEFAULT NULL,
                    `thumb` varchar(55) DEFAULT NULL,
                    `keywords` varchar(55) DEFAULT NULL,
                    `url` varchar(55) DEFAULT NULL,
                    `listorder` smallint(8) DEFAULT '100',
                    `status` tinyint(1) DEFAULT '0',
                    `create_time` int(11) DEFAULT NULL,
                    `add_time` int(11) DEFAULT NULL,
                    PRIMARY KEY (`id`)
                    ) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
model_sql;
        try{
            Db::execute($model_sql);
            return true;
        }catch(Exception $e){
            return false;
        }
    }

    //添加模型字段
    public function insertModelField($model_id){
        $fields = [
            ['modelid'=>$model_id,'name'=>'catid','fieldname'=>'栏目','datatype'=>'string','require'=>'1','sort'=>'0'],
            ['modelid'=>$model_id,'name'=>'title','fieldname'=>'标题','datatype'=>'string','require'=>'1','sort'=>'1'],
            ['modelid'=>$model_id,'name'=>'description','fieldname'=>'描述','datatype'=>'strings','require'=>'0','sort'=>'2'],
            ['modelid'=>$model_id,'name'=>'keywords','fieldname'=>'关键字','datatype'=>'string','require'=>'0','sort'=>'3'],
            ['modelid'=>$model_id,'name'=>'url','fieldname'=>'链接','datatype'=>'string','require'=>'0','sort'=>'8'],
            ['modelid'=>$model_id,'name'=>'listorder','fieldname'=>'排序','datatype'=>'int','require'=>'1','sort'=>'7'],
            ['modelid'=>$model_id,'name'=>'status','fieldname'=>'状态','datatype'=>'radio','require'=>'1','sort'=>'100'],
            ['modelid'=>$model_id,'name'=>'content','fieldname'=>'内容','datatype'=>'editor','require'=>'0','sort'=>'4'],
            ['modelid'=>$model_id,'name'=>'thumb','fieldname'=>'缩略图','datatype'=>'image','require'=>'0','sort'=>'5'],
            ['modelid'=>$model_id,'name'=>'add_time','fieldname'=>'添加时间','datatype'=>'time','require'=>'1','sort'=>'6'],
        ];
        try{
            $modeler = Modeler::get($model_id);
            $modeler->fields()->saveAll($fields);
            return true;
        }catch(Exception $e){
            return false;
        }
    }

    public function hasName($name='')
    {
        $rs = Db::name('modeler')
            ->where('name','=',$name)
            ->find();
        return $rs?true:false;
    }

    public function hasTablename($tablename)
    {
        $rs = Db::name('modeler')
            ->where('tablename','=',$tablename)
            ->find();
        return $rs?true:false;
    }
}
?>