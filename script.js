// เครือข่ายตัวแปรกลางสำหรับเก็บสถานะภาษาปัจจุบัน (เริ่มต้นเป็นอังกฤษ)
let currentLang = 'en';
let activeHexData = null; // เก็บข้อมูล Hexagon ตัวล่าสุดที่ถูกคลิก

// ฟังก์ชันสลับภาษาหลัก (รับค่าจาก Dropdown)
function changeLanguage(lang) {
    currentLang = lang;
    
    // อัปเดตภาษาที่ตัว Body เพื่อให้ CSS จัดการซ่อน/แสดงผล
    document.body.className = `lang-${lang}`;

    // หากมีการเลือก Hexagon ค้างไว้ ให้ทำการรีเฟรชข้อความภาษาในกล่องข้อมูลด้วย
    if (activeHexData) {
        renderHexInfo();
    }
}

// ฟังก์ชันรับข้อมูลเมื่อกดคลิกรังผึ้ง (รับ พารามิเตอร์ URL ของหน้าปลายทางมาด้วย)
function selectHex(el, titleEn, titleTh, descEn, descTh, color, targetUrl) {
    document.querySelectorAll('.hex-box').forEach(h => h.classList.remove('active'));
    el.classList.add('active');

    // บันทึกข้อมูลลง Object กลาง (จำ URL ปลายทางไว้ด้วย)
    activeHexData = { titleEn, titleTh, descEn, descTh, color, targetUrl };
    renderHexInfo();
}

// ฟังก์ชันวาดเนื้อหาลงกล่องข้อความ Hexagon ตามภาษาที่ใช้งานอยู่
function renderHexInfo() {
    if (!activeHexData) return;

    const activeUI = document.getElementById('activeUI');
    const idleUI = document.getElementById('idleUI');

    idleUI.style.opacity = '0';
    setTimeout(() => {
        idleUI.style.display = 'none';
        activeUI.style.display = 'block';
        
        // คัดกรองภาษาที่จะแสดงผล (เพิ่มเงื่อนไขภาษาอื่นๆ ได้ตรงนี้ แต่เพื่อความง่าย เราใช้ EN เป็น default หากไม่มีข้อมูลภาษาอื่น)
        // ** เนื่องจากผมไม่ได้ส่งข้อมูลภาษา JP มาในฟังก์ชัน selectHex ด้านบน (ไม่งั้นโค้ดจะยาวเกินไป) 
        // ถ้าเป็นภาษาอื่นที่ยังไม่ได้ป้อนใน js จะแสดงเป็นภาษาอังกฤษแทนอัตโนมัติ
        let title = activeHexData.titleEn;
        let desc = activeHexData.descEn;
        
        if (currentLang === 'th') {
            title = activeHexData.titleTh;
            desc = activeHexData.descTh;
        } 
        // ถ้าจะเพิ่มตัวแปรรับภาษา JP ในอนาคต ให้ใส่ else if (currentLang === 'jp') { ... } 

        const color = activeHexData.color;

        document.getElementById('d-title').innerHTML = title;
        document.getElementById('d-desc').innerText = desc;
        
        // ตกแต่งเฉดสีของกล่องตามสถานะ Core/Care แบบไดนามิก
        const infoPanel = document.getElementById('infoPanel');
        infoPanel.style.borderTopColor = color; 
        infoPanel.style.boxShadow = `0 0 40px ${color.replace(')', ', 0.15)').replace('rgb', 'rgba')}, inset 0 0 20px ${color.replace(')', ', 0.05)').replace('rgb', 'rgba')}`;
        
        document.getElementById('activeTag').style.color = color;
        document.getElementById('activeTagTh').style.color = color;
        
        // หากมีแท็กภาษา JP ก็อัปเดตสีด้วย
        const tagJp = document.getElementById('activeTagJp');
        if(tagJp) tagJp.style.color = color;

        // จัดการปุ่ม EXPLORE MODULE
        const dBtn = document.getElementById('d-btn');
        dBtn.style.backgroundColor = color;
        dBtn.style.boxShadow = `0 0 15px ${color.replace(')', ', 0.5)').replace('rgb', 'rgba')}`;
        dBtn.style.color = (color === 'var(--color-core)' || color === '#FFD700' || color === 'var(--color-or)') ? '#000' : '#fff';
        
        // ** ส่วนสำคัญ: กำหนดให้ปุ่มเมื่อกดแล้ว วิ่งไปที่หน้า targetUrl **
        dBtn.onclick = function() {
            window.location.href = activeHexData.targetUrl;
        };

    }, 200);
}

// --- ส่วนระบบจัดระเบียบสไลเดอร์ รูปภาพอุปกรณ์ IDH ---
let idhCurrentIndex = 0;
const idhSlides = document.querySelectorAll('.idh-slide');
const idhDots = document.querySelectorAll('.indicator-dot');
const totalIdhSlides = idhSlides.length;
let idhAutoTimer;

function updateSlideUI() {
    document.querySelectorAll('.idh-slide').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.indicator-dot').forEach(d => d.classList.remove('active'));
    idhSlides[idhCurrentIndex].classList.add('active');
    idhDots[idhCurrentIndex].classList.add('active');
}

function autoCycleIdhCarousel() {
    if (totalIdhSlides === 0) return;
    idhCurrentIndex = (idhCurrentIndex + 1) % totalIdhSlides;
    updateSlideUI();
}

function startAutoSlide() {
    if (totalIdhSlides > 0) {
        clearInterval(idhAutoTimer); 
        idhAutoTimer = setInterval(autoCycleIdhCarousel, 4000);
    }
}

function manualChangeSlide(direction) {
    idhCurrentIndex = idhCurrentIndex + direction;
    if(idhCurrentIndex < 0) idhCurrentIndex = totalIdhSlides - 1;
    else if(idhCurrentIndex >= totalIdhSlides) idhCurrentIndex = 0;
    updateSlideUI();
    startAutoSlide(); 
}

function goToSlide(index) {
    idhCurrentIndex = index;
    updateSlideUI();
    startAutoSlide(); 
}

startAutoSlide();

// --- ส่วนการตรวจจับทิศทางการเลื่อนเพื่อทำ Animation ค่อยๆ โผล่ขึ้นมา ---
const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));