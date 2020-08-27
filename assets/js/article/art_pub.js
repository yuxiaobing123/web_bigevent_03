$(function () {

    var layer = layui.layer;
    var form = layui.form;

    // 初始化富文本编辑器
    initEditor()

    initCate()
    // 定义渲染文章类别的函数
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类数据失败！')
                }
                // layer.msg(res.message)

                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                // 再次调用layui.render() 方法重新渲染表格数据
                form.render()
            }
        })
    }


    // 封面裁剪区域
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 给选择封面按钮绑定单击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 监听coverFile 表单的change事件
    // 将用户选择的文件设置到裁剪区域中
    $('#coverFile').on('change', function (e) {
        // 获取到用户选择文件的列表区域
        var files = e.target.files
        // console.log(files);
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 然后根据用户选择的文件创建url地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })


    // 定义文章的发布状态
    var art_state = '已发布'
    // 给存为草稿按钮绑定点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })


    // 由于发布文章的接口涉及到文件上传的功能，因此提交的请求体，必须是 FormData 格式！
    // 基于form表单创建FormData对象
    $('#form-pub').on('submit', function (e) {
        // 1、阻止表单的默认提交行为
        e.preventDefault()
        // 2、基于form表单快速创建一个FormData对象
        var fd = new FormData($(this)[0])
        // 3、将上述文章的发布状态追加到该对象中
        fd.append('state', art_state)
        // 4、将封面裁剪后的图片追加到fd对象中
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    })

    // 定义发布文章的函数
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('文章发布失败！')
                }
                layer.msg(res.message)
                window.parent.document.getElementById('art_list').click()
                location.href = '/article/art_list.html'
            }
        })
    }







})


