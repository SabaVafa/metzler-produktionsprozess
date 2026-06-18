/* ══ METZLER · Produktionsprozess — interactions (prod.js) ══ */
(function(){
  'use strict';
  var root = document.querySelector('.prod');
  if(!root) return;

  /* ── 1. scroll reveal ── */
  var reveal = document.querySelectorAll('[data-pr]');
  if('IntersectionObserver' in window){
    var ro = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); ro.unobserve(e.target); } });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    reveal.forEach(function(el){ ro.observe(el); });
  } else { reveal.forEach(function(el){ el.classList.add('in'); }); }

  /* ── 2. live stage tracker (rail) ── */
  var railItems = Array.prototype.slice.call(document.querySelectorAll('#prodRail .prod-rail__item'));
  var miniBars  = Array.prototype.slice.call(document.querySelectorAll('#prodMini b'));
  var chapters  = Array.prototype.slice.call(document.querySelectorAll('#prodChapters .prod-chapter'));

  // optional ?stage=N (1-based) — e.g. deep-linked from the "delay" e-mail
  var here = parseInt(new URLSearchParams(location.search).get('stage'), 10);
  if(isNaN(here) || here < 1 || here > railItems.length) here = 0;

  function applyStatus(activeIdx){
    railItems.forEach(function(it, i){
      it.classList.toggle('is-active', i === activeIdx && !here);
      it.classList.toggle('is-done', here && (i+1) < here);
      it.classList.toggle('is-here', here && (i+1) === here);
    });
    miniBars.forEach(function(b, i){
      b.classList.toggle('is-active', !here && i <= activeIdx);
      b.classList.toggle('is-here', here && (i+1) === here);
      b.classList.toggle('is-done', here && (i+1) < here);
    });
  }

  // inject "Sie sind hier" badge + auto-scroll when deep-linked
  if(here){
    var hereItem = railItems[here-1];
    if(hereItem){
      var badge = document.createElement('span');
      badge.className = 'prod-rail__here';
      badge.textContent = 'Sie sind hier';
      hereItem.querySelector('.prod-rail__txt').appendChild(badge);
    }
    applyStatus(here-1);
  }

  // active chapter while scrolling (only drives highlight when NOT deep-linked)
  var activeIdx = 0;
  if('IntersectionObserver' in window && chapters.length){
    var co = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){
          var idx = chapters.indexOf(e.target);
          if(idx > -1){ activeIdx = idx; if(!here) applyStatus(idx); }
        }
      });
    }, { threshold: 0.5, rootMargin: '-20% 0px -40% 0px' });
    chapters.forEach(function(c){ co.observe(c); });
  }
  if(!here) applyStatus(0);

  // rail click → jump to chapter
  railItems.forEach(function(it){
    it.addEventListener('click', function(){
      var idx = parseInt(it.getAttribute('data-go'), 10);
      var ch = document.getElementById('ch-' + idx);
      if(ch) ch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  /* ── 3. FAQ accordion ── */
  var faq = document.getElementById('prodFaq');
  if(faq){
    var items = Array.prototype.slice.call(faq.querySelectorAll('.prod-faq__item'));
    function setOpen(item, open){
      item.classList.toggle('open', open);
      var a = item.querySelector('.prod-faq__a');
      a.style.maxHeight = open ? (a.scrollHeight + 'px') : '0px';
    }
    items.forEach(function(item){
      setOpen(item, item.classList.contains('open'));
      item.querySelector('.prod-faq__q').addEventListener('click', function(){
        var willOpen = !item.classList.contains('open');
        items.forEach(function(o){ if(o !== item) setOpen(o, false); });
        setOpen(item, willOpen);
      });
    });
    window.addEventListener('resize', function(){
      var open = faq.querySelector('.prod-faq__item.open');
      if(open){ var a = open.querySelector('.prod-faq__a'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  }

  /* ── 4. film: click to play ── */
  var film = document.getElementById('prodFilm');
  var vid  = document.getElementById('prodVideo');
  if(film && vid){
    film.addEventListener('click', function(){
      if(vid.paused){
        var ph = film.querySelector('.ph'); if(ph) ph.style.display = 'none';
        film.classList.add('playing');
        var p = vid.play(); if(p && p.catch) p.catch(function(){});
      } else { vid.pause(); film.classList.remove('playing'); }
    });
  }
})();
