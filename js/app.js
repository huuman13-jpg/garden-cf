(function() {
  'use strict';

  var G = window.GNC;
  var bonsaiData = G.loadData('gnc_bonsai', G.DEFAULT_BONSAI);
  var heroData = G.loadData('gnc_hero', {
    title: 'Garden<br><span class="text-gold">&</span> Coffee',
    desc: 'Nơi nghệ thuật bonsai gặp gỡ nhượng thưởng cà phê — một chuyến đi cảm giác giữa tươi xanh và hương thơm.'
  });

  document.getElementById('hero-title').innerHTML = heroData.title;
  document.getElementById('hero-desc').innerHTML = heroData.desc;

  // ============================================================
  // RENDER COFFEE MENU
  // ============================================================
  var menuEl = document.getElementById('coffee-menu');
  G.COFFEE_MENU.forEach(function(item) {
    var div = document.createElement('div');
    div.className = 'flex items-center justify-between bg-white/5 rounded-xl px-5 py-4 border border-white/5 hover:border-gold/20 transition-colors';
    div.innerHTML = '<div class="flex items-center gap-3">'
      + '<i class="fas ' + item.icon + ' text-gold/70 text-sm"></i>'
      + '<span class="text-white font-light">' + item.name + '</span></div>'
      + '<span class="text-gold font-medium text-sm">' + item.price + '</span>';
    menuEl.appendChild(div);
  });

  // ============================================================
  // BONSAI CAROUSEL
  // ============================================================
  var currentSlide = 0;
  var mainImg = document.getElementById('main-bonsai-img');
  var thumbBar = document.getElementById('thumbnail-bar');
  var slideCounter = document.getElementById('slide-counter');

  function renderThumbnails() {
    thumbBar.innerHTML = '';
    bonsaiData.forEach(function(b, i) {
      var div = document.createElement('div');
      div.className = 'thumb-item flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden' + (i === currentSlide ? ' active' : '');
      div.innerHTML = '<img src="' + b.image + '" alt="' + b.name + '" class="w-full h-full object-cover" loading="lazy">';
      div.addEventListener('click', function() { goToSlide(i); });
      thumbBar.appendChild(div);
    });
  }

  function updateSlideInfo(index) {
    var b = bonsaiData[index];
    document.getElementById('bonsai-name').textContent = b.name;
    document.getElementById('bonsai-age').textContent = b.age;
    document.getElementById('bonsai-height').textContent = b.height;
    document.getElementById('bonsai-style').textContent = b.style;
    document.getElementById('bonsai-meaning').textContent = b.meaning;
    document.getElementById('bonsai-desc').textContent = b.description;
    slideCounter.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(bonsaiData.length).padStart(2, '0');
  }

  function goToSlide(index) {
    if (index === currentSlide) return;
    var turb = document.getElementById('liquid-turb');
    var disp = document.getElementById('liquid-displace');
    gsap.to(disp, { attr: { scale: 60 }, duration: 0.25, ease: 'power2.in' });
    gsap.to(mainImg, { opacity: 0.5, scale: 1.03, duration: 0.25 });
    setTimeout(function() {
      currentSlide = index;
      mainImg.src = bonsaiData[index].image;
      updateSlideInfo(index);
      renderThumbnails();
      gsap.to(disp, { attr: { scale: 0 }, duration: 0.5, ease: 'power2.out' });
      gsap.to(mainImg, { opacity: 1, scale: 1, duration: 0.5 });
      gsap.fromTo('#bonsai-info', { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' });
    }, 280);
  }

  document.getElementById('prev-slide').addEventListener('click', function() {
    goToSlide((currentSlide - 1 + bonsaiData.length) % bonsaiData.length);
  });
  document.getElementById('next-slide').addEventListener('click', function() {
    goToSlide((currentSlide + 1) % bonsaiData.length);
  });

  renderThumbnails();
  updateSlideInfo(0);

  // ============================================================
  // LIGHTBOX
  // ============================================================
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  document.getElementById('btn-lightbox').addEventListener('click', function() {
    lightboxImg.src = bonsaiData[currentSlide].image;
    lightboxImg.alt = bonsaiData[currentSlide].name;
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
  });
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox || e.target.closest('button')) {
      lightbox.classList.add('hidden');
      lightbox.classList.remove('flex');
    }
  });

  // ============================================================
  // MODAL BÁO GIÁ
  // ============================================================
  var priceModal = document.getElementById('price-modal');
  var modalBonsaiName = document.getElementById('modal-bonsai-name');

  document.getElementById('btn-ask-price').addEventListener('click', function() {
    modalBonsaiName.textContent = bonsaiData[currentSlide].name;
    priceModal.classList.remove('hidden');
    priceModal.classList.add('flex');
  });

  document.getElementById('close-price-modal').addEventListener('click', function() {
    priceModal.classList.add('hidden');
    priceModal.classList.remove('flex');
  });

  priceModal.addEventListener('click', function(e) {
    if (e.target === priceModal) {
      priceModal.classList.add('hidden');
      priceModal.classList.remove('flex');
    }
  });

  // Cập nhật tên cây nếu đang mở modal mà chuyển slide
  var _goToSlide = goToSlide;
  goToSlide = function(index) {
    _goToSlide(index);
    if (!priceModal.classList.contains('hidden')) {
      setTimeout(function() {
        modalBonsaiName.textContent = bonsaiData[currentSlide].name;
      }, 300);
    }
  };

  // ============================================================
  // CONTACT FORM
  // ============================================================
  document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var valid = true;
    var nameIn = document.getElementById('c-name');
    var phoneIn = document.getElementById('c-phone');
    document.querySelectorAll('[data-error]').forEach(function(el) { el.classList.add('hidden'); });
    nameIn.style.borderColor = ''; phoneIn.style.borderColor = '';
    if (!nameIn.value.trim()) {
      document.querySelector('[data-error="c-name"]').classList.remove('hidden');
      nameIn.style.borderColor = '#f87171'; valid = false;
    }
    if (!/^[\d\s+()-]{8,}$/.test(phoneIn.value.trim())) {
      document.querySelector('[data-error="c-phone"]').classList.remove('hidden');
      phoneIn.style.borderColor = '#f87171'; valid = false;
    }
    if (valid) { G.showToast('Lời nhắn đã được gửi thành công!'); e.target.reset(); }
  });

  // ============================================================
  // MOBILE MENU
  // ============================================================
  var mobileBtn = document.getElementById('mobile-menu-btn');
  var mobileMenu = document.getElementById('mobile-menu');
  mobileBtn.addEventListener('click', function() { mobileMenu.classList.toggle('hidden'); });
  document.querySelectorAll('.mobile-link').forEach(function(a) {
    a.addEventListener('click', function() { mobileMenu.classList.add('hidden'); });
  });

  // ============================================================
  // GSAP SCROLL ANIMATIONS
  // ============================================================
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll('.fade-up').forEach(function(el) {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  var sections = document.querySelectorAll('[data-shape]');
  sections.forEach(function(sec, idx) {
    ScrollTrigger.create({
      trigger: sec, start: 'top center', end: 'bottom center',
      onEnter: function() { window.GNC.currentSection = idx; },
      onEnterBack: function() { window.GNC.currentSection = idx; }
    });
  });

  var navLinks = document.querySelectorAll('.nav-link');
  sections.forEach(function(sec, idx) {
    ScrollTrigger.create({
      trigger: sec, start: 'top center', end: 'bottom center',
      onEnter: function() { highlightNav(idx); },
      onEnterBack: function() { highlightNav(idx); }
    });
  });
  function highlightNav(idx) {
    navLinks.forEach(function(l, i) {
      if (i === idx) { l.classList.add('text-neon'); l.classList.remove('text-white/70'); }
      else { l.classList.remove('text-neon'); l.classList.add('text-white/70'); }
    });
  }

  // ============================================================
  // LOADING SCREEN + PHÍM TẮT
  // ============================================================
  window.addEventListener('load', function() {
    setTimeout(function() {
      document.getElementById('loader').classList.add('hidden');
    }, 800);
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      // Đóng lightbox
      if (!lightbox.classList.contains('hidden')) {
        lightbox.classList.add('hidden');
        lightbox.classList.remove('flex');
      }
      // Đóng modal báo giá
      if (!priceModal.classList.contains('hidden')) {
        priceModal.classList.add('hidden');
        priceModal.classList.remove('flex');
      }
      // Đóng mobile menu
      if (!mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
      }
    }
  });

})();
