// Калькулятор стоимости
class PriceCalculator {
 constructor() {
 this.currentStep = 1;
 this.basePrice = 0;
 this.finalPrice = 0;
 this.breakdown = [];
 this.init();
 }

 init() {
 this.bindEvents();
 this.updateStepIndicators();
 }

 bindEvents() {
 const serviceTypeSelect = document.getElementById('serviceType');
 const calculateBtn = document.getElementById('calculateBtn');
 const promoCode = document.getElementById('promoCode');

 serviceTypeSelect.addEventListener('change', (e) => {
 this.handleServiceTypeChange(e.target.value);
 });

 calculateBtn.addEventListener('click', () => {
 this.calculatePrice();
 });

 // Обработчики для слайдеров
 this.bindSliderEvents();
 
 // Обработчики для радио кнопок
 this.bindRadioEvents();
 
 // Обработчики для инпутов страниц
 this.bindPageInputEvents();
 }

 bindSliderEvents() {
 const sliders = ['courseworkPages', 'articlePages', 'presentationSlides'];
 sliders.forEach(sliderId => {
 const slider = document.getElementById(sliderId);
 const valueSpan = document.getElementById(sliderId + 'Value');
 const input = document.getElementById(sliderId + 'Input');
 
 if (slider && valueSpan) {
 slider.addEventListener('input', (e) => {
 const value = e.target.value;
 valueSpan.textContent = value;
 if (input) input.value = value;
 });
 }
 });
 }

 bindPageInputEvents() {
 const inputs = ['courseworkPagesInput', 'articlePagesInput', 'presentationSlidesInput'];
 inputs.forEach(inputId => {
 const input = document.getElementById(inputId);
 const sliderName = inputId.replace('Input', '');
 const slider = document.getElementById(sliderName);
 const valueSpan = document.getElementById(sliderName + 'Value');
 
 if (input && slider && valueSpan) {
 input.addEventListener('input', (e) => {
 const value = Math.max(1, Math.min(parseInt(e.target.value) || 1, slider.max));
 e.target.value = value;
 slider.value = value;
 valueSpan.textContent = value;
 });
 }
 });
 }

 bindRadioEvents() {
 const radioOptions = document.querySelectorAll('.radio-option');
 radioOptions.forEach(option => {
 option.addEventListener('click', () => {
 const input = option.querySelector('input[type="radio"]');
 if (input) {
 input.checked = true;
 // Обновляем визуальное состояние
 option.parentElement.querySelectorAll('.radio-option').forEach(opt => {
 opt.classList.remove('active');
 });
 option.classList.add('active');
 }
 });
 });

 // Обработчики для чекбоксов
 const checkboxGroups = document.querySelectorAll('.checkbox-group');
 checkboxGroups.forEach(group => {
 group.addEventListener('click', () => {
 const input = group.querySelector('input[type="checkbox"]');
 if (input) {
 input.checked = !input.checked;
 group.classList.toggle('active', input.checked);
 }
 });
 });
 }

 handleServiceTypeChange(serviceType) {
 // Скрываем все поля
 document.querySelectorAll('.service-fields').forEach(field => {
 field.classList.remove('active');
 });

 // Сбрасываем результат
 document.getElementById('priceResult').classList.remove('show');
 
 if (!serviceType) {
 this.currentStep = 1;
 document.getElementById('promoSection').style.display = 'none';
 document.getElementById('calculateBtn').style.display = 'none';
 this.updateStepIndicators();
 return;
 }

 // Показываем соответствующие поля
 const fieldMap = {
 'diploma': 'diplomaFields',
 'coursework': 'courseworkFields',
 'project': 'projectFields',
 'article': 'articleFields',
 'candidate': 'candidateFields',
 'presentation': 'presentationFields',
 'tutoring': 'tutoringFields',
 'psychology': 'psychologyFields'
 };

 const fieldsId = fieldMap[serviceType];
 if (fieldsId) {
 document.getElementById(fieldsId).classList.add('active');
 }

 // Обновляем шаги
 this.currentStep = 2;
 this.updateStepIndicators();

 // Показываем промокод и кнопку для большинства услуг
 if (serviceType !== 'psychology') {
 document.getElementById('promoSection').style.display = 'block';
 document.getElementById('calculateBtn').style.display = 'block';
 } else {
 // Для психологической консультации показываем результат сразу
 this.showPsychologyResult();
 }
 }

