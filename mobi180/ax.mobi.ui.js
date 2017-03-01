/**
 * appframework.ax - A User Interface library for App Framework applications
 *
 * @copyright 2011 Intel
 * @author AppMobi
 * @version 2.0
 */ (function ($) {
     "use strict";

     var mobi = function () {
         // Init the page
         var that = this;
     };


     mobi.prototype = {
         id: false,
         //AJAX载入(添加)
         ajaxAdd: function (box, url) {
             $.ajax({
                 beforeSend: function () { },
                 type: "get",
                 url: url,
                 success: function (data) {
                     $(box).append(data);
                 }
             })
         },
         //列表加载更多
         applist: function (url) {
             $.ajax({
                 beforeSend: function () { },
                 dataType: "text",
                 url: url,
                 success: function (data) {
                     $("#" + $.ui.activeDiv.id + " .appList").append($(data).find(".appList>*"));
                     $("#" + $.ui.activeDiv.id + " .appMore").html("").append($(data).find(".appMore>*"));
                 }
             })
         },
         //加载详细信息参数与内容
         viewAjax: function (that, url,el) {
             var $that = $(el), btn = $(that);
             btn.siblings().removeClass("on");
             btn.addClass("on");
             $.ajax({
                 beforeSend: function () { $.ui.showMask() },
                 dataType: "html",
                 url: url,
                 cache: false,
                 success: function (data) {
                     $that.html(data);
                     $.ui.hideMask()
                 }
             });
         }


     };



     $.mobi = new mobi();

 })(af);


/****************
*公用函数
****************/

//读取表单
function getFormQueryString(frmID) {
    var frmID = document.getElementById(frmID);
    var i, queryString = "", and = "";
    var item;
    var itemValue;
    var form_data = [];
    for (i = 0; i < frmID.length; i++) {
        item = frmID[i];
        if (item.name != '') {
            if (item.type == 'select-one') {
                itemValue = item.options[item.selectedIndex].value;
            }
            else if (item.type == 'checkbox' || item.type == 'radio') {
                if (item.checked == false) {
                    continue;
                }
                itemValue = item.value;
            }
            else if (item.type == 'button' || item.type == 'submit' || item.type == 'reset' || item.type == 'image') {
                continue;
            }
            else {
                itemValue = item.value;
            }
            //itemValue = escape(itemValue);
            queryString += and + item.name + ':' + '"' + itemValue + '"';
            and = ",";
        }
    }
    queryString = "[{ " + queryString + " }]"
    //alert(queryString);
    form_data = eval(queryString);
    return form_data[0];

}


/****************
*功能插件
****************/

//详细页多图
var piclistpop = function (url) {
    var carousel;
    function piclist_carousel() {
        carousel = $("#piclist_content").carousel({
            pagingDiv: "piclist_dots",
            pagingCssName: "piclist_paging",
            pagingCssNameSelected: "piclist_paging_selected",
            preventDefaults: false
        });
    }
    piclist_carousel()
};




//评论信息提交





/*TAB列表*/
function tabList(el) {
    var btn = $(el + " .tabButtons>*"), con = $(el + " .tabContent > *");
    // $(document).delegate('a', 'click',
    btn.bind('click', function () {
        var that = $(this), index = $(this).index();
        that.addClass("on").siblings().removeClass("on");
        con.eq(index).show().siblings().hide();

    });
};


/*列表属性显示*/
var attributeItems = function (obj, menuid, itemid) {
    if (obj.className != "on") {
        $("#" + $.ui.activeDiv.id + " .list li>i").removeClass("on");
        obj.className = "on";
    }
    else {
        obj.className = "";
    }
};

//搜索信息提交
var searchFormSubmit = function (formId, checkUrl) {

    var form_data = [getFormQueryString(formId)];
    $.post(checkUrl, form_data[0],
        function (data) {
            $("#search_list").html(data);
        })
};



