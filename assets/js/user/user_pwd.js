$(function () {

    var form = layui.form;

    // 定义校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],

        // 新旧密码不能相同
        // value值拿到的是新密码框的内容
        samePwd: function (value) {
            if (value === $("[name=oldPwd]").val()) {
                return '新旧密码不能相同！';
            }
        },

        // 再次确认密码  保证新密码输入的两次要相同
        // value值取到的是再次确认密码框的值
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码输入不一致，请重新输入！';
            }
        }
    });

    // 发起ajax请求实现修改密码的功能
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改密码失败！');
                }
                layer.msg('修改密码成功！')
                // 清空表单
                $('.layui-form')[0].reset();
            }
        });


    })






});