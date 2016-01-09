(function () {

    'use strict';

    angular.module('ui.bootstrap.contextMenu', ['ngSanitize'])
        .directive('contextMenu', cm);

    // This is just better style here to use a function...
    function cm() {

        var link = function (scope, element, attrs) {

            element.on('contextmenu', function (event) {

                event.stopPropagation();
                event.preventDefault();
                var el = element.find(".dropdown");

                el.css('visibility', 'visible');

                var ul = element.find("ul");

                var left = event.pageX - el.offset().left - 5;
                var top = event.pageY - el.offset().top - 5;
                ul.css({
                    left: left + 'px',
                    top: top + 'px'
                });

                el.on("mouseleave", function () {
                    el.css('visibility', 'hidden');
                    // Make sure to remove all attached events
                    el.off();
                });

                el.on("click", function () {
                    el.css('visibility', 'hidden');
                });
            });
        };

        var t = ['<div class="dropdown clearfix" style="visibility:hidden; position:absolute;display:inline-block" >',
            '<ul class="dropdown-menu context-menu" role "menu" style="display:block;position:absolute;">',
            '<li ng-class="{\'dropdown-submenu\':opt[2] !== undefined}" ng-repeat="opt in menuOptions" ng-click="opt[1]()" class="menu-element" style="padding:5px" >',
            '<div ng-switch on="opt[2] === undefined">',
            '<div ng-switch-when=true><span ng-bind-html ="opt[0]"></span></div>',
            '<div ng-switch-when=false><span ng-bind-html="opt[0]"></span>',
            '<ul class="dropdown-menu"><li ng-repeat="el in opt[2]">{{el}}</li></ul>',
            '</div>',
            '</div></li>',
            '</ul></div><div class="main" ng-transclude="main"></div> '];

        var template = t.join(' ');

        return {
            scope: {menuOptions: "="},
            transclude: {
                'main': '?pane-main',
                'list': '?pane-list'
            },
            link: link,
            template: template
        }
    };
})();