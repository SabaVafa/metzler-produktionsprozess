/* ══ METZLER · Produktionsprozess — supplemental interactions (prod.js) ══
   Hero, trust strip and the journey (about-craft + msty sticky chrome) are
   driven by the About-us scripts already in the page. This file only adds:
   the FAQ accordion, click-to-play film, and the ?stage deep-link marker. */
(function(){
  'use strict';

  /* ── FAQ accordion ── */
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

  /* ── Film: click to play ── */
  var film = document.getElementById('prodFilm');
  var vid  = document.getElementById('prodVideo');
  if(film && vid){
    film.addEventListener('click', function(){
      if(vid.paused){ film.classList.add('playing'); var p = vid.play(); if(p && p.catch) p.catch(function(){}); }
      else { vid.pause(); film.classList.remove('playing'); }
    });
  }

  /* ── Order-status deep-link: ?stage=N (1–6) marks the current step
        "Sie sind hier" and scrolls to it (e.g. from the delay e-mail). ── */
  var stage = parseInt(new URLSearchParams(location.search).get('stage'), 10);
  if(!isNaN(stage) && stage >= 1 && stage <= 6){
    var ch = document.querySelector('.craft-chapter[data-chapter="' + stage + '"]');
    if(ch){
      ch.classList.add('is-here');
      window.addEventListener('load', function(){
        setTimeout(function(){ ch.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 300);
      });
    }
  }
})();
