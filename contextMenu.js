(function () {

    'use strict';

    angular.module('ui.bootstrap.contextMenu', [])
        .directive('contextMenu', ["$parse", function ($parse) {
            var renderContextMenu = function ($scope, event, options, model) {

                var submenu = 0;
                if (!$) {
                    var $ = angular.element;
                }
                $(event.currentTarget).addClass('context');
                var $contextMenu = $('<div>');
                $contextMenu.addClass('dropdown clearfix');
                var $ul = $('<ul>');
                $ul.addClass('dropdown-menu');
                $ul.attr({
                    'role': 'menu'
                });
                $ul.css({
                    display: 'block',
                    position: 'absolute',
                    left: event.pageX + 'px',
                    top: event.pageY + 'px'
                });

                var $ul_ = $('<ul>');
                $ul_.addClass('dropdown-menu');

                var sm_text = "";

                angular.forEach(options, function (item, i) {
                    var $li = $('<li>');
                    if (item === null) {
                        $li.addClass('divider');
                    }
                    else if (item[0] === '>' && typeof item[1] === 'string') {
                        submenu += 1;
                        $ul_ = $('<ul>');
                        $ul_.addClass('dropdown-menu');
                        sm_text = item[1];
                        return;
                    }
                    else if (item.length === 1 && item[0] === '<') {
                        var $a = $('<a>');
                        $a.attr({tabindex: '-1', href: '#'});
                        $a.text(sm_text);
                        $li.append($a);
                        $li.addClass('dropdown-submenu');
                        $li.append($ul_);
                        submenu -= 1;
                    }
                    else {
                        var $a = $('<a>');
                        $a.attr({
                            tabindex: '-1',
                            href: '#'
                        });
                        var text = typeof item[0] == 'string' ? item[0] : item[0].call($scope, $scope, event, model);
                        $a.text(text);
                        $li.append($a);
                        var enabled = angular.isDefined(item[2]) ? item[2].call($scope, $scope, event, text, model) : true;
                        if (enabled) {
                            $li.on('click', function ($event) {
                                $event.preventDefault();
                                $scope.$apply(function () {
                                    $(event.currentTarget).removeClass('context');
                                    $contextMenu.remove();
                                    item[1].call($scope, $scope, event, model);
                                });
                            });
                        } else {
                            $li.on('click', function ($event) {
                                $event.preventDefault();
                            });
                            $li.addClass('disabled');
                        }
                    }
                    if (submenu <= 0) {
                        $ul.append($li);
                    }
                    else {
                        $ul_.append($li);
                    }
                });
                $contextMenu.append($ul);
                var height = Math.max(
                    document.body.scrollHeight, document.documentElement.scrollHeight,
                    document.body.offsetHeight, document.documentElement.offsetHeight,
                    document.body.clientHeight, document.documentElement.clientHeight
                );
                $contextMenu.css({
                    width: '100%',
                    height: height + 'px',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 9999
                });
                $(document).find('body').append($contextMenu);
                $contextMenu.on("mousedown", function (e) {
                    if ($(e.target).hasClass('dropdown')) {
                        $(event.currentTarget).removeClass('context');
                        $contextMenu.remove();
                    }
                }).on('contextmenu', function (event) {
                    $(event.currentTarget).removeClass('context');
                    event.preventDefault();
                    $contextMenu.remove();
                });
            };

            return function ($scope, element, attrs) {
                element.on('contextmenu', function (event) {
                    event.stopPropagation();
                    $scope.$apply(function () {
                        event.preventDefault();
                        var options = $scope.$eval(attrs.contextMenu);
                        var model = $scope.$eval(attrs.model);
                        if (options instanceof Array) {
                            if (options.length === 0) {
                                return;
                            }
                            renderContextMenu($scope, event, options, model);
                        } else {
                            throw '"' + attrs.contextMenu + '" not an array';
                        }
                    });
                });
            };

        }]);
})();