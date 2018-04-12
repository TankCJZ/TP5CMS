<?php
    return [
        'auth_on'           => true,                      // 认证开关
        'auth_type'         => 2,                         // 认证方式，1为实时认证；2为登录认证。
        'auth_group'        => 'auth_group',              // 用户组数据表名
        'auth_group_access' => 'auth_group_access',       // 用户-用户组关系表
        'auth_rule'         => 'auth_rule',               // 权限规则表
        'auth_user'         => 'auth_admin',               // 用户信息表
        //不需要验证的控制器/方法
        'not_check'        => [
            'Index/index',
            'Index/logout',
            'Index/edit',
            'Log/getLogJson',
            'Admin/getAdminJson',
            'Category/getCateJsonData',
            'Modeler/getModelerJsonData',
            'Article/getArticle',
            'Rule/getRuleJson',
            'Rule/getRuleGroup',
            'Group/getGroupJson',
            'Setup/getFonts',
            'Setup/getVaterTtf',
            'Ads/getAdsJson',
            'AdsList/getAdsListJson',
            'Member/getMemberJson',
            'Member/getGroup',
            'Upload/uploadimg',
            'Upload/uploadfile',
            'Cache/index',
        ],
        //没有权限提示信息
        'not_check_msg' => '你没有权限操作此项!',
    ];
?>