$.fn.extend({
    page: function (options) {
        new Page(options, this).init()
    }
})

function Page(options, wrap) {
    this.wrap = wrap;
    this.tn = options.tn;//total page num
    this.cn = options.cn;//current page num
    this.mn = options.mn;//the max-page can show
    this.callBack = options.callBack;
}
Page.prototype.init = function () {
    // 1.createDom()
    this.createDom();
    // 2.bindEvent()
    this.bindEvent();
}

Page.prototype.createDom = function () {
    this.wrap.html('');
    this.pageWrap = $('<ul id="myPage"></ul>');
    this.prev = $('<li class="btn prev">&lt;</li>');
    this.next = $('<li class="btn next">&gt;</li>');
    this.center = "";
    var ellipsis = '<li class="ellipsis">...</li>';
    // 创建页码，分两种情况
    if (this.tn <= this.mn) {
        // show all
        this.center = this.createLi(1, this.tn)
    } else {
        if (this.cn <= 3) {
            this.center = this.createLi(1, 3) + ellipsis + `<li>${this.tn}</li>`;
        } else if (this.cn > this.tn - 3) {
            this.center = `<li>1</li>` + ellipsis + this.createLi(this.tn - 2, this.tn);
        } else {
            this.center = `<li>1</li>` + ellipsis + this.createLi(this.cn - 2, this.cn + 2) + ellipsis + `<li>${this.tn}</li>`;
        }
    }
    // console.log(this.center)
    this.pageWrap
        .append(this.prev)
        .append(this.center)
        .append(this.next)
        .appendTo(this.wrap)
}

Page.prototype.createLi = function (start, end) {
    var str = '';
    for (var i = start; i <= end; i++) {
        if (i === this.cn) {
            str += `<li class="active">${i}</li>`
        } else {
            str += `<li>${i}</li>`
        }
    }
    return str;
}

Page.prototype.bindEvent=function(){
    var This=this;
    this.prev.click(function(){
        This.cn--;
        if(This.cn<=0){
            This.cn=1;
            alert("当前页已经是第一页了")
        }
        This.init();
        This.callBack(This.cn)
    })
    this.next.click(function(){
        This.cn++;
        if(This.cn>This.tn){
            This.cn=1;
            alert("当前页已经是最后一页了")
        }
        This.init();
        This.callBack(This.cn)
    })
    $('#myPage li:not(.ellipsis):not(.btn)').click(function(){
        This.cn=parseInt($(this).text());
        // console.log(This.cn)
        This.init();
        This.callBack(This.cn)
    })
}