 showPsychologyResult() {
 const result = document.getElementById('priceResult');
 result.classList.add('show');
 this.currentStep = 3;
 this.updateStepIndicators();
 }

 updateStepIndicators() {
 for (let i = 1; i <= 3; i++) {
 const step = document.getElementById(`step${i}`);
 if (i <= this.currentStep) {
 step.classList.add('active');
 } else {
 step.classList.remove('active');
 }
 }
 }

 calculatePrice() {
 const serviceType = document.getElementById('serviceType').value;
 
 this.breakdown = [];
 this.basePrice = 0;
 this.finalPrice = 0;

 switch (serviceType) {
 case 'diploma':
 this.calculateDiplomaPrice();
 break;
 case 'coursework':
 this.calculateCourseworkPrice();
 break;
 case 'project':
 this.calculateProjectPrice();
 break;
 case 'article':
 this.calculateArticlePrice();
 break;
 case 'candidate':
 this.calculateCandidatePrice();
 break;
 case 'presentation':
 this.calculatePresentationPrice();
 break;
 case 'tutoring':
 this.calculateTutoringPrice();
 break;
 }

 this.applyPromoCode();
 this.showResult();
 }

 calculateDiplomaPrice() {
 const pages = document.getElementById('diplomaPages').value;
 const originality = document.getElementById('diplomaOriginality').value;
 const diplomaType = document.querySelector('input[name="diplomaType"]:checked')?.value;
 const deadline = document.getElementById('diplomaDeadline').value;
 const discipline = document.getElementById('diplomaDiscipline').value;
 const hasDrawings = document.getElementById('diplomaDrawings').checked;

 // Базовые цены
 const basePrices = {
 '40-49': { '50': 17000, '65': 19000, '80': 19000 },
 '50-59': { '50': 20000, '65': 23000, '80': 23000 },
 '60+': { '50': 23000, '65': 26000, '80': 26000 }
 };

 this.basePrice = basePrices[pages][originality];
 this.finalPrice = this.basePrice;
 this.breakdown.push(`Базовая стоимость: ${this.basePrice}₽`);

 // Доплата за страницы от 60+
 if (pages === '60+') {
 const extraPages = 10; // Примерное количество дополнительных страниц
 const extraCost = extraPages * 250;
 this.finalPrice += extraCost;
 this.breakdown.push(`Доплата за дополнительные страницы: +${extraCost}₽`);
 }

 // Тип работы
 if (diplomaType === 'master') {
 this.finalPrice += 2000;
 this.breakdown.push(`Магистерская диссертация: +2000₽`);
 }

 // Срочность
 if (deadline === 'medium' || deadline === 'urgent') {
 this.finalPrice += 1500;
 this.breakdown.push(`Срочный заказ: +1500₽`);
 } else if (deadline === 'very-urgent') {
 this.finalPrice += 3000;
 this.breakdown.push(`Очень срочный заказ: +3000₽`);
 }

 // Сложность дисциплины
 if (discipline === 'technical') {
 this.finalPrice += 500;
 this.breakdown.push(`Техническая дисциплина: +500₽`);
 }

 // Оригинальность 80%+
 if (originality === '80') {
 this.finalPrice = Math.round(this.finalPrice * 1.05);
 this.breakdown.push(`Оригинальность 80%+: +5%`);
 }

 // Чертежи
 if (hasDrawings) {
 this.finalPrice = Math.round(this.finalPrice * 1.10);
 this.breakdown.push(`Чертежи: +10%`);
 }
 }

