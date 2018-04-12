var MemberModel = function(){
    this.Otable = null;
    return {
        init: function(ele,url){
            this.Otable = $(ele).DataTable({
                'ajax': url,//获取ajax信息
                "aLengthMenu": [
                    [5, 10, 20, 50, 100, -1],
                    [5, 10, 20, 50, 100, "All"]
                ],
                'paging': true,//分页
                'ordering': false,//是否启用排序
                "iDisplayLength": 20,//默认显示多少页
                "sPaginationType": "bootstrap",//分页样式
                "sDom": "Tflt<'row DTTTFooter'<'col-sm-6'i><'col-sm-6'p>>",
                "language": {
                    "search": "",
                    "sLengthMenu": "_MENU_",
                    "oPaginate": {
                        "sPrevious": "上一页",
                        "sNext": "下一页"
                    },
                    "zeroRecords": "没有数据！",
                    //下面三者构成了总体的左下角的内容。
                    'info': "总共_PAGES_ 页，显示第_START_ 到第 _END_ ，筛选之后得到 _TOTAL_ 条，初始_MAX_ 条 ",//左下角的信息显示，大写的词为关键字。
                    'infoEmpty': "0个数据",//筛选为空时左下角的显示。
                    'infoFiltered': ""//筛选之后的左下角筛选提示，
                },
                "columns": [
                    { "data": 'id'},
                    { "data": 'username' },
                    { "data": 'email' },
                    { "data": 'regip'},
                    { "data": 'lastlogintime'},
                    { "data": 'group_name'},
                    { "data": 'status'},
                    { "data": 'id'}
                ],
                "columnDefs":[{
                    "render": function(data, type, row, meta) {
                        var data = new Date(data*1000);
                        data = data.toLocaleString();
                        return data;
                    },
                    //指定是第8列
                    "targets": 4
                },{
                    "render": function(data, type, row, meta) {
                        //渲染 
                        var _html = null;
                        if(0 == data){
                            _html = '<div style="position: relative;"><label class="height20 margin-b0"><input data-id="'+row.id+'" checked="checked" class="checkbox-slider slider-icon disabled-member" type="checkbox" value="'+data+'" name="status"><span class="text"></span></label></div>';
                        }else if(1 == data){
                            _html = '<div style="position: relative;"><label class="height20 margin-b0"><input data-id="'+row.id+'" class="checkbox-slider slider-icon disabled-member" type="checkbox" value="1" name="status"><span class="text"></span></label></div>'; 
                        }
                        //渲染 
                        return _html;
                    },
                    //指定是第8列
                    "targets": 6
                },{
                    "render": function(data, type, row, meta) {
                        //渲染 
                        return '<div class="btn-group"><a href="javascript:;" data-id="'+data+'" class="btn btn-info btn-xs edit"><i class="fa fa-edit"></i> 修改</a><a data-id="'+data+'" href="javascript:;" class="btn btn-danger btn-xs delete"><i class="fa fa-trash-o"></i> 删除</a></div>';
                    },
                    //指定是第8列
                    "targets": 7
                }]
            });
        }, 
        
        openModel: function(modelID,title,size,callback){
            layer.open({
                type: 1,
                title: title,
                closeBtn: 1,
                area: size,
                skin: 'layui-layer-nobg', //没有背景色
                shadeClose: true,
                resize: true,
                content: $(modelID),
                success: function(layero,index){
                    callback(index);
                }
            });
        },

        //删除单个
        delOne: function(url,callback){
            $.getJSON(url,function(res){
                callback(res);
            });
        },

        //更新排序
        edit: function(url,data,callback){
            $.post(url,data,function(res){
                callback(res);
            });
        },

        //禁用
        disabled: function(url,bool,callback){
            var _url = null;
            if(bool){
                _url = url + '/0';
            }else{
                _url = url + '/1';
            }
            $.getJSON(_url,function(res){
                callback(res);
            });
        },

        //重新加载数据
        reload: function(){
            this.Otable.ajax.reload();
        }
    };
}();
//初始化数据
MemberModel.init('#adstables','/admin/member/ajaxData');

