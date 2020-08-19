$(function () {

    // 无论是发起ajax请求还是get请求，亦或是post请求
    // 都会调用$.ajaxPrefilter函数
    // 可以拿到我们的内置对象

    var baseURL = 'http://ajax.frontend.itheima.net';
    $.ajaxPrefilter(function (options) {
        options.url = baseURL + options.url;


        // 统一给有权限的接口设置请求头headers
        if (options.url.indexOf("/my/") !== -1) {
            options.headers = {
                Authorization: localStorage.getItem("token") || ''
            }
        }


        // 无论ajax请求是否请求成功，都会调用complete函数
        // 可以利用complete函数控制用户的访问权限
        options.complete = function (res) {
            // console.log(res);
            // 在返回的responseJSON中可以拿到请求的信息
            // 判断responseJSON信息的状态来判断用户是否使用了用户名和密码登录
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 1、强制清空token
                localStorage.removeItem('token');
                // 2、页面重新跳转到登录页面
                location.href = '/login.html';
            }
        }

    });




});