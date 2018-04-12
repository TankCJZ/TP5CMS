<?php
namespace app\home\taglib;
use think\template\TagLib;

class Blog extends TagLib{
    /**
    * 定义标签列表
    */
    protected $tags = [
        // 标签定义： attr 属性列表 close 是否闭合（0 或者1 默认1） alias 标签别名 level 嵌套层次
        'category' => ['attr' => 'catid'],
        'nav'      => ['attr' => ''],
    ];

    /**
    * 获取指定栏目相关信息
    * @param catid 栏目id
    */
    public function tagCategory($tag,$content)
    {
        $catid = empty($tag['catid']) ? (request()->param('catid')) : $tag['catid'];

        $parse = '<?php ';
        $parse .= '$category = db(\'category\')->field("id,pid,catename,description,modelid,thumb,sort,content")->find((int)'.$catid.');';
        $parse .= 'extract($category);';
        $parse .= ' ?>';
        $parse .= $content;

        return $parse;
    }
}

?>