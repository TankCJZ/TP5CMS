<?php
namespace app\admin\controller;

class Error extends Common{
    public function _empty()
    {
        return $this->fetch('Public:404');
    }
}
?>