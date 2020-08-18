$(function () {

    // 点击去注册账号，页面跳转到注册的页面
    $("#link-reg").on("click", function () {
        $(".form-login").hide().siblings('.form-reg').show();
    })

    // 点击去登录按钮，页面跳转到登录的窗口
    $("#link-login").on("click", function () {
        $(".form-reg").hide().siblings('.form-login').show();
    })

    var layer = layui.layer;
    var form = layui.form;
    // 给需要验证的表单添加验证规则
    // 用layui的verify方法
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

        // 再次确认密码的验证规则，保证两次密码的输入一致
        // 形参拿到的是再次确认密码框内的内容
        repwd: function (value) {
            var pwd = $(".form-reg [name=password]").val();
            if (value !== pwd) {
                return '两次密码输入不一致！';
            }
        }
    });

    // 给注册按钮添加点击事件
    $("#formReg").on("submit", function (e) {
        e.preventDefault();
        // 发起POST请求 注册用户名
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $(".form-reg [name=username]").val(),
                password: $(".form-reg [name=password]").val()
            },
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功，请登录！');
                // 用户注册账号成功
                // 页面跳转到登录页面
                $("#link-login").click();
                // 注册页面的表单重置  调用DOM对象的reset方法
                $("#formReg")[0].reset();
            }
        });
    });


    // 发起登录的ajax请求
    $("#formLogin").on("submit", function (e) {
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }

                layer.msg('登录成功！');
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token);
                location.href = '/index.html';
            }
        })
    });

});