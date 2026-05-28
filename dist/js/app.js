/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "burgerMenu": () => (/* binding */ burgerMenu),
/* harmony export */   "initSubmenu": () => (/* binding */ initSubmenu),
/* harmony export */   "phoneMask": () => (/* binding */ phoneMask),
/* harmony export */   "popups": () => (/* binding */ popups)
/* harmony export */ });
/*---------------------------------------------------------------------------
Маска телефона
---------------------------------------------------------------------------*/
function phoneMask() {
   document.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll("input.tel-mask").forEach((input) => {
         let keyCode;
         function mask(event) {
            event.keyCode && (keyCode = event.keyCode);
            let pos = this.selectionStart;
            if (pos < 3) event.preventDefault();
            let matrix = "+7 (___) ___ __ __",
               i = 0,
               val = this.value.replace(/\D/g, ""),
               new_value = matrix.replace(/[_\d]/g, (a) =>
                  i < val.length ? val.charAt(i++) : a
               );
            i = new_value.indexOf("_");
            if (i !== -1) {
               i < 5 && (i = 3);
               new_value = new_value.slice(0, i);
            }
            let reg = matrix
               .substr(0, this.value.length)
               .replace(/_+/g, (a) => `\\d{1,${a.length}}`)
               .replace(/[+()]/g, "\\$&");
            reg = new RegExp("^" + reg + "$");
            if (!reg.test(this.value) || this.value.length < 5 || (keyCode > 47 && keyCode < 58)) {
               this.value = new_value;
            }
            if (event.type === "blur" && this.value.length < 5) this.value = "";
         }

         input.addEventListener("input", mask);
         input.addEventListener("focus", mask);
         input.addEventListener("blur", mask);
         input.addEventListener("keydown", mask);
      });
   });
}


/*---------------------------------------------------------------------------
Бургер меню
---------------------------------------------------------------------------*/
function burgerMenu() {
   document.addEventListener("DOMContentLoaded", () => {
      const menuIcon = document.querySelector(".menu__icon");
      const menuBody = document.querySelector(".menu__body");
      const body = document.body;
      const menuBodyClose = document.querySelector(".menu__body-close");
      const animationDuration = 500;

      if (!menuIcon || !menuBody) return;

      const closeMenu = () => {
         menuIcon.classList.remove("active");
         menuBody.classList.remove("active");
         body.classList.remove("no-scroll");
      };

      menuIcon.addEventListener("click", () => {
         menuIcon.classList.toggle("active");
         menuBody.classList.toggle("active");
         body.classList.toggle("no-scroll");
      });

      menuBody.addEventListener("click", (e) => {
         const link = e.target.closest("a");

         if (!link) return;

         // Не закрываем меню для toggle submenu
         if (link.classList.contains("menu__toggle")) {
            e.preventDefault();
            return;
         }

         e.preventDefault();

         closeMenu();

         setTimeout(() => {
            window.location.href = link.href;
         }, animationDuration);
      });

      if (menuBodyClose) menuBodyClose.addEventListener("click", closeMenu);

      document.addEventListener("click", (e) => {
         if (!menuBody.contains(e.target) && !menuIcon.contains(e.target)) closeMenu();
      });
   });
}

/*==========================================================================
Submenu
============================================================================*/
function initSubmenu() {
   document.addEventListener('DOMContentLoaded', () => {
      const items = document.querySelectorAll('.has-submenu');

      if (!items.length) return;

      let submenuJustOpened = false;

      const isTouchDevice = () =>
         window.matchMedia('(max-width: 1249px)').matches;

      items.forEach(item => {
         const toggle = item.querySelector('.menu__toggle');
         const submenu = item.querySelector('.submenu');

         if (!toggle || !submenu) return;

         toggle.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();

            if (isTouchDevice()) {
               submenuJustOpened = true;

               submenuJustOpened = false;

               const isActive = item.classList.contains('active');

               items.forEach(el => {
                  el.classList.remove('active');

                  const sub = el.querySelector('.submenu');

                  if (sub) {
                     sub.classList.remove('show');
                  }
               });

               if (!isActive) {
                  item.classList.add('active');
                  submenu.classList.add('show');
               }
            }
         });

         // Desktop hover
         if (!isTouchDevice()) {
            item.addEventListener('mouseenter', () => {
               item.classList.add('active');
               submenu.classList.add('show');
            });

            item.addEventListener('mouseleave', () => {
               item.classList.remove('active');
               submenu.classList.remove('show');
            });
         }
      });

      // Блокируем "пробитый" клик
      document.addEventListener(
         'click',
         e => {
            if (submenuJustOpened) {
               e.preventDefault();
               e.stopPropagation();
            }
         },
         true
      );

      // Закрытие submenu
      document.addEventListener('click', e => {
         if (!e.target.closest('.has-submenu')) {
            items.forEach(item => {
               item.classList.remove('active');

               const submenu = item.querySelector('.submenu');

               if (submenu) {
                  submenu.classList.remove('show');
               }
            });
         }
      });
   });
}



/*---------------------------------------------------------------------------
Попапы
---------------------------------------------------------------------------*/
function popups() {
   if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initPopups);
   } else {
      initPopups();
   }
}

