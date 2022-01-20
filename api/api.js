var template = {
    'id|+1': 1,
    'name': '@cname',
    'sex|1': ['男', '女'],
    'email': '@email',
    'age|20-30': 1,
    'tel': /^1[3578][1-9]\d{8}/,
    'add': '@city'
};

// 生成默认数据
Mock.mock('/initDatas', {
    status: 'success',
    msg: '请求成功',
    'data|5': [template]
});

//随机生成一条数据 
Mock.mock('/addRandom', function () {
    var newData = Mock.mock(template);
    var students = JSON.parse(localStorage.students);
    newData.id = parseInt(students[students.length - 1].id) + 1;
    // console.log(newData)
    return newData;
});

function queryToObj(str){//将url中的key=value&key=value...解析成对象
    var result = {};
    var url = new URL('http://www.wsn.com/?'+str);
    
    for(param of url.searchParams){
        // console.log(param)
        result[param[0]]=param[1];
    }
    return result;
}

// 搜索学生
Mock.mock('/searchStu', 'post', function (data) {
    // console.log(data);
    var searchKey = queryToObj(data.body);
    var students = JSON.parse(localStorage.students);
    if(searchKey.select=='name'){
        return students.filter(item=>{
            return item.name.indexOf(searchKey.word)!=-1;
        })
    }else{
        return students.filter(item=>{
            return item[searchKey.select]==searchKey.word;
        })
    }
})

Mock.mock('/editStu','post',function(options){
    var id=queryToObj(options.body).id;
    var students=JSON.parse(localStorage.students);
    return students.filter(item=>{
        return item.id==id;
    })
})

//新增学生 
Mock.mock('/addCustom','post', function (options) {
    var newData=queryToObj(options.body);
    // console.log(newData)
    var students = JSON.parse(localStorage.students);
    newData.id = parseInt(students[students.length - 1].id) + 1;
    
    students.push(newData);
    return students;
});

// 修改
Mock.mock('/edit','post', function (options) {
    var newData=queryToObj(options.body);
    var students = JSON.parse(localStorage.students);
    var index = students.findIndex(item=>{
        return item.id==newData.id;
    })
    students.splice(index,1,newData);

    return students;
});

Mock.mock(new RegExp('/del/\d*'),'delete',function(options){
    // console.log(options.url.split('/'))
    id=options.url.split('/')[2];
    students=JSON.parse(localStorage.students);
    var index = students.findIndex(item=>{
        return item.id==id;
    })
    students.splice(index,1);

    return students;
})