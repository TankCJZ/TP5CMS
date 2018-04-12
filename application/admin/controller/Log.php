<?php
namespace app\admin\controller;

use think\Db;
class Log extends Common 
{
    public function index()
    {
        return $this->fetch();
    }

    public function getLogJson()
    {
        //查询前7天的记录 
        date_default_timezone_set('PRC'); //默认时区
        $day = date("Y-m-d",strtotime("-1 day"));
        $logs = Db::name('log')
            ->field('id,user_name,create_time,rule,model_name,ip')
            ->order('create_time','DESC')
            ->whereTime('create_time','>=',$day)
            ->select();
        //删除7天前的数据
        Db::name('log')
            ->whereTime('create_time','<',$day)
            ->delete();
        return json(['code'=>1,'data'=>$logs]);
    }
}
?>