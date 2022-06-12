'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

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
const section1 = document.querySelector('#section--1');
const btnLearnMore = document.querySelector('.btn--scroll-to');
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

//nav smooth scrolling ---
// //looping over all element
// document.querySelectorAll('.nav__link').forEach(el => {
//   el.addEventListener('click', function(e) {
//     e.preventDefault()
//     const id = this.getAttribute('href')
//     document.querySelector(id).scrollIntoView({behavior: 'smooth'})
//   });
// });

//with event delegation(adding the event to the parent el)
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  //matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

