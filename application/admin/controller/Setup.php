<?php
namespace app\admin\controller;

use think\Request;
use think\Config as C;

class Setup extends Common {

    public function index()
    {
        return $this->fetch();
    }

    //站点设置
    public function setSite(Request $request)
    {
        $post = $request->param();
        //设置配置文件路径
        $path = APP_PATH . 'extra' . DS .'site.php';
        
        if(false !== writeConf($path,$post)){
            return json(['code'=>1,'msg'=>'修改成功!']);
        }else{
            return json(['code'=>0,'msg'=>'修改失败!']);
        }
        
    }

    //验证码设置
    public function setVerify(Request $request)
    {
        $method = strtoupper($request->method());
        if( 'POST' == $method ) {
            $post = $request->param();
            //设置配置文件路径
            $path = APP_PATH . 'extra' . DS .'captcha.php';
            //获取当前验证设置
            $verifyConf = C::get('captcha');
            //合并
            $post = array_merge($verifyConf, $post);
            //背景颜色转换成数组
            $post['bg'] = explode(',',$post['bg']);
            //转换数据类型
            'false' == $post['useZh']?$post['useZh'] = false:$post['useZh'] = true;
            'false' == $post['on']?$post['on'] = false:$post['on'] = true;
            'false' == $post['useNoise']?$post['useNoise'] = false:$post['useNoise'] = true;
            'false' == $post['useCurve']?$post['useCurve'] = false:$post['useCurve'] = true;
            //写入配置文件
            if(false !== writeConf($path,$post)){
                return json(['code'=>1,'msg'=>'修改成功!']);
            }else{
                return json(['code'=>0,'msg'=>'修改失败!']);
            }
        } else if( 'GET' == $method ) {
            return $this->fetch();
        } 
    }

    //获取字体文件
    public function getFonts($type='en')
    {
        //获取当前设置的字体
        $checked_ttf = C::get('captcha.fontttf');
        //字体文件路径
        if( 'en' == $type ){
            $path = VENDOR_PATH . 'topthink' . DS . 'think-captcha'. DS . 'assets'. DS . 'ttfs';
        }else if('cn' == $type){
            $path = VENDOR_PATH . 'topthink' . DS . 'think-captcha'. DS . 'assets'. DS . 'zhttfs';
        }
        $files = scandir($path);
        if($files && count($files) > 2){
            return json(['code'=>1,'files'=>$files,'_checked'=>$checked_ttf]);
        }else{
            return json(['code'=>0,'msg'=>'获取字体文件失败!']);
        }
        
    }

    //附件上传设置
    public function setUpload(Request $request)
    {
        $method = strtoupper($request->method());
        if( 'POST' == $method ) {
            $post = $request->param();
            //设置配置文件路径
            $path = APP_PATH . 'extra' . DS .'upload.php';
            //写入配置文件
            if(false !== writeConf($path,$post)){
                return json(['code'=>1,'msg'=>'修改成功!']);
            }else{
                return json(['code'=>0,'msg'=>'修改失败!']);
            }
        } else if( 'GET' == $method ) {
            return $this->fetch();
        }
    }

    //水印设置
    public function setVater(Request $request)
    {
        $method = strtoupper($request->method());
        if( 'POST' == $method ) {
            $post = $request->param();
            //设置配置文件路径
            $path = APP_PATH . 'extra' . DS .'vater.php';
            //获取当前验证设置
            $conf = C::get('vater');
            //合并
            $post = array_merge($conf, $post);
            'false' == $post['on']?$post['on'] = false:$post['on'] = true;
            'false' == $post['cate_on']?$post['cate_on'] = false:$post['cate_on'] = true;
            'false' == $post['article_thumb_on']?$post['article_thumb_on'] = false:$post['article_thumb_on'] = true;
            'false' == $post['article_content_on']?$post['article_content_on'] = false:$post['article_content_on'] = true;
            //写入配置文件
            if(false !== writeConf($path,$post)){
                return json(['code'=>1,'msg'=>'修改成功!']);
            }else{
                return json(['code'=>0,'msg'=>'修改失败!']);
            }
            return json();
        } else if( 'GET' == $method ) {
            return $this->fetch();
        }
    }

    //获取水印字体文件列表
    public function getVaterTtf()
    {
        $path = ROOT_PATH . 'public' . DS . 'static'. DS . 'vater'. DS . 'ttfs';
        $files = scandir($path);
        $checked_ttf = C::get('vater.fontttf');
        if($files && count($files) > 2){
            return json(['code'=>1,'files'=>$files,'_selected'=>$checked_ttf]);
        }else{
            return json(['code'=>0,'msg'=>'获取字体文件失败!']);
        }
    }
}

?>