//添加会员==============//
var addLayer = null;
$('.add-member').on('click',function(){
    //清空数据
    $('#addMemberModel input[type=text]').val('');
    MemberModel.openModel('#addMemberModel','添加网站会员',['425px','425px'],function(_layer){
        addLayer = _layer;
        //获取管理员组列表
        $.getJSON('/admin/member/getGroup',function(res){
            if(res.code > 0){
                if(res.groups.length > 0){
                    var _html = '';
                    res.groups.forEach(function(ele) {
                        _html += '<option value="'+ele.id+'">'+ele.name+'</option>';
                    }, this);
                }
                $('#addMemberModel #group_id').html(_html);
            }else{
                layer.msg(res.msg);
            }
        });
    });
});
//添加
$('.add-member-btn').on('click',function(){
    var form = $('#addMemberModel').find('form').serialize();
    //验证
    if( !checkForm('#addMemberModel',true)){
        return false;
    }
    $.post('/admin/member/add',form,function(res){
        Common.showMsg(res,function(){
            if(res.code == 1) layer.close(addLayer);
            MemberModel.reload();
        });
    });
});
//删除会员==============//
$('#adstables').on('click','a.delete',function(){
    var id = $(this).data('id');
    layer.confirm('你确定要删除该会员吗？', {
        btn: ['确定','取消'] //按钮
    }, function(){
        MemberModel.delOne('/admin/member/del/'+id,function(res){
            Common.showMsg(res,function(){
                MemberModel.reload();
            });
        });
    });
});
//禁用状态==============//
$('#adstables').on('click','.disabled-member',function(){
    var that = $(this);
    var id = $(this).data('id');
    var bool = false;
    if(that.prop('checked')) bool = true;
    MemberModel.disabled('/admin/member/disabled/'+id,bool,function(res){
        layer.msg(res.msg,function(){
            if(res.code == 0){
                that.prop('checked',!bool);
            }
        });
    });
});
//修改会员==============//
var editLayer = null;
$('#adstables').on('click','a.edit',function(){
    var id = $(this).data('id');
    $.get('/admin/member/edit/'+id,function(res){
        if(res.code == 1){
            //设置模型数据
            setModeVal(res);
        }else{
            layer.msg(res.msg);
        }
    });
});
//提交修改
$('.edit-member-btn').on('click',function(){
    //验证
    if( !checkForm('#editMemberModel',false)){
        return false;
    }
    var form = $('#editMemberModel #edit-member-form').serialize();
    MemberModel.edit('/admin/member/edit',form,function(res){
        Common.showMsg(res,function(){
            if(res.code == 1) layer.close(editLayer);
            MemberModel.reload();
        });
    });
});
//赋值
function setModeVal(data){
    $('#editMemberModel .member').val(data.member.username);
    $('#editMemberModel .nickname').val(data.member.nickname);
    $('#editMemberModel .email').val(data.member.email);
    $('#editMemberModel .phone').val(data.member.phone);
    $('#editMemberModel .id').val(data.member.id);
    //会员组
    var _ops = '';
    data.groups.forEach(function(ele){
        if( ele.id == data.member.group_id ){
            _ops += '<option selected value="'+ele.id+'">'+ele.name+'</option>';
        }else{
            _ops += '<option value="'+ele.id+'">'+ele.name+'</option>';
        }
    },this);
    $('#editMemberModel .group_id').html(_ops);

    MemberModel.openModel('#editMemberModel','修改会员信息',['425px','425px'],function(_layer){
        editLayer = _layer;
    });
}
function checkForm(form,notcheck){
    var email = $(form+' .email');
    var phone = $(form+' .tel');
    var pass = $(form+' .password');
    var member = $(form+' .member');
    
    if( !Validate.isMember(member.val()) ){
        tips('会员名长度为4到10位，包含数字字母下划线!',member);
        member.focus();
        return false;
    }

    if(notcheck) {
        if( !Validate.isPassword(pass.val()) ){
            tips('密码长度为6到12位，包含数字字母下划线!',pass);
            pass.focus();
            return false;
        }
    }
    if( !Validate.isEmail(email.val()) ){
        tips('邮箱格式不正确!',email);
        email.focus();
        return false;
    }
    if( $.trim(phone.val()).length > 0){
        if( !Validate.isPhone(phone.val()) ){
            tips('手机号码格式不正确!',phone)
            phone.focus();
            return false;
        }
    }
    function tips(msg,ele){
        layer.tips(msg, ele, {
            tips: 3
        });
    }
    return true;
}