 calculateCourseworkPrice() {
 const pages = parseInt(document.getElementById('courseworkPagesInput').value) || 
             parseInt(document.getElementById('courseworkPages').value);
 const originality = document.getElementById('courseworkOriginality').value;
 const deadline = document.getElementById('courseworkDeadline').value;
 const discipline = document.getElementById('courseworkDiscipline').value;
 const hasDrawings = document.getElementById('courseworkDrawings').checked;

 // Базовая цена
 this.basePrice = 2800;
 this.finalPrice = this.basePrice;
 this.breakdown.push(`Базовая стоимость: ${this.basePrice}₽`);

 // Корректировка по страницам
 if (pages < 25) {
 this.finalPrice -= 400;
 this.breakdown.push(`Менее 25 страниц: -400₽`);
 }
 if (pages < 20) {
 this.finalPrice -= 300;
 this.breakdown.push(`Менее 20 страниц: -300₽`);
 }

 // Оригинальность
 if (originality === '70') {
 this.finalPrice += 400;
 this.breakdown.push(`Оригинальность 70%+: +400₽`);
 }

 // Срочность
 if (deadline === 'medium') {
 this.finalPrice += 300;
 this.breakdown.push(`Срочный заказ: +300₽`);
 } else if (deadline === 'urgent') {
 this.finalPrice += 500;
 this.breakdown.push(`Очень срочный заказ: +500₽`);
 }

 // Сложность дисциплины
 if (discipline === 'technical') {
 this.finalPrice += 500;
 this.breakdown.push(`Техническая дисциплина: +500₽`);
 }

 // Оригинальность 80%+
 if (originality === '80') {
 this.finalPrice = Math.round(this.finalPrice * 1.05);
 this.breakdown.push(`Оригинальность 80%+: +5%`);
 }

 // Чертежи
 if (hasDrawings) {
 this.finalPrice = Math.round(this.finalPrice * 1.10);
 this.breakdown.push(`Чертежи: +10%`);
 }
 }

 calculateProjectPrice() {
 const pages = document.getElementById('projectPages').value;
 const discipline = document.getElementById('projectDiscipline').value;
 const hasDrawings = document.getElementById('projectDrawings').checked;

 // Базовая цена
 const pagesPrices = {
 '20': 2500,
 '30': 3500,
 '40': 4500
 };

 this.basePrice = pagesPrices[pages];
 this.finalPrice = this.basePrice;
 this.breakdown.push(`${pages} страниц: ${this.basePrice}₽`);

 // Сложность дисциплины
 if (discipline === 'technical') {
 this.finalPrice += 500;
 this.breakdown.push(`Техническая дисциплина: +500₽`);
 }

 // Чертежи
 if (hasDrawings) {
 this.finalPrice = Math.round(this.finalPrice * 1.10);
 this.breakdown.push(`Чертежи: +10%`);
 }
 }

 calculateArticlePrice() {
 const pages = parseInt(document.getElementById('articlePagesInput').value) || 
             parseInt(document.getElementById('articlePages').value);

 if (pages <= 7) {
 this.finalPrice = 1400;
 } else {
 this.finalPrice = 1700;
 }

 this.breakdown.push(`Научная статья (${pages} стр.): ${this.finalPrice}₽`);
 }

 calculateCandidatePrice() {
 const discipline = document.getElementById('candidateDiscipline').value;
 
 this.finalPrice = 75000;
 this.breakdown.push(`Кандидатская диссертация: ${this.finalPrice}₽`);

 // Сложность дисциплины - увеличена доплата
 if (discipline === 'technical') {
 this.finalPrice += 15000;
 this.breakdown.push(`Техническая дисциплина: +15000₽`);
 }
 }

 calculatePresentationPrice() {
 const slides = parseInt(document.getElementById('presentationSlidesInput').value) || 
               parseInt(document.getElementById('presentationSlides').value);
 
 this.finalPrice = 1500;
 this.breakdown.push(`Презентация: ${this.finalPrice}₽`);

 if (slides > 10) {
 const additionalPrice = Math.ceil((slides - 10) / 5) * 500;
 this.finalPrice += additionalPrice;
 this.breakdown.push(`Дополнительные слайды: +${additionalPrice}₽`);
 }
 }

