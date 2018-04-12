<?php
namespace app\admin\validate;

use think\Validate;

class Article extends Validate{
    // 验证规则
    protected $rule = [
        'title'    => 'require'
    ];

    protected $message = [
        'title.require' => '文章标题不能为空！'
    ];
}

?>