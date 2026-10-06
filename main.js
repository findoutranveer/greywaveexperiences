/* ============================================================
   GREYWAVE EXPERIENCES — V2 shared scripts
   ============================================================ */
(function(){
  "use strict";
  var WA_NUMBER = "918400500528";
  function waLink(msg){ return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg); }

  /* ---- intro splash (homepage only): plays once per session ---- */
  (function(){
    var intro = document.getElementById("intro");
    if(!intro) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(reduce){
      if(intro.parentNode) intro.parentNode.removeChild(intro);
      return;
    }
    document.documentElement.classList.add("intro-lock");
    document.body.classList.add("intro-lock");
    var done = false;
    function endIntro(){
      if(done) return; done = true;
      intro.classList.add("hide");
      document.documentElement.classList.remove("intro-lock");
      document.body.classList.remove("intro-lock");
      setTimeout(function(){ if(intro.parentNode) intro.parentNode.removeChild(intro); }, 800);
    }
    var t = setTimeout(endIntro, 2600);
    intro.addEventListener("click", function(){ clearTimeout(t); endIntro(); });
  })();

  document.addEventListener("DOMContentLoaded", function(){
    var nav     = document.getElementById("nav");
    var burger  = document.getElementById("burger");
    var menu    = document.getElementById("mobileMenu");
    var mmClose = document.getElementById("mmClose");

    /* ---- nav: solid on scroll ---- */
    function onScroll(){ if(nav) nav.classList.toggle("solid", window.scrollY > 40); }
    onScroll();
    window.addEventListener("scroll", onScroll, {passive:true});

    /* ---- mobile menu (full-screen, left slide, single close, scroll lock) ---- */
    function openMenu(){
      if(!menu) return;
      menu.classList.add("open");
      document.documentElement.classList.add("menu-lock");
      document.body.classList.add("menu-lock");
      if(burger) burger.setAttribute("aria-expanded","true");
    }
    function closeMenu(){
      if(!menu) return;
      menu.classList.remove("open");
      document.documentElement.classList.remove("menu-lock");
      document.body.classList.remove("menu-lock");
      if(burger) burger.setAttribute("aria-expanded","false");
    }
    if(burger) burger.addEventListener("click", function(){
      menu && menu.classList.contains("open") ? closeMenu() : openMenu();
    });
    if(mmClose) mmClose.addEventListener("click", closeMenu);
    if(menu) Array.prototype.forEach.call(menu.querySelectorAll("a"), function(a){
      a.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function(e){
      if((e.key === "Escape" || e.keyCode === 27) && menu && menu.classList.contains("open")) closeMenu();
    });
    window.addEventListener("resize", function(){
      if(window.innerWidth > 860 && menu && menu.classList.contains("open")) closeMenu();
    });

    /* ---- reveal on scroll (one subtle entrance) ---- */
    var rvs = document.querySelectorAll(".rv");
    if("IntersectionObserver" in window && rvs.length){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, {threshold:0.12, rootMargin:"0px 0px -8% 0px"});
      rvs.forEach(function(el){ io.observe(el); });
    } else {
      rvs.forEach(function(el){ el.classList.add("in"); });
    }

    /* ---- year in footer ---- */
    var y = document.getElementById("yr"); if(y) y.textContent = new Date().getFullYear();

    /* ---- WhatsApp-routed forms ----
       Any form with data-wa builds a pre-filled WhatsApp message from its fields
       (fields are read by their `name`, using data-label or the field label). */
    Array.prototype.forEach.call(document.querySelectorAll("form[data-wa]"), function(form){
      form.addEventListener("submit", function(e){
        e.preventDefault();
        var intro = form.getAttribute("data-intro") || "Hi Greywave,";
        var lines = [intro, ""];
        Array.prototype.forEach.call(form.querySelectorAll("[name]"), function(el){
          var label = el.getAttribute("data-label") || el.getAttribute("name");
          if(el.type === "checkbox"){
            if(el.checked){
              var grp = el.getAttribute("data-group") || label;
              lines.push("• " + grp + ": " + (el.value || "Yes"));
            }
          } else if(el.value && el.value.trim()){
            lines.push(label + ": " + el.value.trim());
          }
        });
        window.open(waLink(lines.join("\n")), "_blank", "noopener");
      });
    });

    /* ---- any element with data-wa-msg opens WhatsApp with that message ---- */
    Array.prototype.forEach.call(document.querySelectorAll("[data-wa-msg]"), function(el){
      el.addEventListener("click", function(e){
        e.preventDefault();
        window.open(waLink(el.getAttribute("data-wa-msg")), "_blank", "noopener");
      });
    });
  });
})();
