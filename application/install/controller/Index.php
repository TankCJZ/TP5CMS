<?php
namespace app\install\controller;

use think\Controller;

class Index extends Controller{

    //安装界面
    public function index()
    {
        return $this->fetch();
    }

}
?>