 calculateTutoringPrice() {
 const duration = document.getElementById('tutoringDuration').value;
 
 const prices = {
 '1': 900,
 '1.5': 1300,
 '2': 1700
 };

 this.finalPrice = prices[duration];
 this.breakdown.push(`Репетиторство (${duration} час): ${this.finalPrice}₽`);
 }

 applyPromoCode() {
 const promoCode = document.getElementById('promoCode').value.toUpperCase();
 
 if (promoCode === 'STASOWU') {
 this.finalPrice = Math.round(this.finalPrice * 0.92);
 this.breakdown.push(`Скидка по промокоду: -8%`);
 } else if (promoCode === 'OWU01' || promoCode === 'OWU001') {
 this.finalPrice = Math.round(this.finalPrice * 0.95);
 this.breakdown.push(`Скидка по промокоду: -5%`);
 }
 }

 showResult() {
 const result = document.getElementById('priceResult');
 const priceElement = document.getElementById('finalPrice');
 const breakdownElement = document.getElementById('priceBreakdown');

 priceElement.textContent = `${this.finalPrice}₽`;
 breakdownElement.innerHTML = this.breakdown.join('<br>');

 result.classList.add('show');
 this.currentStep = 3;
 this.updateStepIndicators();
 }
}

// Инициализация калькулятора
document.addEventListener('DOMContentLoaded', () => {
 new PriceCalculator();
});

// Counter Animation
function animateCounters() {
 const counters = document.querySelectorAll('.counter');
 counters.forEach(counter => {
 const target = parseInt(counter.getAttribute('data-target'));
 const duration = 2000;
 const step = target / (duration / 50);
 let current = 0;
 
 const timer = setInterval(() => {
 current += step;
 if (current >= target) {
 counter.textContent = target + (target === 94 ? '%' : '');
 clearInterval(timer);
 } else {
 counter.textContent = Math.floor(current) + (target === 94 ? '%' : '');
 }
 }, 50);
 });
}

// Carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel__slide');
const totalSlides = slides.length;

function showSlide(index) {
 slides.forEach(slide => slide.classList.remove('current-slide'));
 slides[index].classList.add('current-slide');
 const carousel = document.querySelector('.carousel__track');
 carousel.style.transform = `translateX(-${index * 100}%)`;
}

document.querySelector('.carousel__btn--next').addEventListener('click', () => {
 currentSlide = (currentSlide + 1) % totalSlides;
 showSlide(currentSlide);
});

document.querySelector('.carousel__btn--prev').addEventListener('click', () => {
 currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
 showSlide(currentSlide);
});

// Auto-advance carousel
setInterval(() => {
 currentSlide = (currentSlide + 1) % totalSlides;
 showSlide(currentSlide);
}, 5000);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
 anchor.addEventListener('click', function (e) {
 e.preventDefault();
 const target = document.querySelector(this.getAttribute('href'));
 if (target) {
 target.scrollIntoView({
 behavior: 'smooth',
 block: 'start'
 });
 }
 });
});

// Animate counters when they come into view
const observer = new IntersectionObserver((entries) => {
 entries.forEach(entry => {
 if (entry.isIntersecting && entry.target.classList.contains('stats')) {
 animateCounters();
 observer.unobserve(entry.target);
 }
 });
});

observer.observe(document.querySelector('.stats'));

// Mobile menu toggle
const navToggle = document.querySelector('.nav__toggle');
const navList = document.querySelector('.nav__list');

navToggle.addEventListener('click', () => {
 navList.classList.toggle('active');
 navToggle.setAttribute('aria-expanded', navList.classList.contains('active'));
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav__list a').forEach(link => {
 link.addEventListener('click', () => {
 navList.classList.remove('active');
 navToggle.setAttribute('aria-expanded', 'false');
 });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
 if (!navList.contains(e.target) && !navToggle.contains(e.target)) {
 navList.classList.remove('active');
 navToggle.setAttribute('aria-expanded', 'false');
 }
});

// Handle orientation change
window.addEventListener('orientationchange', () => {
 setTimeout(() => {
 window.scrollTo(0, window.scrollY);
 }, 100);
});