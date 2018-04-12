<?php

    //数组转换成对象
    function array2object($array) {
        if (is_array($array)) {
            $obj = new StdClass();
            foreach ($array as $key => $val){
                $obj->$key = $val;
            }
        }
        else { $obj = $array; }
        return $obj;
    }
    
    //对象转换成数组
    function object2array($object) {
        if (is_object($object)) {
            foreach ($object as $key => $value) {
                $array[$key] = $value;
            }
        }
        else {
            $array = $object;
        }
        return $array;
    }

    /**
    * 字符串转换为数组，主要用于把分隔符调整到第二个参数
    * @param  string $str  要分割的字符串
    * @param  string $glue 分割符
    * @return array
    * @author 麦当苗儿 <zuojiazi@vip.qq.com>
    */
    function str2arr($str, $glue = ','){
        return explode($glue, $str);
    }

    /**
    * 数组转换为字符串，主要用于把分隔符调整到第二个参数
    * @param  array  $arr  要连接的数组
    * @param  string $glue 分割符
    * @return string
    * @author 麦当苗儿 <zuojiazi@vip.qq.com>
    */
    function arr2str($arr, $glue = ','){
        return implode($glue, $arr);
    }

    //判断字符串是否是以指定字符串结尾
    function strend($str,$endstr){
        return substr($str,-strlen($endstr),strlen($str)) === $endstr;
    }

    //删除文件夹已经所有子文件|文件夹
    function delDirAndFile($path, $delDir = false) {
        $handle = opendir($path);
        if ($handle) {
            while (false !== ( $item = readdir($handle) )) {
                if ($item != "." && $item != "..")
                    is_dir("$path/$item") ? delDirAndFile("$path/$item", $delDir) : unlink("$path/$item");
            }
            closedir($handle);
            if ($delDir)
                return rmdir($path);
        }else {
            if (file_exists($path)) {
                return unlink($path);
            } else {
                return false;
            }
        }
    }
    
    //设置上传图片的水印
    function setVater($path){
        $C = new \think\Config();
        if($C::get('vater.on')){
            //水印类型
            $type = $C::get('vater.type');
            //水印显示位置
            $position = $C::get('vater.position');
            //创建对象
            $image = \think\Image::open($path);
            //添加水印的类型
            if( '1' == $type ){
                //添加图片水印
                $p = $C::get('vater.path');
                $alpha = $C::get('vater.alpha');
                $image->water($p,$position,$alpha)->save($path);
            }else if( '2' == $type ){
                //添加文字水印
                $text = $C::get('vater.fonttext');
                $ttfpath = ROOT_PATH . 'public' . DS . 'static'. DS. 'vater'.DS.'ttf'.DS.$C::get('vater.fontttf');
                $fontsize = $C::get('vater.fontsize');
                $fontcolor = $C::get('vater.fontcolor');
                $offset = $C::get('vater.offset');
                $angle = $C::get('vater.angle');
                $image->text($text,$ttfpath,(int)$fontsize,$fontcolor,$position,$offset,$angle)->save($path);
            }
        }
    }

    //重写配置文件
    function writeConf($path = '',$arr)
    {
        return file_put_contents($path, "<?php\r\nreturn " . var_export($arr, true).';');
    }

    /*
     生成随机字符串
    */
    function create_entry($pw_length = 4)
    { 
        $randpwd = ''; 
        $i = 0;
        for ($i; $i < $pw_length; $i++)
        { 
            $randpwd .= chr(mt_rand(33, 126)); 
        } 
        return $randpwd; 
    } 

    //获取当前系统基本信息
    function getSysInfo(){
        $sys = array(
            '操作系统：'=>PHP_OS,
            '运行环境：'=>$_SERVER["SERVER_SOFTWARE"],
            'PHP运行方式：'=>php_sapi_name(),
            '最大上传文件：'=>ini_get('upload_max_filesize'),
            '执行时间限制：'=>ini_get('max_execution_time').'秒',
            '服务器域名/IP：'=>$_SERVER['SERVER_NAME'].' [ '.gethostbyname($_SERVER['SERVER_NAME']).' ]',
        );
        
        return $sys;
    }

    //base64 to img
    function base64toimg($base64='',$path=''){
        $url = explode(',',$base64);
        file_put_contents($path, base64_decode($url[1]));
    }

    //递归重组栏目
	/**
	 * @param $cates 需要进行重组的栏目数组
	 * @param $pid   上级栏目的ID,默认为0
	 * @param $html  添加的html
	 * @param $level 栏目等级
	 */
	function reorgnCates($cates, $ext = '├─',$pid = 0, $html = "&nbsp;&nbsp;&nbsp;", $level = 0,$extLast='└─'){
		$arr = array();
		foreach($cates as $v){
			if($v['pid'] == $pid){
				$v['level'] = $level + 1;
				$v['html']	= str_repeat($html, $level);
				if($v['level'] > 1) $v['html'] = $v['html'] . $ext;
				$arr[] = $v;
				$arr = array_merge($arr, reorgnCates($cates,$ext,$v['id'],$html,$level + 1));
			}	
		}
		return $arr;
	}

    //递归重组栏目获取子栏目
	/**
	 * [cateSort2Child description]
	 * @param  [type]  $cates [栏目数组]
	 * @param  integer $pid   [上级栏目ID]
	 * @return [type]         [从组后的栏目数组]
	 */
    function reorgnCatesByChild($cates,$pid = 0){
        $arr = array();

        foreach($cates as $v){
            if($v['pid'] == $pid){
				$v['child'] = reorgnCatesByChild($cates,$v['id']);
				$arr[] = $v;
			}
        }

        return $arr;
    }

    //通过父栏目ID获取所有子栏目ID
    function getCateChildByPid($cates,$pid=0){
        $arr = array();

		foreach ($cates as $v) {
			if($v['pid'] == $pid){
				$arr[] = $v['id'];
				$arr = array_merge($arr, getCateChildByPid($cates,$v['id']));
			}
		}

        return $arr;
    }

    //获取目录文件
    function getFiles($path, $Order = 0) {
        
        if( !is_dir($path)) mkdir($path);
        $FilePath = opendir($path);
        while (false !== ($filename = readdir($FilePath))) {
            $FileAndFolderAyy[] = array(
                'name'=>$filename,
                'time'=>getfiletime($filename,$path),
                'size'=>getfilesize($filename,$path)
            );
        }
        $Order == 0 ? sort($FileAndFolderAyy) : rsort($FileAndFolderAyy);
        return $FileAndFolderAyy;
    }

    //获取文件修改时间
	function getfiletime($file, $DataDir) {
	    $a = filemtime($DataDir .DS. $file);
	    $time = date("Y-m-d H:i:s", $a);
	    return $time;
	}

	//获取文件的大小
	function getfilesize($file, $DataDir) {
	    $perms = stat($DataDir .DS. $file);
	    $size = $perms['size'];
	    // 单位自动转换函数
	    $kb = 1024;         // Kilobyte
	    $mb = 1024 * $kb;   // Megabyte
	    $gb = 1024 * $mb;   // Gigabyte
	    $tb = 1024 * $gb;   // Terabyte

	    if ($size < $kb) {
	        return $size . " B";
	    } else if ($size < $mb) {
	        return round($size / $kb, 2) . " KB";
	    } else if ($size < $gb) {
	        return round($size / $mb, 2) . " MB";
	    } else if ($size < $tb) {
	        return round($size / $gb, 2) . " GB";
	    } else {
	        return round($size / $tb, 2) . " TB";
	    }
	}

    /**
    * 格式化字节大小
    * @param  number $size      字节数
    * @param  string $delimiter 数字和单位分隔符
    * @return string            格式化后的带单位的大小
    */
    function format_bytes($size, $delimiter = '') {
        $units = array('B', 'KB', 'MB', 'GB', 'TB', 'PB');
        for ($i = 0; $size >= 1024 && $i < 5; $i++) $size /= 1024;
        return round($size, 2) . $delimiter . $units[$i];
    }
?>