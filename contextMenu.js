(function () {

    'use strict';

    angular.module('ui.bootstrap.contextMenu', ['ngSanitize'])
        .directive('contextMenu', cm);

    // This is just better style here to use a function...
    function cm() {

        var link = function (scope, element) {

            element.on('contextmenu', function (event) {

                event.stopPropagation();
                event.preventDefault();
                var el = element.find(".dropdown");

                el.css('visibility', 'visible');

                var ul = element.find("ul.context-menu.dropdown-menu");

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
            '<li ng-class="{\'dropdown-submenu\':opt[2] !== undefined,  \'divider\':opt === null, \'menu-element\':opt !== null}" ng-repeat="opt in menuOptions" ng-click="opt[1]()" >',
            '<div ng-switch on="opt[2] === undefined" ng-if="opt !== null">',
            '<div ng-switch-when=true><div ng-bind-html ="opt[0]"></div></div>',
            '<div ng-switch-when=false><span ng-bind-html="opt[0]"></span>',
            '<ul class="dropdown-menu"><li class="menu-element" ng-repeat="el in opt[2]" ng-bind-html="el[0]" ng-click="el[1]()"></li></ul>',
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