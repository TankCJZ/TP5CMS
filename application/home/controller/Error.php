<?php
namespace app\home\controller;
//404
use think\Controller;

class Error extends Home{

    public function index(){
        echo "404";
    }

    public function _empty(){
        echo "404";
    }
}
?>