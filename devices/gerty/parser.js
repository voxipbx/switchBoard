/**
 * Copyright (c) 2014 brian@bevey.org
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

(function (exports){
  'use strict';

  exports.gerty = function (deviceId, markup, state, value, fragments, language) {
    var templateComment = fragments.comment,
        action          = '',
        commentsMarkup  = '',
        time,
        comment,
        container,
        commentsList,
        translate  = function (message) {
          var util;

          if ((typeof SB === 'object') && (typeof SB.util === 'object')) {
            message = SB.util.translate(message, 'gerty');
          }

          else {
            util    = require(__dirname + '/../../lib/sharedUtil').util;
            message = util.translate(message, 'gerty', language);
          }

          return message;
        },
        displayTime = function (unix) {
          var util,
              time;

          if ((typeof SB === 'object') && (typeof SB.util === 'object')) {
            time = SB.util.displayTime(unix, translate);
          }

          else {
            util = require(__dirname + '/../../lib/sharedUtil').util;
            time = util.displayTime(unix, translate);
          }

          return time;
        };

    if (value.comments) {
      for (comment in value.comments) {
        if (value.comments.hasOwnProperty(comment)) {
          time = displayTime(value.comments[comment].time);

          commentsMarkup = commentsMarkup + templateComment.split('{{TIME}}').join(time);
          commentsMarkup = commentsMarkup.split('{{CODE}}').join(value.comments[comment].code);
          commentsMarkup = commentsMarkup.split('{{NAME}}').join(value.comments[comment].name);
          commentsMarkup = commentsMarkup.split('{{COMMENT}}').join(value.comments[comment].text);
        }
      }
    }

    if (typeof SB === 'object') {
      container    = SB.getByTag('span', SB.get(deviceId))[0];
      commentsList = SB.getByTag('ol', SB.get(deviceId))[0];

      if ((container) && (container.innerHTML !== value.emoji)) {
        SB.putText(container, value.emoji);

        container.className = value.action || '';
      }

      if ((commentsList) && (commentsList.innerHTML !== commentsMarkup)) {
        commentsList.innerHTML = commentsMarkup;
        commentsList.scrollTop = commentsList.scrollHeight;
      }

      markup = '';
    }

    else {
      if (value.action) {
        action = ' class="' + value.action + '"';
      }

      markup = markup.split('{{GERTY_ACTION}}').join(action);
      markup = markup.split('{{GERTY_DYNAMIC}}').join(value.emoji);
      markup = markup.split('{{GERTY_COMMENTS}}').join(commentsMarkup);
    }

    return markup;
  };
})(typeof exports === 'undefined' ? this.SB.spec.parsers : exports);
