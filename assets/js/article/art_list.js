$(function () {

    var layer = layui.layer;
    var form = layui.form;

    // 定义美化时间的过滤器
    template.defaults.imports.dateFormat = function (date) {
        var dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 定义时间补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    // 先定义一个查询对象 q
    var q = {
        pagenum: 1,  // 页码值  默认显示第一页的内容
        pagesize: 2, // 每页显示多少条数据  默认每页显示2条
        cate_id: '', //  文章分类的 Id
        state: ''   //  文章发布的状态，可选值有：已发布、草稿
    }

    initArtList()
    // 定义初始化文章列表的函数
    function initArtList() {

        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！');
                }

                var htmlStr = template('tpl-list', res);
                $('tbody').html(htmlStr);
                // 调用渲染分页的方法
                renderPage(res.total)
            }

        })
    }


    // 发请求获取并渲染文章分类的下拉菜单
    // 初始化文章分类的方法
    inintCate()

    function inintCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项、
                var htmlStr = template('tpl-cate', res)
                $("[name=cate_id]").html(htmlStr)
                // 调用layui的render() 方法重新渲染表单的UI结构
                form.render()
            }
        })
    }

    // 实现筛选功能
    // 需要先获取筛选按钮所在表单的提交事件
    $('#form-search').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()

        // 获取表单中文章分类和文章状态下拉选择框的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        // 给查询对象q重新赋值
        q.cate_id = cate_id
        q.state = state

        // 根据最新的查询对象q重新渲染表格数据
        initArtList()
    })


    // 分页区域、
    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        layui.use('laypage', function () {
            var laypage = layui.laypage;

            //执行一个laypage实例
            laypage.render({
                elem: 'pageBox',  //注意，这里的 pageBox 是 ID，不用加 # 号
                count: total, //数据总数，从服务端得到
                limit: q.pagesize, // 每页显示的条数
                curr: q.pagenum, //  设置被默认选中的分页
                layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
                limits: [2, 3, 5, 10],// 每页展示多少条
                // 分页发生切换的时候， 会触发 jump 回调
                // 触发jump回调的方式有两种
                // 1、点击页码的时候会触发jump回调
                // 2、只要调用了 laypage.render() 方法，就会触发jump 回调
                jump: function (obj, first) {
                    // 可以通过 first 的值来判断是通过哪种方式触发的jump回调
                    // 如果first的值为true，证明是方式2触发的
                    // 否则就是方式1触发的
                    // console.log(obj.curr);
                    // 把最新的页码值赋值给查询参数q
                    // console.log(obj);
                    q.pagenum = obj.curr
                    // 把最新的条目数也赋值给q
                    q.pagesize = obj.limit
                    // initArtList()
                    // 首次不执行
                    if (!first) {
                        initArtList()
                    }
                }
            });
        });
    }


    // 实现删除文章的功能
    // 给删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 点击删除按钮，获取当前页面中删除按钮的个数
        var len = $('.btn-delete').length;
        // console.log(len);
        // 先获取到文章的id
        var id = $(this).attr('data-id')
        // 弹出询问框询问用户是否确定删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            // 发送ajax请求，根据id删除文章
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }

                    layer.msg(res.message);
                    // 当文章删除成功后，需要判断当前页面是否还有数据
                    // 如果没有数据之后要让页码值减去1，然后再调用渲染页面数据的方法重新渲染页面数据
                    // 但是页码值的最小值也是1
                    if (len === 1) {
                        // 如果删除按钮的个数等于1，就说明删除当前数据之后该页面就没有了其他数据，就应该让页码值减1
                        q.pagenum = q.pagenum === 1 ? q.pagenum : q.pagenum - 1;
                    }
                    initArtList()
                    // 关闭弹出层
                    layer.close(index);
                }
            })



        });

    })

























});