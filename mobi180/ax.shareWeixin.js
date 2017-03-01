
(function ($) {

    var rotateLeft = function (lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    var lsbHex = function (value) {
        var string = "";
        var i;
        var vh;
        var vl;
        for (i = 0; i <= 6; i += 2) {
            vh = (value >>> (i * 4 + 4)) & 0x0f;
            vl = (value >>> (i * 4)) & 0x0f;
            string += vh.toString(16) + vl.toString(16);
        }
        return string;
    };

    var cvtHex = function (value) {
        var string = "";
        var i;
        var v;
        for (i = 7; i >= 0; i--) {
            v = (value >>> (i * 4)) & 0x0f;
            string += v.toString(16);
        }
        return string;
    };

    var uTF8Encode = function (string) {
        string = string.replace(/\x0d\x0a/g, "\x0a");
        var output = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                output += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                output += String.fromCharCode((c >> 6) | 192);
                output += String.fromCharCode((c & 63) | 128);
            } else {
                output += String.fromCharCode((c >> 12) | 224);
                output += String.fromCharCode(((c >> 6) & 63) | 128);
                output += String.fromCharCode((c & 63) | 128);
            }
        }
        return output;
    };

    $.extend({
        sha1: function (string) {
            var blockstart;
            var i, j;
            var W = new Array(80);
            var H0 = 0x67452301;
            var H1 = 0xEFCDAB89;
            var H2 = 0x98BADCFE;
            var H3 = 0x10325476;
            var H4 = 0xC3D2E1F0;
            var A, B, C, D, E;
            var tempValue;
            string = uTF8Encode(string);
            var stringLength = string.length;
            var wordArray = new Array();
            for (i = 0; i < stringLength - 3; i += 4) {
                j = string.charCodeAt(i) << 24 | string.charCodeAt(i + 1) << 16 | string.charCodeAt(i + 2) << 8 | string.charCodeAt(i + 3);
                wordArray.push(j);
            }
            switch (stringLength % 4) {
                case 0:
                    i = 0x080000000;
                    break;
                case 1:
                    i = string.charCodeAt(stringLength - 1) << 24 | 0x0800000;
                    break;
                case 2:
                    i = string.charCodeAt(stringLength - 2) << 24 | string.charCodeAt(stringLength - 1) << 16 | 0x08000;
                    break;
                case 3:
                    i = string.charCodeAt(stringLength - 3) << 24 | string.charCodeAt(stringLength - 2) << 16 | string.charCodeAt(stringLength - 1) << 8 | 0x80;
                    break;
            }
            wordArray.push(i);
            while ((wordArray.length % 16) != 14) wordArray.push(0);
            wordArray.push(stringLength >>> 29);
            wordArray.push((stringLength << 3) & 0x0ffffffff);
            for (blockstart = 0; blockstart < wordArray.length; blockstart += 16) {
                for (i = 0; i < 16; i++) W[i] = wordArray[blockstart + i];
                for (i = 16; i <= 79; i++) W[i] = rotateLeft(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
                A = H0;
                B = H1;
                C = H2;
                D = H3;
                E = H4;
                for (i = 0; i <= 19; i++) {
                    tempValue = (rotateLeft(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
                    E = D;
                    D = C;
                    C = rotateLeft(B, 30);
                    B = A;
                    A = tempValue;
                }
                for (i = 20; i <= 39; i++) {
                    tempValue = (rotateLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
                    E = D;
                    D = C;
                    C = rotateLeft(B, 30);
                    B = A;
                    A = tempValue;
                }
                for (i = 40; i <= 59; i++) {
                    tempValue = (rotateLeft(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
                    E = D;
                    D = C;
                    C = rotateLeft(B, 30);
                    B = A;
                    A = tempValue;
                }
                for (i = 60; i <= 79; i++) {
                    tempValue = (rotateLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
                    E = D;
                    D = C;
                    C = rotateLeft(B, 30);
                    B = A;
                    A = tempValue;
                }
                H0 = (H0 + A) & 0x0ffffffff;
                H1 = (H1 + B) & 0x0ffffffff;
                H2 = (H2 + C) & 0x0ffffffff;
                H3 = (H3 + D) & 0x0ffffffff;
                H4 = (H4 + E) & 0x0ffffffff;
            }
            var tempValue = cvtHex(H0) + cvtHex(H1) + cvtHex(H2) + cvtHex(H3) + cvtHex(H4);
            return tempValue.toLowerCase();
        }
    });
})(af);
(function () {
    var shareWeixin = function (opts) {
        try {
            if (typeof (opts) === "string" || typeof (opts) === "number")
                opts = {
                    message: opts,
                    cancelOnly: "true",
                    cancelText: "OK"
                };
            this.id = id = opts.id = opts.id || "shareWeixin" //opts is passed by reference
            var self = this;
            this.addCssClass = opts.addCssClass ? opts.addCssClass : "";
            this.share = opts.suppressShare ? "" : (opts.share || "");
            this.link = opts.suppressTitle ? "" : (opts.link || "");
            this.desc = opts.suppressDesc ? "" : (opts.desc || "");
            this.img = opts.suppressImg ? "" : (opts.img || "");
            this.title = opts.suppressTitle ? "" : (opts.title || "Alert");
            this.message = opts.message || "";
            this.cancelText = opts.cancelText || "Cancel";
            this.cancelCallback = opts.cancelCallback || function () { };
            this.cancelClass = opts.cancelClass || "button";
            this.doneText = opts.doneText || "Done";
            this.doneCallback = opts.doneCallback || function (self) {
                // no action by default
            };
            this.doneClass = opts.doneClass || "button";
            this.cancelOnly = opts.cancelOnly || false;
            this.onShow = opts.onShow || function () { };
            this.autoCloseDone = opts.autoCloseDone !== undefined ? opts.autoCloseDone : true;

            queue.push(this);
            if (queue.length == 1)
                this.show();
        } catch (e) {
            console.log("error adding shareWeixin " + e);
        }
    }
    shareWeixin.prototype = {
        id: null,
        addCssClass: null,
        title: null,
        message: null,
        cancelText: null,
        cancelCallback: null,
        cancelClass: null,
        doneText: null,
        doneCallback: null,
        doneClass: null,
        cancelOnly: false,
        onShow: null,
        autoCloseDone: true,
        supressTitle: false,
        show: function () {
            var self = this;
            var para = document.createElement("div");
            para.id = this.id;
            para.className = "afshareWeixin hidden";
            document.body.appendChild(para);
            var $el = document.getElementById(this.id);
            $el.onclick = function () {
                self.hide();
            };
            setTimeout(function () {
                $el.className = "afshareWeixin";

            }, 50);
            if (self.share == "friend") {
                self.friend();

            } else if (self.share == "timeline") {
                self.timeline();
            } else if (self.share == "weibo") {
                self.weibo();
            };

        },

        hide: function () {
            var self = this;
            var $el = document.getElementById(self.id);
            $el.className = "afshareWeixin hidden";
            self.remove();
        },

        remove: function () {
            var self = this;
            var $el = document.getElementById(self.id);
            $el.parentNode.removeChild($el)
        },
        friend: function () {
            var self = this;
            wx.onMenuShareAppMessage({
                title: shareWeixinData.title,
                desc: shareWeixinData.desc,
                link: shareWeixinData.link,
                imgUrl: shareWeixinData.img,
                trigger: function (res) {
                    self.hide();
                    //alert('用户点击发送给朋友');
                },
                success: function (res) {
                    self.hide();
                    // alert('已分享');
                },
                cancel: function (res) {
                    self.hide();
                    //alert('已取消');
                },
                fail: function (res) {
                    self.hide();
                    //alert(JSON.stringify(res));
                }
            });
        },
        timeline: function () {
            var self = this;
            wx.onMenuShareTimeline({
                title: shareWeixinData.title,
                link: shareWeixinData.link,
                imgUrl: shareWeixinData.img,
                trigger: function (res) {
                    self.hide();
                    //alert('用户点击分享到朋友圈');
                },
                success: function (res) {
                    self.hide();
                    // alert('已分享');
                },
                cancel: function (res) {
                    self.hide();
                    //alert('已取消');
                },
                fail: function (res) {
                    self.hide();
                    //alert(JSON.stringify(res));
                }
            });
        },
        weibo: function () {
            var self = this;
            wx.onMenuShareWeibo({
                title: shareWeixinData.title,
                desc: shareWeixinData.desc,
                link: shareWeixinData.link,
                imgUrl: shareWeixinData.img,
                trigger: function (res) {
                    self.hide();
                    //alert('用户点击分享到微博');
                },
                complete: function (res) {
                    self.hide();
                    //alert(JSON.stringify(res));
                },
                success: function (res) {
                    self.hide();
                    //alert('已分享');
                },
                cancel: function (res) {
                    self.hide();
                    //alert('已取消');
                },
                fail: function (res) {
                    self.hide();
                    // alert(JSON.stringify(res));
                }
            });
        }
    };
    window.shareWeixin = shareWeixin;
})();
var randomString = function (len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
};


/*
 * 注意：
 * 1. 所有的JS接口只能在公众号绑定的域名下调用，公众号开发者需要先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。
 * 2. 如果发现在 Android 不能分享自定义内容，请到官网下载最新的包覆盖安装，Android 自定义分享接口需升级至 6.0.2.58 版本及以上。
 * 3. 完整 JS-SDK 文档地址：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
 *
 * 如有问题请通过以下渠道反馈：
 * 邮箱地址：weixin-open@qq.com
 * 邮件主题：【微信JS-SDK反馈】具体问题
 * 邮件内容说明：用简明的语言描述问题所在，并交代清楚遇到该问题的场景，可附上截屏图片，微信团队会尽快处理你的反馈。
 */

var wxJsApiConfigData = [];

wxJsApiConfigData.noncestr = randomString('16');
wxJsApiConfigData.timeStamp = new Date().getTime();
wxJsApiConfigData.pageUrl = window.location.href;
var wxJsApiConfigFu = function () {
    wx.config({
        debug: false,
        appId: wxJsApiConfigData.appId,
        timestamp: wxJsApiConfigData.timeStamp,
        nonceStr: wxJsApiConfigData.noncestr,
        signature: $.sha1("jsapi_ticket=" + wxJsApiConfigData.jsapi_ticket + "&noncestr=" + wxJsApiConfigData.noncestr + "&timestamp=" + wxJsApiConfigData.timeStamp + "&url=" + wxJsApiConfigData.pageUrl),
        jsApiList: [
          'checkJsApi',
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'onMenuShareQQ',
          'onMenuShareWeibo',
          'hideMenuItems',
          'showMenuItems',
          'hideAllNonBaseMenuItem',
          'showAllNonBaseMenuItem',
          'translateVoice',
          'startRecord',
          'stopRecord',
          'onRecordEnd',
          'playVoice',
          'pauseVoice',
          'stopVoice',
          'uploadVoice',
          'downloadVoice',
          'chooseImage',
          'previewImage',
          'uploadImage',
          'downloadImage',
          'getNetworkType',
          'openLocation',
          'getLocation',
          'hideOptionMenu',
          'showOptionMenu',
          'closeWindow',
          'scanQRCode',
          'chooseWXPay',
          'openProductSpecificView',
          'addCard',
          'chooseCard',
          'openCard'
        ]
    });
    if ("undefined" != typeof shareWeixinData) {
        if (shareWeixinData.img == "" & document.getElementsByTagName("img").length > 0) { shareWeixinData.img = document.getElementsByTagName("img")[0].src; };

        wx.ready(function () {
            //发送给好友
            wx.onMenuShareAppMessage({
                title: shareWeixinData.title,
                desc: shareWeixinData.desc,
                link: shareWeixinData.link,
                imgUrl: shareWeixinData.img,
                trigger: function (res) {
                    //alert('用户点击发送给朋友');
                },
                success: function (res) {
                    //alert('已分享');
                },
                cancel: function (res) {
                    //alert('已取消');
                },
                fail: function (res) {
                    //alert(JSON.stringify(res));
                }
            });

            // 分享到朋友圈
            wx.onMenuShareTimeline({
                title: shareWeixinData.title,
                link: shareWeixinData.link,
                imgUrl: shareWeixinData.img,
                trigger: function (res) {
                    //alert('用户点击分享到朋友圈');
                },
                success: function (res) {
                    // alert('已分享');
                },
                cancel: function (res) {
                    //alert('已取消');
                },
                fail: function (res) {
                    //alert(JSON.stringify(res));
                }
            });

            // 分享到微博
            wx.onMenuShareWeibo({
                title: shareWeixinData.title,
                desc: shareWeixinData.desc,
                link: shareWeixinData.link,
                imgUrl: shareWeixinData.img,
                trigger: function (res) {
                    //alert('用户点击分享到微博');
                },
                complete: function (res) {
                    //alert(JSON.stringify(res));
                },
                success: function (res) {
                    //alert('已分享');
                },
                cancel: function (res) {
                    //alert('已取消');
                },
                fail: function (res) {
                    // alert(JSON.stringify(res));
                }
            });
            if (shareWeixinData.toggle) {
                document.getElementById("shareWeixinBtnBox").style.display = "block";
                document.getElementById("shareWeixinFriend").onclick = function () {
                    var classA = new shareWeixin({ share: "friend" });
                    classA.show();
                };
                document.getElementById("shareWeixinTimeline").onclick = function () {
                    var classA = new shareWeixin({ share: "timeline" });
                    classA.show();
                }; document.getElementById("shareWeixinWeibo").onclick = function () {
                    var classA = new shareWeixin({ share: "weibo" });
                    classA.show();
                }
            };

        });
    }
};
var scripts = document.createElement("script");
scripts.src = "jweixin-1.0.0-1.js"/*tpa=http://res.wx.qq.com/open/js/jweixin-1.0.0.js*/;
var tag = $("head").append(scripts);
$.getJSON("http://mobi180.no1.35nic.com/ajax_asp/weixin_api/weixin_jsapi.asp", function (result) {
    wxJsApiConfigData.jsapi_ticket = result.jsapi_ticket;
    wxJsApiConfigData.appId = result.weixin_appid;
    window.setTimeout(function () { wxJsApiConfigFu(); }, 1000);
});