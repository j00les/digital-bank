'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const tabs = document.querySelectorAll('.operations__tab');
const tabContents = document.querySelectorAll('.operations__content');
const tabContainer = document.querySelector('.operations__tab-container');

const section1 = document.querySelector('#section--1');
const btnLearnMore = document.querySelector('.btn--scroll-to');

const navContainer = document.querySelector('.nav');
const linkContainer = document.querySelector('.nav__links');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//learn more smooth scrolling ---
btnLearnMore.addEventListener('click', () => {
  //get offset, coordinate and stuff
  // const sect1Coords = section1.getBoundingClientRect();

  //scrollTo(x(left), y(top)) + window axes so it'll be relative to the window
  // window.scrollTo({
  //   left: sect1Coords.left,
  //   top: sect1Coords.top + window.scrollY,
  //   behavior: "smooth"
  // });

  //the easy way
  section1.scrollIntoView({ behavior: 'smooth' });
});

//with event delegation(adding event to the parent el instead of looping all over the el)
linkContainer.addEventListener('click', function (e) {
  e.preventDefault();
  //matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');

    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//tabbed component(with delegation)
tabContainer.addEventListener('click', function (e) {
  const tabClicked = e.target.closest('.operations__tab');

  //guard clause
  if (!tabClicked) return;

  //remove the active tabs and contents class
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabContents.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  //add active class (don't forget to remove the class first above)
  tabClicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${tabClicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//nav animation
const handleOpacity = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target; //(this/the element we're working with)
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};

navContainer.addEventListener('mouseover', handleOpacity.bind(0.5));
navContainer.addEventListener('mouseout', handleOpacity.bind(1));

//sticky nav
const header = document.querySelector('.header');
const navHeight = navContainer.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  !entry.isIntersecting
    ? navContainer.classList.add('sticky')
    : navContainer.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//reveal sections
const allSections = document.querySelectorAll('.section');

const revealSections = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  //guard clause
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSections, {
  root: null,
  threshold: 0.15, //15 precent
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//lazy loading
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  //guard clause
  if (!entry.isIntersecting) return;

  //replace img src with dataset src (look at the html)
  entry.target.src = entry.target.dataset.src;

  entry.target.classList.remove('lazy-img');
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '100px'
});

imgTargets.forEach(img => imgObserver.observe(img));
