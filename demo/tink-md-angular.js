/**
 * <%= pkg.description %>
 * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>
 * @link <%= pkg.homepage %>
 * @author <%= pkg.author.name %> <<%= pkg.author.email %>>
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