//评论信息提交
var commentsFormSubmit = function (formId, checkUrl) {
    var form_data = [getFormQueryString(formId)];
    $.post(checkUrl, form_data[0],
        function (data) {
            //var queryString = "[{ " + data + " }]"
            var arr = eval("[{ " + data + " }]");
            if (arr[0][1]) {
                $.query("#afui").popup({
                    title: "您好!",
                    message: arr[0][1],
                    cancelText: "确定",
                    cancelCallback: function () {
                    },
                    cancelOnly: true
                });
            } else {
                //alert(arr[0][0]);
                //提交内容为空时,出错信息没有正确返回
                $.query("#afui").popup({
                    title: "您好!",
                    message: data,
                    cancelText: "确定",
                    cancelCallback: function () {
                    },
                    cancelOnly: true
                });
            };
        })
};

//调查信息提交
var surveyFormSubmit = function (formId, checkUrl) {
    var form_data = [getFormQueryString(formId)];
    $.post(checkUrl, form_data[0],
        function (data) {
            var queryString = "[{ " + data + " }]"
            arr = eval(queryString);
            if (arr[0][1]) {
                $.query("#afui").popup({
                    title: "您好!",
                    message: arr[0][1],
                    cancelText: "确定",
                    cancelCallback: function () {
                    },
                    cancelOnly: true
                });
            } else {
                if (arr[0][0]) {
                    $.query("#afui").popup({
                        title: "您好!",
                        message: arr[0][0],
                        cancelText: "确定",
                        cancelCallback: function () {
                        },
                        cancelOnly: true
                    });
                } else {
                    $.query("#afui").popup({
                        title: "您好!",
                        message: "您已经投票过了!",
                        cancelText: "确定",
                        cancelCallback: function () {
                        },
                        cancelOnly: true
                    });
                };

            };
        })
};

/****************
*页面初始化函数
****************/

//浏览器标识为空
if ($.os.webkit ? false : true && $.os.fennec ? false : true && $.os.ie ? false : true && $.os.opera ? false : true) {
    $.os.webkit = true;
    $.feat.cssPrefix = $.os.webkit ? "Webkit" : "";
}

//(function ($) {
//    $.ui.ready(function () {


// //window.addEventListener("load", showHeaderSortBox, false);
//    });


//})(af);
var loadIndex = function () {
    $.ui.toggleHeaderMenu();
};
/*图片列表 调整图片高度*/
var reviseHeightImg=function(){
    if ($(".reviseHeightImg .img").length > 0) {
        $("body").append("<style>.reviseHeightImg .img{height:" + $(".reviseHeightImg .img").width() * templateConfig.reviseheightimgratio + "px!important}</style>");
    }
};
reviseHeightImg()
window.onresize = function () { reviseHeightImg() };



function clock(){this.init.apply(this,arguments)};
clock.prototype = {
    init:function(opts){
        opts = opts ||{};
        var hour = this.getId(opts.hours || 'hour');
        var minutes = this.getId(opts.minutes || 'minutes');
        var seconds = this.getId(opts.seconds || 'seconds');
        var time,nHour,nMinutes,nSeconds,srotate,mrotate,hrotate,sdegree,mdegree,hdegree;
        setInterval(function(){
            time = new Date();
            nHour = time.getHours();
            nMinutes = time.getMinutes();
            nSeconds = time.getSeconds();
            //每格表示的度数为360/60=6度
            sdegree = nSeconds * 6;
            mdegree = nMinutes * 6;
            //时针的度数应该为当前时间的小时数+与分针对应的小时度数
            //(nHour%12) * 30 == (nHour%12) * (360/12)
            //nMinutes/2 == (nMinutes/60)*5*6 这里的(nMinutes/60)*5表示的是与分针对应的小时刻度，然后每格的度数6
            hdegree = (nHour%12) * 30 + Math.floor(nMinutes/2);
            srotate = 'rotate(' + sdegree + 'deg)';
            mrotate = 'rotate(' + mdegree + 'deg)';
            hrotate = 'rotate(' + hdegree + 'deg)';
            seconds.style.cssText = '-moz-transform:'+ srotate + '; -webkit-transform:' + srotate;
            minutes.style.cssText = '-moz-transform:'+ mrotate + '; -webkit-transform:' + mrotate;
            hour.style.cssText = '-moz-transform:'+ hrotate + '; -webkit-transform:' + hrotate;
        },1000);
    },
    getId:function(el){
        return typeof el=='string' ? document.getElementById(el) : el;
    }
}
 
new clock();

