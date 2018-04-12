<?php
namespace app\admin\controller;

use think\Request;
use think\Config as C;

class Upload extends Common{

   const IMAGE  = '_image';//单图片
   const IMAGES = '_images';//多图片
   const FILE   = '_file';//单文件
   const FILES  = '_files';//多文件

    //上传单图片 input标签name必须为_image
    public function uploadImg(Request $request)
    {
        $file = $request->file(self::IMAGE);
        $ext = C::get('upload.image');
        $json = $this->doUpload($file,$ext,'图片上传成功!',true);
        return json($json);
    }

    //上传单文件  input标签name必须为_file
    public function uploadFile(Request $request)
    {
        $file = $request->file(self::FILE);
        $ext = C::get('upload.file');
        $json = $this->doUpload($file,$ext,'附件上传成功!');
        return json($json);
    }

    private function doUpload($file,$ext,$msg='文件上传成功!',$vater=FALSE){
        
        if (!empty($file)) {
            // 移动到框架应用根目录/public/uploads/ 目录下
            $info = $file->validate(['ext' => $ext,'size'=>(C::get('upload.maxsize')*1048576)])->move(ROOT_PATH . 'public' . DS .
'upload');
            if ($info) {
                $thumb =  $info->getSaveName();
                //处理添加水印
                if($vater){
                    $_path = ROOT_PATH . 'public' . DS . 'upload'.DS.$thumb;
                    setVater($_path);
                }
                
                return ['code'=>1,'msg'=>$msg,'url'=>$thumb,'info'=>$info->getInfo()];
            } else {
                // 上传失败获取错误信息
                $this->error($file->getError());
            }
        }else{
            return ['code'=>0,'msg'=>'没有选择上传的文件!'];
        }
    }
}
?>