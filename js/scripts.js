!(function(window, document) {
  function get(id) {
    return document.getElementById(id);
  }
  function celebrate() {
    window.clearInterval(interval);
    document.getElementById('countdown').innerHTML = 'New<br>Star Wars<br>is out!';
  }
  function update() {
    var time = window.countdown(nextRelease);
    if (time.value >= 0) {
      return celebrate();
    }
    ['years', 'months', 'days', 'hours', 'minutes', 'seconds'].forEach(function(unit) {
      if (current[unit] === time[unit]) return;
      current[unit] = time[unit];
      var el = get(unit);
      if (!time[unit] && unit !== 'seconds') {
        return el.classList.add('hide');
      }

      el.querySelector('.num').textContent = time[unit];
      el.querySelector('.plural').classList.toggle('hide', time[unit] === 1);
      el.classList.remove('hide');
    })
  }

  var current = {};
  var interval = window.setInterval(update, 1000);
  update();

  // Display Obi-Wan text while first season is running
  if (new Date() >= new Date(2022, 5, 22)) {
    get('obi').classList.add('hide');
  }

})(window, document);
