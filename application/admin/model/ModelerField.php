<?php
namespace app\admin\model;

use think\Model;
use think\Db;
use think\Config;

class ModelerField extends Model
{
    const TYPE_STRING  = 'char(55)';
    const TYPE_STRINGS = 'varchar(255)';
    const TYPE_INT     = 'int(10)';
    const TYPE_TIME    = 'int(11)';
    const TYPE_EDITOR  = 'text';
    const TYPE_RADIO   = 'smallint(1)';
    const TYPE_IMAGE   = 'char(55)';
    const TYPE_IMAGES  = 'varchar(555)';
    const TYPE_FILE    = 'char(55)';
    const TYPE_FILES   = 'varchar(555)';
    //自动写入时间戳
    protected $autoWriteTimestamp = true;

    // 定义关联方法
    public function modeler()
    {
        return $this->belongsTo('Modeler');
    }

    public function hasName($name)
    {
        $rs = Db::name('modeler_field')
            ->where('name','=',$name)
            ->find();
        return $rs?true:false;
    }

    public function hasFieldName($fieldname)
    {
        $rs = Db::name('modeler_field')
            ->where('fieldname','=',$fieldname)
            ->find();
        return $rs?true:false;
    }

    //添加表字段
    public function addField($name='',$modelid = '',$datatype='string'){

        $mode = Db::name('modeler')->where('id','=',$modelid)->find();
        $table = Config::get('database.prefix') . $mode['tablename'];
        $type = '';
        $default = 'NULL';
        
        switch($datatype){
            case 'string':
                $type = self::TYPE_STRING;
                break;
            case 'strings':
                $type = self::TYPE_STRINGS;
                break;
            case 'int':
                $type = self::TYPE_INT;
                $default = '0';
                break;
            case 'time':
                $type = self::TYPE_TIME;
                $default = (string)time();
                break;
            case 'editor':
                $type = self::TYPE_EDITOR;
                break;
            case 'radio':
                $type = self::TYPE_RADIO;
                break;
            case 'image':
                $type = self::TYPE_IMAGE;
                break;
            case 'images':
                $type = self::TYPE_IMAGES;
                break;
            case 'file':
                $type = self::TYPE_FILE;
                break;
            case 'files':
                $type = self::TYPE_FILES;
                break;
        }

        $sql = 'ALTER TABLE '.$table.' ADD ' . $name .' '.$type.' DEFAULT '.$default;
        //增加字段
        $rs = Db::execute($sql);
        if(false !== $rs){
            return true;
        }else{
            return false;
        }
    }

    //删除表字段
    public function delField($name = '',$modelid = '')
    {
       if('' == $name || '' == $modelid) return false;

        $mode = Db::name('modeler')->where('id','=',$modelid)->find();
        $table = Config::get('database.prefix') . $mode['tablename'];
        //获取表字段
        $fields = Db::getTableInfo($table,'fields');
        //检测是否存在该字段
        if(!in_array($name,$fields)) return false;
        //删除字段sql
        $sql = 'ALTER TABLE '.$table.'  DROP ' . $name;
        //删除字段
        $rs = Db::execute($sql);
        if(false !== $rs){
            return true;
        }else{ 
            return false;
        }
    }
}
?>