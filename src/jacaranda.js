/**
 * Created by SunLunatic on 2014/11/7.
 */
(function ($) {
    var Jacaranda = function (element, options) {
        this.target = $(element);
        this.options = options;
        this.jcrdTree;
        this.init();
    };
    Jacaranda.prototype = {
        constructor: Jacaranda,
        init: function () {
            var htmlStr;
            var data = this.options.data;
            if (!data) {
                return;
            }
            var dataObj = $.evalJSON(data);
            htmlStr = '<div id="_jcrdTree" class="jcrd-tree-div" style="display:none"><div class="jcrd-tree jcrd-tree-unselectable">';
            htmlStr += JcrdGlobal.renderToHtml(dataObj);
            htmlStr += '</div></div>';
            this.target.after(htmlStr);
            var _target = this.target;
            this.jcrdTree = this.target.next();
            var _jcrdTree = this.jcrdTree;
            var _this = this;

            this.target.on("click", function () {
                if (_jcrdTree.is(":hidden")) {
                    _this.show($.proxy(_target, this));
                } else {
                    _this.hide($.proxy(_target, this));
                }
            });
            _jcrdTree.on("click", ".fa-plus-square-o", function () {
                $(this).removeClass("fa-plus-square-o");
                $(this).addClass("fa-minus-square-o");
                $(this).parent().next(".jcrd-tree-package-content").show();
            });
            _jcrdTree.on("click", ".fa-minus-square-o", function () {
                $(this).removeClass("fa-minus-square-o");
                $(this).addClass("fa-plus-square-o");
                $(this).parent().next(".jcrd-tree-package-content").hide();
            });
        },
        show: function () {
            var that = this;
            $(document).on('mousedown', function(event){
                that.hide(event);
            });
            this.jcrdTree.fadeIn(500);
        },
        hide: function (event) {
            console.info(this);
            if(!event || $(event.target).parents(".jcrd-tree-div").length == 0){
                $(document).off('mousedown', this.hide);
                this.jcrdTree.fadeOut(500);
            }
        }
    };
    //Jacaranda.prototype.init.prototype = Jacaranda.prototype;
    $.fn.jacaranda = function (options) {
        return this.each(function () {
            new Jacaranda(this, $.extend({}, $.fn.jacaranda.defaults, options));
        });
    };
    $.fn.jacaranda.defaults = {
        "data": '{"_children":[{"_children":[{"_value":"佳能6D","id":"4"},{"_value":"佳能7D2","id":"5"},{"_value":"佳能70D","id":"6"}],"_value":"单反相机","id":"2"},{"_children":[{"_value":"索尼黑卡","id":"7"}],"_value":"数码相机","id":"3"}],"_value":"相机类","id":"1"}'
    };
    var JcrdGlobal = {
        renderToHtml: function (dataObj) {
            var htmlStr = "";
            htmlStr += '<div class="jcrd-tree-package"><div class="jcrd-tree-package-header">';
            if (!dataObj["_children"]) {
                htmlStr += '<i class="fa"></i>';
            } else {
                htmlStr += '<i class="fa fa-plus-square-o fa-1x"></i>';
            }
            htmlStr += '<div ' + JcrdGlobal.addAttrs(dataObj) + ' class="jcrd-tree-package-name">' + dataObj["_value"] + '</div></div>';
            if (dataObj["_children"]) {
                htmlStr += '<div class="jcrd-tree-package-content" style="display:none">';
                for (var childKey in dataObj["_children"]) {
                    htmlStr += JcrdGlobal.renderToHtml(dataObj["_children"][childKey]);
                }
                htmlStr += "</div>";
            }
            htmlStr += "</div>";
            return htmlStr;
        },
        addAttrs: function (dataObj) {
            var htmlStr = "";
            for (var key in dataObj) {
                if (!key || "_value" == key || "_children" == key) {
                    continue;
                }
                htmlStr += JcrdGlobal.addAttr(key, dataObj[key]);
            }
            return htmlStr;
        },
        addAttr: function (attName, attVal) {
            return attName + '=' + attVal + ' ';
        }
    };
})(jQuery);