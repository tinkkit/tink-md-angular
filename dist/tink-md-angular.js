/**
 * Angular directive to render Markdown text. It's built on blazingly fast markdown parser 'marked'.
 * @version v1.1.0 - 2015-06-03
 * @link https://github.com/tinkkit/tink-md-angular
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
/* global angular, hljs, marked */
'use strict';
angular.module('yaru22.md', []).directive('md', [
  '$templateRequest',
  function ($templateRequest) {
    if (typeof hljs !== 'undefined') {
      marked.setOptions({
        highlight: function (code, lang) {
          if (lang) {
            return hljs.highlight(lang, code).value;
          } else {
            return hljs.highlightAuto(code).value;
          }
        }
      });
    }
    return {
      restrict: 'E',
      require: '?ngModel',
      link: function ($scope, $elem, $attrs, ngModel) {
        if ($attrs.url) {
          $templateRequest($attrs.url).then(function (template) {
            var html = marked(template);
            $elem.html(html);
          }, function () {
            console.warn('couldn\'t read url: ' + $attrs.url);
          });
          return;
        } else if (!ngModel) {
          // render transcluded text
          var html = marked($elem.text());
          $elem.html(html);
          return;
        }
        ngModel.$render = function () {
          var html = marked(ngModel.$viewValue || '');
          $elem.html(html);
        };
      }  // link function
    };
  }
]);