$(function () {

    var layer = layui.layer;
    var form = layui.form;


    initCateList();
    // 定义获取文章分类数据的函数
    function initCateList() {
        // 发起ajax请求获取文章的分类数据列表
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类数据失败！');
                }
                // layer.msg(res.message);

                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        });
    };

    // 给添加分类的按钮绑定单击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {

        // 点击添加分类按钮会弹出一个弹出层
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $("#form-add").html()
        });
    });

    // 通过事件委托的形式监听添加分类中表单的提交事件
    $("body").on("submit", '#formAadd', function (e) {
        e.preventDefault();

        // 发送ajax请求新增文章分类
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加文章分类失败！');
                }

                layer.msg(res.message);
                // 关闭弹出层
                layer.close(indexAdd);
                // 重新渲染文章分类的表格数据
                initCateList();
            }
        });


    });


    // 给编辑按钮添加单击事件
    // 由于编辑按钮是在动态生成的，所以要用事件委托的形式添加
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        // 点击添加分类按钮会弹出一个弹出层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $("#form-edit").html()
        });

        var id = $(this).attr('data-id');
        // console.log(id);

        // 发送ajax请求获取文章的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类数据失败！');
                }

                // 快速为表单赋值 
                //  但是不要忘了给表单加上lay-filter属性
                form.val('form-Edit', res.data);
            }
        });
    });

    // 给编辑按钮弹出层中的表单绑定提交事件
    $('body').on('submit', '#formEdit', function (e) {
        e.preventDefault();

        // 发送POST请求重新获取修改后的文章分类列表
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改文章分类失败！');
                }
                layer.msg(res.message);
                layer.close(indexEdit);
                initCateList();
            }
        });
    });

    // 给删除按钮绑定单击事件
    $('tbody').on('click', '.btn-delete', function () {

        var id = $(this).attr('data-id');
        console.log(id);

        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            // 根据id删除分类数据
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！');
                    }
                    layer.msg(res.message);
                    initCateList();
                    layer.close(index);
                }
            });
        });
    });





});