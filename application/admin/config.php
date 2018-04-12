<?php

return [
    'view_replace_str' => [
        '__PUBLIC__'=>'/public/static/admin/',
    ],
    // 默认全局过滤方法 用逗号分隔多个
    'default_filter'         => 'htmlspecialchars',
    // 应用调试模式
    'app_debug'              => true,
    // 应用Trace
    'app_trace'              => false,
     // 默认跳转页面对应的模板文件
    'dispatch_error_tmpl'     =>  APP_PATH .'admin'. DS .'view' . DS . 'public' . DS . 'dispatch_jump.tpl', // 默认错误跳转对应的模板文件
    'dispatch_success_tmpl'   =>  APP_PATH .'admin'. DS .'view' . DS . 'public' . DS . 'dispatch_jump.tpl', // 
];
?>