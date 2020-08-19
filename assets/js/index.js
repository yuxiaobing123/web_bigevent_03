$(function () {

    // 渲染用户的头像信息
    getUserInfo();


    var layer = layui.layer;
    // 点击退出按钮实现退出功能
    $('.btnLogout').on('click', function () {
        // 弹出一个弹出层询问用户是否确认退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 下边是用户点击确定之后要做的事
            // 1、清除token
            localStorage.removeItem('token');
            // 2、页面跳转到登录页面
            location.href = '/login.html';

            // 关闭弹出层
            layer.close(index);
        });
    });


});

// 获取用户的信息函数
// 这个函数要封装到入口函数的外边  使其成为一个全局函数
// 方便后边其他页面进行调用
function getUserInfo() {
    // 发送ajax请求
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                console.log(res);
                return layui.layer.msg(res.message);
            }
            // 否则就是成功获取用户信息
            // 然后调用渲染用户头像信息的函数
            renderAvatar(res.data);
        }
    })
};


// 渲染用户头像信息的函数
function renderAvatar(user) {
    // 1、设置欢迎用户名
    // 先判断用户是否有昵称，如果有昵称，欢迎后边就显示昵称
    // 否则就显示用户名
    var name = user.nickname || user.username;
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name);

    // 2、设置头像
    // 如果用户有头像就显示头像
    // 如果没有头像就显示文字头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 否则就是没有头像，就显示文字头像 
        // 将用户的第一个字符当成头像
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
        $('.layui-nav-img').hide();
    }

}