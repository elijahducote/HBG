// Dynamic flyer src — points <img id="flyer"> at the upcoming 2nd Monday's typorama.
(function() {
  'use strict';

  function init() {
    var dayjs = window.dayjs;
    if (!dayjs) return;

    var img = document.getElementById('flyer');
    if (!img) return;

    var today = dayjs().startOf('day');
    var target = secondMondayOf(today);
    if (target.isBefore(today)) target = secondMondayOf(today.add(1, 'month'));

    img.src = '/flyer/typorama_' + target.format('YYYY-MM-DD') + '.png';
  }

  function secondMondayOf(monthRef) {
    var firstOfMonth = monthRef.startOf('month');
    var dow = firstOfMonth.day();
    var offsetToFirstMonday = (8 - dow) % 7;
    return firstOfMonth.add(offsetToFirstMonday + 7, 'day');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
