<?php
return [
    'view_replace_str' => [
        '__STATIC__'=> '/public/static/home/'
    ],
    
     // 默认跳转页面对应的模板文件
    'dispatch_error_tmpl'     =>  APP_PATH .'admin'. DS .'view' . DS . 'public' . DS . 'dispatch_jump.tpl', // 默认错误跳转对应的模板文件
    'dispatch_success_tmpl'   =>  APP_PATH .'admin'. DS .'view' . DS . 'public' . DS . 'dispatch_jump.tpl', // 
];
?>