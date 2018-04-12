<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

return [
    '__pattern__' => [
        'id'        => '\d+',
        'cate_type' => '\d+',
        'pid'       => '\d+',
        'field_id'  => '\d+',
        'flag'      => '\d+',
        'modelid'   => '\d+',
        'tablename' => '\w+',
        'ids'       => '(\d|,)+',
        'status'    => '\d+',
        'type'      => '\w+',
        'file'      => '\w+',
        'size'      => '\d+',
        'catid'     => '\d+',
        'date'      => '\d+',
    ],

    //---------------后台登录路由----------------------//
    'admin/login'               => 'admin/login/index',//登录界面
    'admin/doLogin'             => ['admin/login/doLogin',['method'=>'post']],//处理登录表单post
    //'admin/captchaCheck/:code'  => 'admin/login/captchaCheck',//检测验证码
    'admin/index'               => 'admin/index/index', //后台首页
    '[admin/edit]'  => [
        ''                          => ['admin/index/edit',['method'=>'post']],
        ':id'                       => ['admin/index/edit',['method'=>'get']],
    ],
    'admin/logout'              => 'admin/index/logout',//页面重定向

    //---------------管理员增删改查路由----------------------//
    //'admin/admin/index'         => 'admin/admin/index',
    'admin/admin/add'           => 'admin/admin/add', 
    '[admin/admin/edit]'  => [
        ''                          => ['admin/admin/edit',['method'=>'post']],
        ':id'                       => ['admin/admin/edit',['method'=>'get']],
    ],
    'admin/admin/del/:id'       => ['admin/admin/edit',['method'=>'get']], //删除
    'admin/admin/disabled/:id/:status'  => ['admin/admin/disabled',['method'=>'get']], //禁用
    'admin/admin/ajaxData'      => 'admin/admin/getAdminJson',

    //---------------栏目增删改查路由----------------------//
    '[admin/category/add]' => [
        ''                  => ['admin/category/add', ['method' => 'post']],//处理添加栏目表单
        '[:cate_type]'      => ['admin/category/add', ['method' => 'get']],//跳转到添加栏目页面
    ],
    'admin/category/add/pid/[:pid]'     => ['admin/category/add',['method'=>'get']],//添加子栏目页面
    'admin/category/del'              => ['admin/category/del',['method'=>'post']],//删除栏目
    '[admin/category/edit]' => [
        ''                  => ['admin/category/edit', ['method' => 'post']],//处理修改栏目表单
        ':id'                => ['admin/category/edit', ['method' => 'get']],//跳转到修改栏目页面
    ],
    'admin/category/upload' => ['admin/category/upload', ['method' => 'post']], //缩略图上传
    'admin/category/getJson' => 'admin/category/getCateJsonData', //获取栏目返回json

    //---------------模型增删改查路由----------------------//
    //'admin/modeler/index'                 => 'admin/modeler/index',//显示所有模型
    'admin/modeler/add'                   => ['admin/modeler/add',['method'=>'post']],//添加模型
    '[admin/modeler/edit]'      =>[
        ''                      => ['admin/modeler/edit',['method' => 'post']],
        ':id'                   => ['admin/modeler/edit',['method' => 'get']],
    ],
    'admin/modeler/ajaxData'     => 'admin/modeler/getModelerJsonData', //获取json数据
    'admin/modeler/disabled/:model_id/:flag'     => 'admin/modeler/disabled',//禁用模型
    'admin/modeler/del/:id'     =>  'admin/modeler/del', //删除模型


    //---------------模型字段增删改查路由----------------------//
    'admin/field/index/:id'                 => ['admin/field/index',['method'=>'get']],//显示字段列表
    '[admin/field/add]'   => [
        ''                      => ['admin/field/add',['method'=>'post']],//处理添加字段
        ':id'                   => ['admin/field/add',['method'=>'get']],//跳转到添加字段页面
    ],
    '[admin/field/edit]'   => [
        ''                      => ['admin/field/edit',['method'=>'post']],//处理修改字段
        ':id'                   => ['admin/field/edit',['method'=>'get']],//跳转到修改字段页面
    ],
    'admin/field/del/:id'                   => ['admin/field/del',['method'=>'get']],//删除字段
    'admin/field/disabled/:field_id/:flag'  => 'admin/field/disabled',//禁用字段
    'admin/field/sort'                      => ['admin/field/sort',['method'=>'post']],//更新排序

    //---------------文章增删改查路由----------------------//
    'admin/article/index/[:cateid]'           => 'admin/article/index',
    '[admin/article/add]'   => [
        ''                      => ['admin/article/add',['method'=>'post']],//处理添加文章
        ':id'                   => ['admin/article/add',['method'=>'get']],//跳转到添加文章页面
    ],
    'admin/article/del/:tablename/:ids'     => 'admin/article/del',//删除文章
    'admin/article/getArticle/:modelid/:id' => 'admin/article/getArticle',//ajax获取指定模型和指定栏目的文章
    'admin/article/sort'                    => ['admin/article/sort',['method'=>'post']], //更新排序
    '[admin/article/edit]'  => [
        ''                          => ['admin/article/edit',['method'=>'post']],
        ':tablename/:modelid/:id'   => ['admin/article/edit',['method'=>'get']],
    ],

    //---------------权限增删改查路由----------------------//
    //'admin/rule/index'          => 'admin/rule/index',
    'admin/rule/add'            => ['admin/rule/add',['method'=>'post']],//添加权限
    'admin/rule/addGroup'       => ['admin/rule/addGroup',['method'=>'post']],//添加分组
    'admin/rule/del'            => ['admin/rule/del',['method'=>'post']],
    'admin/rule/ajaxData'       => 'admin/rule/getRuleJson',

    //---------------管理员组增删改查、设置权限路由----------------------//
    //'admin/group/index'                 => 'admin/group/index',
    'admin/group/add'                   => ['admin/group/add',['method'=>'post']],
    'admin/group/del'                   => ['admin/group/del',['method'=>'post']],
    '[admin/group/edit]'  => [
        ''                          => ['admin/group/edit',['method'=>'post']],
        ':id'                       => ['admin/group/edit',['method'=>'get']],
    ],
    'admin/group/disabled/:id/:status'  => ['admin/group/disabled',['method'=>'get']],
    'admin/group/ajaxData'              => 'admin/group/getGroupJson',
    'admin/group/getRule/:id'           => ['admin/group/getRule',['method'=>'get']],
    'admin/group/setRule'               => ['admin/group/setRule',['method'=>'post']],

    //---------------设置操作 相关的路由----------------------//
    //'admin/setup/index'   => 'admin/setup/index',
    'admin/setup/upload'  => 'admin/setup/setUpload',
    'admin/setup/verify'  => 'admin/setup/setVerify',
    'admin/setup/site'    => 'admin/setup/setSite',
    'admin/setup/vater'    => 'admin/setup/setVater',
    'admin/setup/getFonts/:type'    => 'admin/setup/getFonts',//获取验证码字体文件
    'admin/setup/getVaterTtf'    => 'admin/setup/getVaterTtf',//获取水印字体文件

    //---------------广告管理 相关的路由----------------------//
    'admin/ads/index'           => 'admin/ads/index',
    'admin/ads/ajaxData'        => 'admin/ads/getAdsJson',
    'admin/ads/add'             => ['admin/ads/add',['method'=>'post']],
    '[admin/ads/edit]'  => [
        ''                          => ['admin/ads/edit',['method'=>'post']],
        ':id'                       => ['admin/ads/edit',['method'=>'get']],
    ],
    'admin/ads/del/:id'         => ['admin/ads/del',['method'=>'get']],

    //---------------广告列表 相关的路由----------------------//
    'admin/adsList/index/:id'        => 'admin/adsList/index',
    'admin/adsList/ajaxData/:id'     => 'admin/adsList/getAdsListJson',
    '[admin/adsList/add]'  => [
        ''                          => ['admin/adsList/add',['method'=>'post']],
        ':id'                       => ['admin/adsList/add',['method'=>'get']],
    ],
    'admin/adsList/del/:id'          => 'admin/adsList/del',
    '[admin/adsList/edit]'  => [
        ''                          => ['admin/adsList/edit',['method'=>'post']],
        ':id'                       => ['admin/adsList/edit',['method'=>'get']],
    ],
    'admin/adsList/upload'           => 'admin/adsList/upload',

    //---------------操作日志 相关的路由----------------------//
    'admin/log/index'               => 'admin/log/index',
    'admin/log/ajaxData'            => 'admin/log/getLogJson',

    //---------------会员模块控制器 相关的路由----------------------//
    'admin/member/ajaxData'         => 'admin/member/getMemberJson',
    'admin/member/add'              => ['admin/member/add',['method'=>'post']],
    '[admin/member/edit]'  => [
        ''                          => ['admin/member/edit',['method'=>'post']],
        ':id'                       => ['admin/member/edit',['method'=>'get']],
    ],
    'admin/member/del/:id'               => 'admin/member/del',
    'admin/member/disabled/:id/:status'  => ['admin/member/disabled',['method'=>'get']], //禁用
    'admin/member/group'                 => 'admin/member/group',//用户组列表
    'admin/member/addGroup'              => ['admin/member/addGroup',['method'=>'post']],//添加会员组
    'admin/member/delGroup/:id'          => 'admin/member/delGroup',//删除会员组
    '[admin/member/editGroup]'  => [
        ''                          => ['admin/member/editGroup',['method'=>'post']],
        ':id'                       => ['admin/member/editGroup',['method'=>'get']],
    ],
    'admin/member/disabledGroup/:id/:status'  => ['admin/member/disabledGroup',['method'=>'get']], //禁用

    //---------------数据备份控制器 相关的路由----------------------//
    /*'admin/database/index'     =>     'admin/database/index', //表列表 
    'admin/database/optimize'  =>     'admin/database/optimize',//优化表
    'admin/database/repair'    =>     'admin/database/repair',//修复表
    'admin/database/downfile'  =>     'admin/database/downfile',//下载数据库备份文件
    'admin/database/del'       =>     'admin/database/del',//删除备份文件
    'admin/database/import'    =>     'admin/database/import',//还原数据库
    'admin/database/export'    =>     'admin/database/export',//备份数据库*/
    

    //---------------前台路由----------------------//
    'article/:id'           => 'home/article/index',//文章详情页面
    'lists/:catid'          => 'home/lists/index',//列表页面
    'lists/date/:date'      => 'home/lists/date',//归档文章列表页面
    'index'                 => 'home/index/index',//首页
    'page/getArticle'       => 'home/page/index',//博客文章分页

    //---------------安装界面----------------------//
    'install/index'         => 'install/index/index',

];