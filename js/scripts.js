!(function(window, document) {
  // some jquery-esque functions
  function get(id) {
    return document.getElementById(id);
  }
  function $1(selector, context) {
    return (context || document).querySelector(selector);
  }
  function css(el, styles) {
    for (var property in styles)
      el.style[property] = styles[property];
  }
  // function windowWidth() {
  //   return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  // }
  // function windowHeight() {
  //   return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  // }
  
  function celebrate() {
    window.clearInterval(interval);
    console.log('New Star Wars!');
  }
  function update() {
    var time = window.countdown(new Date(2016, 11, 16));
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
  update();
  var interval = window.setInterval(update, 1000);

})(window, document);
