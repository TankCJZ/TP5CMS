<?php
//获取站点信息
function site($name=''){
    echo config('site.'.$name);
}

//日期装换成date格式 如201708 => 2017年08月
function strtodate($str='',$format="Y年m月"){
    $time = strtotime($str.'01');
    $date = date($format, $time);
    return $date;
}

?>