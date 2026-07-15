(function() {
  'use strict';

  var DEFAULT_BONSAI = [
    {
      id: 'MV-01',
      name: 'Mai Vàng',
      age: '15 Năm',
      height: '65 cm',
      style: 'Thủ Công',
      meaning: 'Phú quý, sang trọng',
      description: 'Thân mai già cỗi, vỏ nứt nẻ đầy khí chất. Tán lá xanh bóng xen lẫn chùm hoa vàng rực rỡ. Một trong những loài cây biểu tượng ngày Tết, mang ý nghĩa tài lộc và sung túc.',
      image: './img/maivang.jpg'
    },
    {
      id: 'SD-02',
      name: 'Sen Đá Phong Thủy',
      age: '3 Năm',
      height: '18 cm',
      style: 'Tiểu Cảnh',
      meaning: 'Bình an, trường thọ',
      description: 'Bản thu nhỏ của cảnh quan thiên nhiên — đá tai mèo xếp lớp, rêu phong bám kín, sen đá xanh mướt đan xen tạo nên một thế giới mini. Phù hợp đặt bàn làm việc hoặc kệ trang trí.',
      image: './img/senda.jpg'
    },
    {
      id: 'TN-03',
      name: 'Thông Nhật Bản',
      age: '20 Năm',
      height: '75 cm',
      style: 'Chóc Cành',
      meaning: 'Kiên định, vĩnh cửu',
      description: 'Thân thông uốn lượn nghệ thuật với vỏ nứt sâu, nhánh tỏa đều quanh trục. Lá kim xanh thẫm dày đặc, tạo hình dáng chốc cánh tự nhiên. Biểu tượng của sức sống mãnh liệt và sự kiên cường.',
      image: './img/thongnhatban.jpg'
    },
    {
      id: 'TK-04',
      name: 'Tùng Lá Kim Nhật Bản',
      age: '35 Năm',
      height: '55 cm',
      style: 'Phong Thủy',
      meaning: 'Bảo vệ, vượng gia',
      description: 'Tùng La Hán — vua của các loài bonsai. Thân cây cổ kính với dấu tích sharimiki (bóc vỏ trắng), rễ chân trần bám chặt đất. Tán lá kim xanh thẫm xếp lớp như mái hiên, thể hiện tài năng nghệ nhân hàng thập kỷ.',
      image: './img/tunglakimnhatban.jpg'
    },
    {
      id: 'XR-05',
      name: 'Xương Rồng Bộ Sưu Tập',
      age: '5 Năm',
      height: '25 cm',
      style: 'Trang Trí',
      meaning: 'Sức sống, bảo vệ',
      description: 'Bộ sưu tập đa dạng các loài xương rồng và sen đá gai: cột tròn, dẹt, ngôi sao. Dáng vẻ mạnh mẽ, ít cần chăm sóc, rất phù hợp trang trí nội thất hiện đại mang hơi hướng Tây Bắc.',
      image: './img/xuongrong.jpg'
    }
  ];

  var COFFEE_MENU = [
    { name: 'Cà Phê Sữa Đá', price: '35.000đ', icon: 'fa-mug-hot' },
    { name: 'Cà Phê Phin Đen', price: '30.000đ', icon: 'fa-coffee' },
    { name: 'Bạc Xỉu', price: '40.000đ', icon: 'fa-glass-water' },
    { name: 'Trà Đào Cam Sả', price: '45.000đ', icon: 'fa-leaf' },
    { name: 'Matcha Latte', price: '50.000đ', icon: 'fa-mug-saucer' },
  ];

  var DATA_VERSION = 'v5';

  function loadData(key, fallback) {
    try {
      var stored = localStorage.getItem(key);
      if (!stored) return fallback;
      var parsed = JSON.parse(stored);
      var savedVersion = localStorage.getItem(key + '_ver');
      if (savedVersion !== DATA_VERSION) {
        localStorage.removeItem(key);
        localStorage.setItem(key + '_ver', DATA_VERSION);
        return fallback;
      }
      return parsed;
    }
    catch(e) { return fallback; }
  }

  function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(key + '_ver', DATA_VERSION);
  }

  function showToast(msg, type) {
    type = type || 'success';
    var t = document.createElement('div');
    t.className = 'fixed bottom-6 right-6 px-6 py-3 rounded-xl z-[9999] text-sm font-medium transform translate-y-4 opacity-0 transition-all duration-300 '
      + (type === 'success' ? 'bg-neon text-black' : 'bg-red-500 text-white');
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function() { t.classList.add('toast-enter'); });
    setTimeout(function() {
      t.classList.remove('toast-enter');
      setTimeout(function() { t.remove(); }, 300);
    }, 3000);
  }

  window.GNC = {
    DEFAULT_BONSAI: DEFAULT_BONSAI,
    COFFEE_MENU: COFFEE_MENU,
    loadData: loadData,
    saveData: saveData,
    showToast: showToast,
    currentSection: 0
  };

})();