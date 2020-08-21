$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    // 给上传按钮绑定点击事件
    $("#btnUpload").on("click", function () {
        $("#file").click();
    });



    // 给文件选择框绑定change事件
    $('#file').on('change', function (e) {
        // console.log(e);
        // 获取到用户选择的文件
        var filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg('请选择图片文件进行更改头像！');
        }
        // 1、先拿到用户选择的图片文件
        var file = e.target.files[0];
        // console.log(file);
        // 2、将图片文件转化成一个路径
        var imgURL = URL.createObjectURL(file);
        // 3、先销毁旧的裁剪区域，然后重新设置图片的路径  之后再创建一个新的图片裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    // 将用户裁剪完成的图片上传到服务器


    // 给确定按钮绑定点击事件
    $("#btnChangeAvatar").on("click", function () {

        // 先拿到用户裁剪后的图片
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')
        // 发送ajax请求将头像上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('上传头像失败！');
                }
                layer.msg(res.message);
                // 然后调用父窗口的更新用户信息的函数重新渲染用户信息
                window.parent.getUserInfo();
            }
        })
    })



});