function initPopups() {
   const POPUP_SELECTOR = ".popup";
   const OPEN_BTN_SELECTOR = ".open-popup";
   const ACTIVE_CLASS = "show";
   const BODY_ACTIVE_CLASS = "popup-opened";

   let activeButton = null;

   // =========================
   // OPEN / SWITCH POPUPS
   // =========================
   document.addEventListener("click", (e) => {
      const button = e.target.closest(OPEN_BTN_SELECTOR);
      if (!button) return;

      e.preventDefault();
      e.stopPropagation();

      const popupId = button.dataset.popup;
      if (!popupId) return;

      const popup = document.getElementById(popupId);
      if (!popup) return;

      const currentPopup = document.querySelector(
         `${POPUP_SELECTOR}.${ACTIVE_CLASS}`
      );

      if (activeButton === button && currentPopup) {
         closePopup(currentPopup);
         return;
      }

      if (currentPopup) {
         closePopup(currentPopup);
      }

      openPopup(popup, button);
   });

   // =========================
   // CLOSE POPUPS (overlay / close btn / outside)
   // =========================
   document.addEventListener("click", (e) => {
      const openPopupEl = document.querySelector(
         `${POPUP_SELECTOR}.${ACTIVE_CLASS}`
      );
      if (!openPopupEl) return;

      if (e.target.closest(OPEN_BTN_SELECTOR)) return;

      const isCloseBtn = e.target.closest(".popup__close");
      const isInsideBody = e.target.closest(".popup__body");

      if (isCloseBtn || !isInsideBody) {
         closePopup(openPopupEl);
      }
   });

   // =========================
   // ESC KEY
   // =========================
   document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;

      const openPopupEl = document.querySelector(
         `${POPUP_SELECTOR}.${ACTIVE_CLASS}`
      );
      if (!openPopupEl) return;

      closePopup(openPopupEl);
   });

   // =========================
   // HELPERS
   // =========================
   function openPopup(popup, button) {
      popup.classList.add(ACTIVE_CLASS);
      document.body.classList.add(BODY_ACTIVE_CLASS);

      if (button) {
         button.classList.add("active");
         activeButton = button;
      }
   }

   function closePopup(popup) {
      popup.classList.remove(ACTIVE_CLASS);
      document.body.classList.remove(BODY_ACTIVE_CLASS);

      if (activeButton) {
         activeButton.classList.remove("active");
         activeButton = null;
      }
   }
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_functions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);


_modules_functions_js__WEBPACK_IMPORTED_MODULE_0__.burgerMenu();
_modules_functions_js__WEBPACK_IMPORTED_MODULE_0__.initSubmenu();
_modules_functions_js__WEBPACK_IMPORTED_MODULE_0__.popups();
_modules_functions_js__WEBPACK_IMPORTED_MODULE_0__.phoneMask();

/*==========================================================================
Header fx
============================================================================*/
const header = document.querySelector('.header');

function toggleHeaderClass() {
   header.classList.toggle('fx', window.scrollY > 0);
}

toggleHeaderClass();

window.addEventListener('scroll', toggleHeaderClass);

/*==========================================================================
Phone field
============================================================================*/
function initPhoneField() {
   const phoneFields = document.querySelectorAll('.phone-field');

   phoneFields.forEach(phoneField => {
      const btn = phoneField.querySelector('.phone-field__btn');
      const list = phoneField.querySelector('.phone-field__list');
      const items = phoneField.querySelectorAll('.phone-field__list-item');
      const input = phoneField.querySelector('.phone-field__input');
      const btnFlag = btn.querySelector('.phone-field__flag');
      const btnCode = btn.querySelector('.phone-field__code');

      btn.addEventListener('click', () => {
         btn.classList.toggle('active');
         list.classList.toggle('show');
      });

      items.forEach(item => {
         item.addEventListener('click', () => {
            const itemFlag = item.querySelector('.phone-field__flag').innerHTML;
            const itemCode = item.querySelector('.phone-field__code').textContent;

            btnFlag.innerHTML = itemFlag;
            btnCode.textContent = itemCode;
            btn.classList.remove('active');
            list.classList.remove('show');
            input.focus();
         });
      });

      document.addEventListener('click', e => {
         if (!phoneField.contains(e.target)) {
            btn.classList.remove('active');
            list.classList.remove('show');
         }
      });
   });
}

/*==========================================================================
Dropdown
============================================================================*/
function initDropdowns() {
   const dropdowns = document.querySelectorAll('.cb-dropdown');

   dropdowns.forEach(dropdown => {
      const button = dropdown.querySelector('.cb-dropdown__button');
      const buttonText = dropdown.querySelector('.cb-dropdown__button-text');
      const list = dropdown.querySelector('.cb-dropdown__menu');
      const items = dropdown.querySelectorAll('.cb-dropdown__item');

      button.addEventListener('click', () => {
         button.classList.toggle('active');
         list.classList.toggle('show');
      });

      items.forEach(item => {
         item.addEventListener('click', () => {
            const text = item.textContent.trim();

            buttonText.textContent = text;

            button.classList.remove('active');
            list.classList.remove('show');
         });
      });

      document.addEventListener('click', e => {
         if (!dropdown.contains(e.target)) {
            button.classList.remove('active');
            list.classList.remove('show');
         }
      });
   });
}

/*==========================================================================
FAQ
============================================================================*/
function initFaqAccordion() {
   const faqItems = document.querySelectorAll('.faq__item');
   if (!faqItems.length) return;

   faqItems.forEach(item => {
      const question = item.querySelector('.faq__question');
      const answer = item.querySelector('.faq__answer');

      if (!question || !answer || item.dataset.inited) return;

      question.addEventListener('click', () => {
         const isActive = item.classList.contains('active');

         if (isActive) {
            item.classList.remove('active');
            answer.style.maxHeight = null;
         } else {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
         }
      });

      item.dataset.inited = 'true';
   });
}
/*==========================================================================
Init
============================================================================*/
document.addEventListener('DOMContentLoaded', () => {
   initDropdowns();
   initPhoneField();
   initFaqAccordion();
}) 
})();

/******/ })()
;