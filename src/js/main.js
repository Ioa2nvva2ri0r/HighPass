/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
class AnchorLink {
  constructor(options) {
    // anchor
    if (
      options.link === undefined ||
      document.querySelector(`${options.link}`) === null
    )
      throw new Error('This link is not listed or does not exist!');
    else {
      if (
        Object.getPrototypeOf(document.querySelector(`${options.link}`))
          .constructor.name !== 'HTMLAnchorElement'
      )
        throw new Error('This selector is not a link!');
      // top offset
      if (options.topOffset === undefined) this.topOffset = 100;
      else if (isNaN(options.topOffset))
        throw new Error('Top offset must be a number!');
      else if (options.topOffset < 100)
        throw new Error('Top offset cannot be less than 100!');
      else this.topOffset = options.topOffset;

      this.link = document.querySelectorAll(`${options.link}`);
    }
  }

  set link(el) {
    this._link = el;
    this.eventLink(this._link);
  }

  get link() {
    return this._link;
  }

  retreatToAnchor(target) {
    const href = target.getAttribute('href').substring(1),
      scrollTarget = document.getElementById(`${href}`),
      elementPosition = scrollTarget.getBoundingClientRect().top;
    return elementPosition - this.topOffset;
  }

  eventLink(arraylink) {
    arraylink.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollBy({
          top: this.retreatToAnchor(e.target),
          behavior: 'smooth',
        });
      });
    });
  }
}

function elemVisible(el, classOpen, display) {
  el.style.display = display;
  el.classList.add(classOpen);
}

function elemHidden(el, classOpen, classClose, ms) {
  if (classOpen !== undefined) el.classList.remove(classOpen);
  el.classList.add(classClose);
  setTimeout(() => {
    el.style.display = 'none';
    el.classList.remove(classClose);
  }, ms);
}

function eventTab(classBtn, classBtnActive, classTab, classTabActive) {
  document.querySelectorAll(`.${classBtn}`).forEach(function (btn, id, array) {
    btn.addEventListener('click', function (event) {
      array.forEach((el) => el.classList.remove(classBtnActive));
      this.classList.add(classBtnActive);
      const path = event.currentTarget.dataset.path;
      document.querySelectorAll(`.${classTab}`).forEach(function (tab) {
        tab.classList.remove(classTabActive);
      });
      document
        .querySelector(`[data-target="${path}"]`)
        .classList.add(classTabActive);
    });
  });
}

// header
const anchorLink = new AnchorLink({
  link: '.header__nav-link',
});

const menu = document.getElementById('menu');
const menuBtnOpen = document.getElementById('menu-open');
const menuBtnClose = document.getElementById('menu-close');
const search = document.getElementById('search');
const searchBtnOpen = document.getElementById('search-open');

searchBtnOpen.addEventListener('click', () => {
  elemVisible(search, 'header__search-open', 'flex');
});
menuBtnOpen.addEventListener('click', () => {
  elemVisible(menu, 'header__nav-open', 'block');
});
menuBtnClose.addEventListener('click', () => {
  elemHidden(menu, 'header__nav-open', 'header__nav-close', 400);
});
document.body.addEventListener('click', (el) => {
  if (window.screen.width <= 900) {
    if (!search.contains(el.target) && !searchBtnOpen.contains(el.target)) {
      elemHidden(search, 'header__search-open', 'header__search-close', 400);
    }
  }
  if (window.screen.width <= 650) {
    if (!menu.contains(el.target) && !menuBtnOpen.contains(el.target)) {
      elemHidden(menu, 'header__nav-open', 'header__nav-close', 400);
    }
  }
});

// section-projects
eventTab(
  'section-projects__tab-btn',
  'section-projects__tab-btn-active',
  'section-projects__tab',
  'section-projects__tab-active'
);

// section-services
eventTab(
  'section-services__tab-btn',
  'section-services__tab-btn-active',
  'section-services__tab',
  'section-services__tab-active'
);

const formStudio = document.querySelector('.section-studio__form');
const formContacts = document.querySelector('.section-contacts__form');
const inputStudio = document.querySelectorAll('.section-studio__form-input');
const inputContacts = document.querySelectorAll(
  '.section-contacts__form-input'
);
const popupResponse = document.getElementById('popup-response');
const containerPopupResponse = document.getElementById(
  'container-popup-response'
);
const descPopupResponse = document.getElementById('content-response');
const closeBtnPopupResponse = document.getElementById('close-popup-response');

function responsePopup(text, inputs) {
  inputs.forEach((input) => (input.value = ''));
  elemVisible(popupResponse, 'popup-response__open', 'flex');
  descPopupResponse.textContent = text;
  closeBtnPopupResponse.addEventListener('click', () => {
    elemHidden(
      popupResponse,
      'popup-response__open',
      'popup-response__close',
      400
    );
  });
  document.body.addEventListener('click', (el) => {
    if (
      !formStudio.contains(el.target) &&
      !formContacts.contains(el.target) &&
      !containerPopupResponse.contains(el.target)
    ) {
      elemHidden(
        popupResponse,
        'popup-response__open',
        'popup-response__close',
        400
      );
    }
  });
}

// section-studio__form
new JustValidate('.section-studio__form', {
  rules: {
    mail: {
      required: true,
      email: true,
    },
  },
  colorWrong: '#F06666',
  submitHandler: function (form, values, ajax) {
    ajax({
      url: '/php/getPostValue.php',
      method: 'POST',
      data: values,
      async: true,
      callback: function () {
        responsePopup('Спасибо, мы вам перезвоним!', inputStudio);
      },
      error: function () {
        responsePopup('Ошибка отправки!', inputStudio);
      },
    });
  },
});

// section-contacts__form
new JustValidate('.section-contacts__form', {
  rules: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 20,
    },
    mail: {
      required: true,
      email: true,
    },
  },
  colorWrong: '#FF3030',
  submitHandler: function (form, values, ajax) {
    ajax({
      url: '/php/getPostValue.php',
      method: 'POST',
      data: values,
      async: true,
      callback: function () {
        responsePopup('Спасибо, мы вам перезвоним!', inputContacts);
      },
      error: function () {
        responsePopup('Ошибка отправки!', inputContacts);
      },
    });
  },
});

// section-contacts
const address = document.getElementById('address');
document.getElementById('btn-address').addEventListener('click', () => {
  elemHidden(
    address,
    'section-contacts__address-open',
    'section-contacts__address-close',
    400
  );
});

// section-contacts // map
ymaps.ready(init);
function init() {
  let myMap = new ymaps.Map('map', {
    center: [55.768997936413804, 37.63456955487825],
    zoom: 14,
  });
  let myPlacemark = new ymaps.Placemark(
    [55.76943340236499, 37.63965502317048],
    {},
    {
      iconLayout: 'default#image',
      iconImageHref: './img/favicon/favicon-32x32.png',
      iconImageSize: [20, 20],
      iconImageOffset: [-3, -42],
    }
  );
  myMap.geoObjects.add(myPlacemark);

  myPlacemark.events.add('click', function () {
    elemVisible(address, 'section-contacts__address-open', 'flex');
  });
}
