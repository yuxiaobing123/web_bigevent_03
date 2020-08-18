$(function () {

    // 无论是发起ajax请求还是get请求，亦或是post请求
    // 都会调用$.ajaxPrefilter函数
    // 可以拿到我们的内置对象

    var baseURL = 'http://ajax.frontend.itheima.net';
    $.ajaxPrefilter(function (options) {
        options.url = baseURL + options.url;
    });


});