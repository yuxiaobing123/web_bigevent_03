$(function () {

    var form = layui.form;
    var layer = layui.layer;

    // 为表单添加校验规则
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间！';
            }
        }
    });


    initUserInfo();
    // 初始化用户的基本信息
    function initUserInfo() {
        // 发送ajax请求
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }

                // 利用for.val快速为表单赋值
                form.val('formUserInfo', res.data);
            }
        })
    };

    // 点击重置按钮 会清空用户的修改
    $("#btnreset").on("click", function (e) {
        // 阻止默认的跳转行为
        e.preventDefault();

        // 然后重新初始化用户的基本信息
        initUserInfo();
    });


    // 监听表单的提交事件  保存用户的修改  并重新初始化用户的修改
    // 然后首页的用户的头像旁边的欢迎后边的文字也要修改   这里只需要调用父窗口的渲染用户个人信息的函数即可
    $(".layui-form").on("submit", function (e) {
        e.preventDefault();


        // 发起POST请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $('.layui-form').serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败！');
                }
                layer.msg(res.message);
                // 然后调用父窗口的方法  重新渲染用户的头像和用户名
                window.parent.getUserInfo();
            }
        })


    });




});