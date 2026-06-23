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

  /* ── Film player: play/pause + mute controls + chapter navbar ── */
  var film = document.getElementById('prodFilm');
  var vid  = document.getElementById('prodVideo');
  if(film && vid){
    var playBtn = document.getElementById('prodFilmPlay');
    var toggle  = document.getElementById('prodFilmToggle');
    var muteBtn = document.getElementById('prodFilmMute');
    var bar     = document.getElementById('prodFilmBar');
    var chapters = Array.prototype.slice.call(film.querySelectorAll('.prod-film__chapter'));

    var I_PLAY  = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    var I_PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
    var I_MUTE  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';
    var I_SOUND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a9 9 0 0 1 0 14"/></svg>';

    var track    = bar && bar.parentElement;   /* the .prod-film__progress rail */
    var scrubbing = false;

    function syncToggle(){ if(toggle){ toggle.innerHTML = vid.paused ? I_PLAY : I_PAUSE; toggle.setAttribute('aria-label', vid.paused ? 'Abspielen' : 'Pause'); } }
    function syncMute(){ if(muteBtn){ muteBtn.innerHTML = vid.muted ? I_MUTE : I_SOUND; muteBtn.setAttribute('aria-label', vid.muted ? 'Ton einschalten' : 'Ton ausschalten'); } }
    function play(){ var p = vid.play(); if(p && p.catch) p.catch(function(){}); }
    function paint(prog){ if(bar) bar.style.width = (prog * 100) + '%'; if(track) track.setAttribute('aria-valuenow', Math.round(prog * 100)); }

    vid.addEventListener('play',  function(){ film.classList.add('playing'); syncToggle(); });
    vid.addEventListener('pause', function(){ film.classList.remove('playing'); syncToggle(); });
    vid.addEventListener('volumechange', syncMute);
    vid.addEventListener('timeupdate', function(){
      if(!vid.duration) return;
      var prog = vid.currentTime / vid.duration;
      if(!scrubbing) paint(prog);   /* while dragging, the pointer owns the bar */
      var idx = Math.min(chapters.length - 1, Math.floor(prog * chapters.length));
      chapters.forEach(function(c,i){ var on = i === idx; c.classList.toggle('is-active', on); if(on) c.setAttribute('aria-current','true'); else c.removeAttribute('aria-current'); });
    });

    if(playBtn) playBtn.addEventListener('click', function(e){ e.stopPropagation(); play(); });
    if(toggle)  toggle.addEventListener('click', function(e){ e.stopPropagation(); if(vid.paused) play(); else vid.pause(); });
    if(muteBtn) muteBtn.addEventListener('click', function(e){ e.stopPropagation(); vid.muted = !vid.muted; });
    chapters.forEach(function(c,i){ c.addEventListener('click', function(e){ e.stopPropagation(); if(vid.duration){ vid.currentTime = (i / chapters.length) * vid.duration; play(); } }); });
    film.addEventListener('click', function(){ if(vid.paused) play(); else vid.pause(); });

    /* ── Interactive scrub bar: click anywhere to jump, drag to scrub, arrows to nudge ── */
    if(track){
      track.classList.add('is-seekable');
      track.setAttribute('role', 'slider');
      track.setAttribute('tabindex', '0');

      function fracFromEvent(e){
        var rect = track.getBoundingClientRect();
        if(!rect.width) return 0;
        return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      }
      function seekTo(frac){
        if(!vid.duration) return;
        vid.currentTime = frac * vid.duration;
        paint(frac);   /* immediate feedback — don't wait for timeupdate */
      }
      function nudge(delta){
        if(!vid.duration) return;
        var t = Math.max(0, Math.min(vid.duration, vid.currentTime + delta));
        vid.currentTime = t;
        paint(t / vid.duration);
      }

      track.addEventListener('pointerdown', function(e){
        e.stopPropagation();    /* keep the film-wide click (play/pause) from firing */
        e.preventDefault();
        scrubbing = true;
        if(track.setPointerCapture){ try{ track.setPointerCapture(e.pointerId); }catch(_){} }
        seekTo(fracFromEvent(e));
      });
      track.addEventListener('pointermove', function(e){ if(scrubbing) seekTo(fracFromEvent(e)); });
      function endScrub(){ scrubbing = false; }
      track.addEventListener('pointerup', endScrub);
      track.addEventListener('pointercancel', endScrub);

      track.addEventListener('keydown', function(e){
        if(!vid.duration) return;
        var step = Math.max(1, vid.duration * 0.05);   /* ±5 % of the film, min 1 s */
        if(e.key === 'ArrowRight' || e.key === 'ArrowUp'){ nudge(step); e.preventDefault(); }
        else if(e.key === 'ArrowLeft' || e.key === 'ArrowDown'){ nudge(-step); e.preventDefault(); }
        else if(e.key === 'Home'){ seekTo(0); e.preventDefault(); }
        else if(e.key === 'End'){ seekTo(1); e.preventDefault(); }
      });
    }

    syncToggle(); syncMute();
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
