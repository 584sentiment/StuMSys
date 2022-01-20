var students = [],//students信息中转
    tn = 0,//total pages num
    cn = 1,//current page num
    mn = 8,//max-num of pages to show
    ppn = 10,//每页显示信息数量
    editId = null;//

// 菜单选项切换
$('#menu li').click(function () {
    tab($(this).index())
})

function tab(n) {
    n === 1 && clearForm();
    $('#menu li').eq(n).addClass('active').siblings().removeClass('active');
    $('#content > div').eq(n).addClass('active').siblings().removeClass('active');
}

// 初始化表格
function init() {
    // 如果本地有数据，渲染本地数据，如果本地没有数据
    // 请求数据并渲染
    if (localStorage.students) {
        students = JSON.parse(localStorage.students);
        tn = Math.ceil(students.length / ppn)
        renderList();
    } else {
        initData();
    }
}
init();

function initData() {
    $.ajax({
        url: "/initDatas",
        dataType: "json",
        success: function (res) {
            students = res.data;
            // 存储到本地
            // console.log(students)
            localStorage.students = JSON.stringify(students);
            tn = Math.ceil(students.length / ppn);
            // console.log(tn);
            renderList();
        }
    })
}

function renderList() {
    renderTable();
    $('#page').page({
        cn,
        tn,
        mn,
        callBack: function (n) {
            cn = n;
            renderTable();
        }
    })
}

function renderTable() {
    // 根据当前页截取
    var data = students.slice((cn - 1) * 10, cn * 10);
    var thead = `
    <thead>
        <tr>
            <th>学号</th>
            <th>姓名</th>
            <th>性别</th>
            <th>邮箱</th>
            <th>年龄</th>
            <th>手机号</th>
            <th>住址</th>
            <th>操作</th>
        </tr>
    </thead>
    `
    var tbody = data.map(item => {
        return `<tr>
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.sex}</td>
        <td>${item.email}</td>
        <td>${item.age}</td>
        <td>${item.tel}</td>
        <td>${item.add}</td>
        <td>
            <button class="editBtn btnBg1" data-id=${item.id}>编辑</button>
            <button class="delBtn btnBg2" data-id=${item.id}>删除</button>
        </td>
    </tr>`
    }).join('');

    $('.studentTable').html(`<table>${thead}<tbody>${tbody}</tbody></table>`)
}

// 随机新增
$('#randomAdd').click(function () {
    $.ajax({
        url: '/addRandom',
        dataType: 'json',
        success: function (res) {
            students.push(res);
            localStorage.students = JSON.stringify(students);
            tn = Math.ceil(students.length / ppn);
            cn = tn;
            renderList();
        }
    })
})

// 点击搜索按钮时
// 1.获取select值
// 2.获取input值
// 3.发送请求
$('#searchBtn').click(function () {
    var select = $('.searchBox select').val();
    var word = $('.searchBox input').val();
    // console.log(select,word)
    if (!word) {
        alert("请输入要搜索的内容");
        return;
    }

    $.ajax({
        url: '/searchStu',
        type: 'POST',
        data: {
            select,
            word
        },
        dataType: 'json',
        success: function (res) {
            // console.log(res)
            if (!res.length) {
                // 没有搜索到数据
                $('.studentTable').html('');
                $('#page').html('抱歉！没有找到您想要的数据。');
            } else {
                students = res;
                tn = Math.ceil(students.length / ppn);
                cn = 1;
                renderList();
            }
        }
    })

})

// 绑定按键
$('.searchBox input').keydown(function (e) {
    // console.log(e.key);
    if (e.key === 'Enter') {
        $('#searchBtn').click();
    };
    if (e.key === 'Escape') {
        $('#backBtn').click();
    };

});

// 返回按钮
$('#backBtn').click(function () {
    $('.searchBox input').val('');
    students = JSON.parse(localStorage.students);
    tn = Math.ceil(students.length / ppn);
    cn = 1;
    renderList();
})

// 自定义新增
$('#customAdd').click(function () {
    tab(1);
})

// 表单验证
$('#name').blur(function () {
    if (!$(this).val()) {
        $('#validateName').html('请输入姓名');
        return;
    }
    $('#validateName').html('');
})

$('#email').blur(function () {
    if (!$(this).val()) {
        $('#validateEmail').html('邮箱不能为空');
        return;
    }
    if (!/^[\w\.-]+@[\w-]+\.[a-z]+$/.test($(this).val())) {
        $('#validateEmail').html('邮箱格式不正确');
        return;
    }
    $('#validateEmail').html('');
})

$('#age').blur(function () {
    if (!$(this).val()) {
        $('#validateAge').html('年龄不能为空');
        return;
    }
    if ($(this).val() <= 0 || $(this).val() > 100) {
        $('#validateAge').html('年龄不合适');
        return;
    }
    $('#validateAge').html('');
})
$('#tel').blur(function () {
    if (!$(this).val()) {
        $('#validateTel').html('电话不能为空');
        return;
    }
    if (!/^1[3578][0-9]\d{8}/.test($(this).val())) {
        $('#validateTel').html('您输入的电话不合法');
        return;
    }
    $('#validateTel').html('');
})

$('.returnBtn').click(function () {
    tab(0);
})

// 编辑按钮
$('.studentTable').on('click', '.editBtn', function () {
    tab(1);
    $('.submitBtn').text('确认修改');
    var id = this.dataset.id;
    $.ajax({
        url: '/editStu',
        type: 'post',
        dataType: 'json',
        data: {
            id
        },
        success: function (res) {
            // console.log(res)
            $('#name').val(res[0].name);
            $('#age').val(res[0].age);
            $('#tel').val(res[0].tel);
            $('#email').val(res[0].email);
            $('#address').val(res[0].add);
            editId=res[0].id;
            if (res[0].sex === '男') {
                $('#male').prop('checked', true)
                $('#female').prop('checked', false)
            } else {
                $('#male').prop('checked', false)
                $('#female').prop('checked', true)
            }
        }
    })
})

// 清空表格
function clearForm() {
    $('#addForm')[0].reset();//取到原生js对象，调用原生方法
    $('.submitBtn').text('提交');
    $('.regValidate').html('');
}

// 提交&确认修改
$('#addForm .submitBtn').click(function () {
    var arr = $('#addForm').serializeArray();
    console.log(arr)
    //序列化表单表格元素，并返回一个???json格式的数据
    var isNull = arr.every(item => {
        return item.value !== '';
    })
    if (!isNull) {
        alert('请填写每一项');
        return;
    }
    var isCorrect = $('.regValidate').toArray().every(item => {
        return $(item).html() === ''
    })
    if (!isCorrect) {
        // 不可以提交
        alert('存在不正确的填写');
        return;
    }
    var newStu = {
        name: arr[0].value,
        sex: arr[1].value,
        email: arr[2].value,
        age: arr[3].value,
        tel: arr[4].value,
        add: arr[5].value,
    }
    if ($(this).text() === '提交') {
        // 新增
        $.ajax({
            url: '/addCustom',
            type: 'post',
            dataType: 'json',
            data: newStu,
            success: function (res) {
                students = res;
                localStorage.students=JSON.stringify(students);
                tn = Math.ceil(students.length / ppn);
                cn = tn;
                renderList();
                tab(0);
            }
        })
    } else {
        // 修改
        newStu.id=editId;
        $.ajax({
            url: '/edit',
            type: 'post',
            dataType: 'json',
            data: newStu,
            success: function (res) {
                students = res;
                renderList();
                tab(0);
            }
        })
    }
})

// 删除学生
$('.studentTable').on('click', '.delBtn', function () {
    if(confirm('确认删除该学生信息吗？删除后不可恢复！')){
        var id=this.dataset.id;
        $.ajax({
            url:`/del/${id}`,
            type:"delete",
            dataType:'json',
            success:function(res){
                // console.log(res);
                localStorage.students=JSON.stringify(res);
                tn=Math.ceil(res.length/ppn);
                if(cn>tn){
                    cn=tn;
                }
                renderList();
            }
        })
        // alert('删除成功！')
    }
})
