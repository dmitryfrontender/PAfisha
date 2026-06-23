window.addEventListener("DOMContentLoaded", function () {
  initBurgerMenu();
  initDropdown();
  initThemeSwitcher();
  initSearchAnimation();
  initCustomAutocomplete("searchInput", "autocompleteDropdown");
  initOpenPopup();
  initPasswordToggle();
  initSelects();
  initMobileFilter();
  initIonRangeSlider();
  initTabs();
  initCopyButtons();
  initSmileysBar();
  initAutoResizeTextarea();
  handleUserChatClick();
  initChatMenuToggle();
  initChatSmileysBar();
  initCommentForm();
  initRepliesToggle();
  initSubscriptionSlider();
  initFaqToggle();
  initMasonry();
  initTabsProfile();
  startCountdown();
  initMyProfileVideoSteps();
  initMyProfileBackgroundSteps();
  initMyProfileAvatarSteps();
});

function initBurgerMenu() {
  const burger = document.querySelector(".btn-menu");
  const body = document.body;

  burger.addEventListener("click", function () {
    body.classList.toggle("open-menu");
  });

  document.addEventListener("click", function (e) {
    if (!burger.contains(e.target) && !document.querySelector(".menu").contains(e.target) && body.classList.contains("open-menu")) {
      body.classList.remove("open-menu");
    }
  });
}

function initDropdown() {
  const dropdowns = document.querySelectorAll(".wrap-dropdown");

  dropdowns.forEach((wrap) => {
    const trigger = wrap.querySelector(".js-dropdown");
    const dropdown = wrap.querySelector(".dropdown");

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();

      // Close all other dropdowns
      dropdowns.forEach((item) => {
        if (item !== wrap) {
          item.classList.remove("open");
          const d = item.querySelector(".dropdown");
          d?.removeAttribute("style");
        }
      });

      wrap.classList.toggle("open");

      // Special fixed dropdown logic
      if (
        wrap.classList.contains("wrap-dropdown-fixed") &&
        window.innerWidth <= 1024 &&
        wrap.classList.contains("open")
      ) {
        const rect = trigger.getBoundingClientRect();
        dropdown.style.position = "fixed";
        dropdown.style.top = `${rect.bottom + 8}px`;
        dropdown.style.zIndex = "9999";
      } else {
        dropdown.removeAttribute("style");
      }
    });

    // Prevent inner clicks from closing dropdown
    wrap.addEventListener("click", (e) => e.stopPropagation());
  });

  // Close all dropdowns on document click
  document.addEventListener("click", () => {
    dropdowns.forEach((item) => {
      item.classList.remove("open");
      const d = item.querySelector(".dropdown");
      d?.removeAttribute("style");
    });
  });

  // Recalculate fixed position on resize
  window.addEventListener("resize", () => {
    dropdowns.forEach((wrap) => {
      if (
        wrap.classList.contains("wrap-dropdown-fixed") &&
        wrap.classList.contains("open") &&
        window.innerWidth <= 1024
      ) {
        const trigger = wrap.querySelector(".js-dropdown");
        const dropdown = wrap.querySelector(".dropdown");
        const rect = trigger.getBoundingClientRect();
        dropdown.style.position = "fixed";
        dropdown.style.top = `${rect.bottom + 8}px`;
        dropdown.style.zIndex = "9999";
      }
    });
  });
}

function initThemeSwitcher() {
  const buttons = document.querySelectorAll(".btn-theme");
  const body = document.body;

  // Get cookie value
  function getCookie(name) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );

    return match ? decodeURIComponent(match[2]) : null;
  }

  // Set cookie
  function setCookie(name, value, days = 365) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; expires=${date.toUTCString()}; path=/`;
  }

  // Apply theme class to body
  function applyTheme(theme) {
    body.classList.remove(
      "dark-theme",
      "light-theme",
      "auto-theme"
    );

    body.classList.add(`${theme}-theme`);
  }

  // Restore saved theme from cookies
  const savedTheme = getCookie("theme");

  if (savedTheme) {
    applyTheme(savedTheme);

    buttons.forEach((button) => {
      const text = button.textContent.trim().toLowerCase();

      if (
        (savedTheme === "dark" && text.includes("тём")) ||
        (savedTheme === "light" && text.includes("свет")) ||
        (savedTheme === "auto" && text.includes("авто"))
      ) {
        button.querySelector("input").checked = true;
      }
    });
  }

  // Theme switch click handlers
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const text = button.textContent.trim().toLowerCase();

      let theme = "auto";

      if (text.includes("тём")) {
        theme = "dark";
      } else if (text.includes("свет")) {
        theme = "light";
      }

      applyTheme(theme);
      setCookie("theme", theme);
    });
  });
}

function initSearchAnimation() {
  // Select elements
  const searchHolder = document.querySelector('.search-holder');
  const searchButton = document.querySelector('.js-search');
  const closeButton = document.querySelector('.close-search');
  const searchInput = document.querySelector('.input-search');

  if (!searchHolder || !searchButton || !closeButton || !searchInput) return;

  // Click on search button
  searchButton.addEventListener('click', function (e) {
    // If not open, prevent submit and open search
    if (!searchHolder.classList.contains('open')) {
      e.preventDefault();
      searchHolder.classList.add('open');
      setTimeout(() => {
        searchInput.focus();
      }, 400);
    }
    // Otherwise, form submits normally
  });

  // Click on close button
  closeButton.addEventListener('click', function () {
    searchHolder.classList.remove('open');
    searchInput.value = '';
  });

  // Optional: Close search with ESC key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && searchHolder.classList.contains('open')) {
      searchHolder.classList.remove('open');
    }
  });
}

function initCustomAutocomplete(inputId, dropdownId) {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);
  if (!input || !dropdown) return;

  const items = Array.from(dropdown.querySelectorAll(".autocomplete-item"));

  input.addEventListener("input", () => {
    const value = input.value.toLowerCase();
    let hasMatch = false;

    items.forEach(item => {
      item.style.display = "none";
      item.classList.remove("active-last");

      const links = Array.from(item.querySelectorAll("a"));
      links.forEach(a => {
        const span = a.querySelector(".js-text");
        if (!span) return;
        const originalText = span.getAttribute("data-original") || span.textContent;
        span.setAttribute("data-original", originalText);

        if (value && originalText.toLowerCase().includes(value)) {
          const regex = new RegExp(`(${value})`, "gi");
          span.innerHTML = originalText.replace(regex, '<strong class="bold">$1</strong>');
          item.style.display = "block";
          hasMatch = true;
        } else {
          span.textContent = originalText;
        }
      });
    });

    const visibleItems = items.filter(i => i.style.display === "block");
    if (visibleItems.length) {
      visibleItems[visibleItems.length - 1].classList.add("active-last");
    }

    let noMatch = dropdown.querySelector(".autocomplete-no-match");
    if (!hasMatch && value) {
      if (!noMatch) {
        const div = document.createElement("div");
        div.className = "autocomplete-no-match";
        div.textContent = "Ничего не найдено";
        dropdown.appendChild(div);
      }
    } else if (noMatch) {
      noMatch.remove();
    }

    dropdown.style.display = value ? "block" : "none";
  });

  document.addEventListener("click", e => {
    if (!dropdown.contains(e.target) && e.target !== input) {
      dropdown.style.display = "none";
    }
  });
}

function initOpenPopup() {
  const body = document.body;
  const popup = document.querySelector('.popup');
  const openBtn = document.querySelector('.btn-popup');
  const closeBtn = popup?.querySelector('.popup-close');

  if (!popup) return;

  // Function to open popup
  const openPopup = () => {
    popup.classList.add('open');
    body.classList.add('no-scroll');
  };

  // Function to close popup
  const closePopup = () => {
    popup.classList.remove('open');
    body.classList.remove('no-scroll');
  };

  // Keep scroll locked if popup already has "open" class
  if (popup.classList.contains('open')) {
    body.classList.add('no-scroll');
  }

  // Open popup
  if (openBtn) {
    openBtn.addEventListener('click', openPopup);
  }

  // Close popup by button
  if (closeBtn) {
    closeBtn.addEventListener('click', closePopup);
  }

  // Close popup by overlay click
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      closePopup();
    }
  });
}

function initPasswordToggle() {
  const passwordBlocks = document.querySelectorAll('.input-pass');

  passwordBlocks.forEach(block => {
    const input = block.querySelector('input');
    const btn = block.querySelector('.btn-view');
    const icon = btn.querySelector('svg');

    btn.addEventListener('click', () => {
      if (input.type === 'password') {
        input.type = 'text';
        // Меняем иконку на "видно"
        icon.classList.remove('icon-non-eye');
        icon.classList.add('icon-eye');
        // Обновляем <use>
        const use = icon.querySelector('use');
        if (use) use.setAttribute('xlink:href', '#icon-view');
      } else {
        input.type = 'password';
        // Меняем иконку на "скрыто"
        icon.classList.remove('icon-eye');
        icon.classList.add('icon-non-eye');
        // Обновляем <use>
        const use = icon.querySelector('use');
        if (use) use.setAttribute('xlink:href', '#icon-no-view');
      }
    });
  });
}

function initSelects() {
  $(".selectbox").select2({
    minimumResultsForSearch: 0,
    placeholder: "Выбрать"
  });

  $(".selectbox").on("select2:open", function () {
    $(".select2-container--open .select2-search__field").attr("placeholder", "Поиск");

    setTimeout(() => {
      document.querySelector(".select2-container--open .select2-search__field")
        ?.blur();
    }, 0);

    const waitForList = setInterval(() => {
      const resultsList = document.querySelector(".select2-results__options");

      if (resultsList) {
        const instance = OverlayScrollbars(resultsList);
        if (instance) instance.destroy();

        OverlayScrollbars(resultsList, {
          className: "os-theme-dark",
          scrollbars: {
            autoHide: "never",
            clickScrolling: true
          }
        });

        clearInterval(waitForList);
      }
    }, 50);
  });

  $("#country-id").select2({
    templateResult: function (option) {
      var $el = $(option.element),
        img = $el.data("img"),
        container = document.createElement("span");
      container.classList.add("select-img");

      if (img) {
        var imgEl = document.createElement("img");
        imgEl.src = img;
        container.appendChild(imgEl);
      }

      var textNode = document.createTextNode(option.text.trim());
      container.appendChild(textNode);

      return container;
    },

    templateSelection: function (option) {
      var img;

      if (option.element) {
        var $el = $(option.element);
        img = $el.data("img");
      } else {
        var $selected = $("#country-id option:selected");
        img = $selected.data("img");
      }

      var container = document.createElement("span");
      container.classList.add("select-img");

      if (img) {
        var imgEl = document.createElement("img");
        imgEl.src = img;
        container.appendChild(imgEl);
      }

      var textNode = document.createTextNode(option.text.trim());
      container.appendChild(textNode);

      return container;
    }
  });
}

function initMobileFilter() {
  const btn = document.querySelector('.btn-filter-mob');
  const sliderbar = document.querySelector('.sliderbar');

  if (!btn || !sliderbar) return;

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    sliderbar.classList.toggle('open');
  });

  sliderbar.addEventListener('click', function (e) {
    e.stopPropagation();
  });

  document.addEventListener('click', function (e) {
    if (!sliderbar.contains(e.target) && !btn.contains(e.target)) {
      sliderbar.classList.remove('open');
    }
  });
}

function initIonRangeSlider() {
  if ($(".js-range-slider").length) {
    $(".js-range-slider").ionRangeSlider({
      type: "double",
      min: 18,
      max: 100,
      from: 18,
      to: 45,
      grid: true,

      onStart: function (data) {
        $(".js-from").val(data.from);
        $(".js-to").val(data.to);
      },

      onChange: function (data) {
        $(".js-from").val(data.from);
        $(".js-to").val(data.to);
      }
    });
  }
}

function initTabs() {
  const buttons = document.querySelectorAll('.toggle-button');

  buttons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');

      // skip buttons without tab target
      if (!targetId || !targetId.startsWith('#')) return;

      const targetTab = document.querySelector(targetId);

      // remove active from all buttons and tabs
      document.querySelectorAll('.toggle-button').forEach(btn => {
        btn.classList.remove('active');
      });

      document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
      });

      // add active to current button and tab
      this.classList.add('active');

      if (targetTab) {
        targetTab.classList.add('active');
      }
    });
  });
}

function initCopyButtons() {
  document.querySelectorAll('.js-btn-copy').forEach(button => {
    button.addEventListener('click', function () {
      const input = this.parentElement.querySelector('.input');

      navigator.clipboard.writeText(input.value)
        .then(() => {
          const originalText = this.textContent;

          this.textContent = 'Скопировано';

          setTimeout(() => {
            this.textContent = originalText;
          }, 2000);
        })
        .catch(err => {
          console.error('Ошибка копирования: ', err);
        });
    });
  });
}

function initSmileysBar() {
  $(document).on("click", ".btn-smile", function (e) {
    e.stopPropagation();

    var holder = $(this).closest(".textarea-holder");
    holder.find(".smileys-bar").toggleClass("open");
  });

  $(document).on("click", function (e) {
    if (!$(e.target).closest(".textarea-holder").length) {
      $(".smileys-bar").removeClass("open");
    }
  });
}

function initAutoResizeTextarea() {
  const textarea = document.querySelector('.js-textarea');

  if (!textarea) return;

  const minHeight = 52;

  textarea.style.height = `${minHeight}px`;
  textarea.style.overflow = 'hidden';
  textarea.style.resize = 'none';
  textarea.style.transition = 'height .2s ease';

  const resize = () => {
    textarea.style.height = `${minHeight}px`;
    textarea.style.height = `${Math.max(textarea.scrollHeight, minHeight)}px`;
  };

  textarea.addEventListener('input', resize);
  textarea.addEventListener('focus', resize);

  resize();
}

function handleUserChatClick() {
  console.log("handleUserChatClick initialized");
  // Handle clicking on chat contacts in the new chat structure
  $(document).on("click", ".chat-contact", function (e) {
    console.log("chat-contact clicked");
    e.preventDefault();
    const $link = $(this);
    const $listItem = $link.closest(".chat-list__item");

    // Remove counter badge when clicked
    $link.find(".chat-contact__counter").remove();

    // Update active state
    $(".chat-list__item").removeClass("active");
    $listItem.addClass("active");

    // Update chat current info
    const name = $link.find(".chat-contact__name").text();
    const photoSrc = $link.find(".chat-contact__photo img").attr("src");
    const isOnline = $link.find(".chat-contact__online").length > 0;

    console.log("Name:", name, "Photo:", photoSrc, "Online:", isOnline);

    const $currentName = $(".chat-current__name");
    const $currentPhoto = $(".chat-current__photo img");
    const $currentStatus = $(".chat-current__status");
    const $profileName = $(".chat-profile__name");
    const $profileAvatar = $(".chat-profile__avatar");

    console.log("Elements found:", $currentName.length, $currentPhoto.length, $currentStatus.length, $profileName.length, $profileAvatar.length);

    if ($currentName.length) $currentName.text(name);
    if ($currentPhoto.length) $currentPhoto.attr("src", photoSrc);
    if ($currentStatus.length) $currentStatus.text(isOnline ? "Онлайн" : "Оффлайн");
    if ($profileName.length) $profileName.text(name);
    if ($profileAvatar.length) $profileAvatar.attr("src", photoSrc);
  });
}

function initChatMenuToggle() {
  console.log("initChatMenuToggle initialized");
  // Toggle chat menu on dots button click
  $(document).on("click", ".chat-dots", function (e) {
    console.log("chat-dots clicked");
    e.stopPropagation();
    const $menu = $(this).parent().next(".chat-menu");
    console.log("Menu found:", $menu.length);
    if ($menu.length) {
      $menu.toggle();
      console.log("Menu toggled, display:", $menu.css("display"));
    }
  });

  // Close menu when clicking outside
  $(document).on("click", function (e) {
    if (!$(e.target).closest(".chat-dots, .chat-menu").length) {
      $(".chat-menu").hide();
    }
  });

  // Prevent menu clicks from closing
  $(document).on("click", ".chat-menu", function (e) {
    e.stopPropagation();
  });

  // Show profile on first menu item click
  $(document).on("click", ".chat-menu__item:first-child", function (e) {
    e.preventDefault();
    $(".chat-profile").addClass("visible");
    $(".chat-menu").hide();
  });

  // Profile close button
  $(document).on("click", ".chat-profile__close", function () {
    console.log("chat-profile__close clicked");
    $(".chat-profile").removeClass("visible");
  });

  // Mobile: navigate to chat view when clicking a contact
  $(document).on("click", ".chat-contact", function (e) {
    if ($(window).width() <= 768) {
      e.preventDefault();
      $(".chat-sidebar").addClass("hidden");
      $(".chat-main").addClass("visible");
      $(".chat-wrapper").addClass("chat-open");
    }
  });

  // Mobile: back button to return to chat list
  $(document).on("click", ".chat-back", function () {
    $(".chat-main").removeClass("visible");
    $(".chat-sidebar").removeClass("hidden");
    $(".chat-wrapper").removeClass("chat-open");
  });
}

function initChatSmileysBar() {
  console.log("initChatSmileysBar initialized");
  // Toggle smileys bar on smile button click
  $(document).on("click", ".chat-compose__smile", function (e) {
    console.log("chat-compose__smile clicked");
    e.stopPropagation();
    const $bar = $(this).siblings(".chat-smileys-bar");
    console.log("Smileys bar found:", $bar.length);
    if ($bar.length) {
      $bar.toggle();
      console.log("Smileys bar toggled, display:", $bar.css("display"));
    }
  });

  // Close smileys bar when clicking outside
  $(document).on("click", function (e) {
    if (!$(e.target).closest(".chat-compose__smile, .chat-smileys-bar").length) {
      $(".chat-smileys-bar").hide();
    }
  });

  // Prevent smileys bar clicks from closing
  $(document).on("click", ".chat-smileys-bar", function (e) {
    e.stopPropagation();
  });

  // Insert emoji into input when clicked
  $(document).on("click", ".chat-smileys-bar img", function () {
    console.log("Emoji clicked");
    const emoji = $(this).attr("alt");
    const $input = $(this).closest(".chat-compose").find("input");
    console.log("Input found:", $input.length, "Emoji:", emoji);
    if ($input.length) {
      const currentValue = $input.val();
      $input.val(currentValue + emoji);
      $input.focus();
    }
  });
}

function handleUserChatClick() {
  console.log("handleUserChatClick initialized");
  // Handle clicking on chat contacts in the new chat structure
  $(document).on("click", ".chat-contact", function (e) {
    console.log("chat-contact clicked");
    e.preventDefault();
    const $link = $(this);
    const $listItem = $link.closest(".chat-list__item");

    // Remove counter badge when clicked
    $link.find(".chat-contact__counter").remove();

    // Update active state
    $(".chat-list__item").removeClass("active");
    $listItem.addClass("active");

    // Update chat current info
    const name = $link.find(".chat-contact__name").text();
    const photoSrc = $link.find(".chat-contact__photo img").attr("src");
    const isOnline = $link.find(".chat-contact__online").length > 0;

    console.log("Name:", name, "Photo:", photoSrc, "Online:", isOnline);

    const $currentName = $(".chat-current__name");
    const $currentPhoto = $(".chat-current__photo img");
    const $currentStatus = $(".chat-current__status");
    const $profileName = $(".chat-profile__name");
    const $profileAvatar = $(".chat-profile__avatar");

    console.log("Elements found:", $currentName.length, $currentPhoto.length, $currentStatus.length, $profileName.length, $profileAvatar.length);

    if ($currentName.length) $currentName.text(name);
    if ($currentPhoto.length) $currentPhoto.attr("src", photoSrc);
    if ($currentStatus.length) $currentStatus.text(isOnline ? "Онлайн" : "Оффлайн");
    if ($profileName.length) $profileName.text(name);
    if ($profileAvatar.length) $profileAvatar.attr("src", photoSrc);
  });
}

function initCommentForm() {
  $(".js-btn-comment").on("click", function () {
    var textareaHolder = $(".form-comments .textarea-holder");
    var actions = $(this).closest(".comments-actions");

    actions.after(textareaHolder);
  });
}

function initRepliesToggle() {
  $(".js-replies").on("click", function () {
    var colRight = $(this).parents(".cols-comments").children(".col-right");
    colRight.toggleClass("active");

    var showText = $(this).data("show");
    var hideText = $(this).data("hide");

    var svg = $(this).find("svg").prop("outerHTML");

    $(this).html(
      (colRight.hasClass("active") ? hideText : showText) + " " + svg
    );
  });
}

function initSubscriptionSlider() {
  let subscriptionSwiper = null;

  function toggleSlider() {
    if (!$('.subscription-slider').length) {
      return;
    }

    if ($(window).width() <= 1024) {

      if (!subscriptionSwiper) {
        subscriptionSwiper = new Swiper('.subscription-slider', {
          initialSlide: 1,
          centeredSlides: true,
          spaceBetween: 18,
          speed: 600,
          grabCursor: true,

          slidesPerView: 1.2,

          breakpoints: {
            641: {
              slidesPerView: 1.9
            }
          },

          pagination: {
            el: '.subscription-slider-pagination',
            clickable: true
          }
        });
      }

    } else {

      if (subscriptionSwiper) {
        subscriptionSwiper.destroy(true, true);
        subscriptionSwiper = null;

        $('.subscription-slider .swiper-wrapper').removeAttr('style');
        $('.subscription-slider .swiper-slide').removeAttr('style');
      }

    }
  }

  toggleSlider();

  let resizeTimer;

  $(window).on('resize', function () {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(function () {
      toggleSlider();
    }, 100);
  });
}

function initFaqToggle() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const toggle = item.querySelector('.faq-toggle');

    if (toggle) {
      toggle.addEventListener('click', () => {
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });

        item.classList.toggle('active');
      });
    }
  });
}

function initMasonry() {
  const grid = document.querySelector('.grid-masonry');

  if (!grid) return;

  imagesLoaded(grid, function () {
    new Masonry(grid, {
      itemSelector: '.grid-item',
      columnWidth: '.grid-sizer',
      percentPosition: true,
      gutter: 8
    });
  });
}

function initTabsProfile(selector = '.tabs-setting') {
  $(selector).each(function () {
    const $tabs = $(this);
    const $buttons = $tabs.find('.tab-btn');
    const $contents = $tabs.find('.tabs-content');

    $buttons.on('click', function () {

      const index = $(this).index();

      $buttons.removeClass('active');
      $(this).addClass('active');

      $contents.removeClass('active');
      $contents.eq(index).addClass('active');

    });

  });
}

function startCountdown(minutes = 15) {
  const element = document.querySelector('.timer');
  if (!element) return;

  let secondsLeft = minutes * 60;

  function update() {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;

    element.textContent =
      `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (secondsLeft <= 0) {
      clearInterval(interval);
      element.textContent = 'Ссылка истекла';
      return;
    }

    secondsLeft--;
  }

  update();
  const interval = setInterval(update, 1000);
}

function initMyProfileVideoSteps() {

  const popupVideo = document.querySelector('.my-profile-popup-1');

  if (!popupVideo) return;

  popupVideo.addEventListener('click', (e) => {
    if (e.target.closest('.close-btn')) {
      popupVideo.classList.remove('open');
      document.body.classList.remove('no-scroll');
    }
  });

  const wizardContent = {
    1: {
      title: 'Загрузка видео',
      subtitle: 'Выберите видео для вашей новой публикации'
    },
    2: {
      title: 'Загрузка видео',
      subtitle: 'Выбор обложки видео'
    },
    3: {
      title: 'Загрузка видео',
      subtitle: 'Укажите название и описание публикации'
    }
  };

  class UploadWizard {

    constructor() {

      this.popup = popupVideo;
      this.currentStep = 1;

      this.steps = this.popup.querySelectorAll('.popup-step');

      this.title =
        this.popup.querySelector('.header-text h3');

      this.subtitle =
        this.popup.querySelector('.header-text p');

      this.render();
    }

    render() {

      this.steps.forEach(step => {
        step.classList.remove('is-active');
      });

      const activeStep =
        this.popup.querySelector(
          `[data-step="${this.currentStep}"]`
        );

      activeStep?.classList.add('is-active');

      this.title.textContent =
        wizardContent[this.currentStep].title;

      this.subtitle.textContent =
        wizardContent[this.currentStep].subtitle;

      if (this.currentStep === 2) {
        requestAnimationFrame(() => {
          initCovers();
          swiperThumbs?.update();
          swiperMain?.update();
        });
      }
    }

    next() {
      if (this.currentStep < 3) {
        this.currentStep++;
        this.render();
      }
    }

    prev() {
      if (this.currentStep > 1) {
        this.currentStep--;
        this.render();
      }
    }
  }

  const wizard = new UploadWizard();

  popupVideo.addEventListener('click', (e) => {

    if (e.target.closest('.next-btn')) {
      console.log('Wizard next');

      wizard.next();
    }

    if (e.target.closest('.prev-btn')) {
      console.log('Wizard prev');

      wizard.prev();
    }

  });

  const thumbsElement = document.querySelector('.thumbs-slider');
  let swiperThumbs = null;
  let swiperMain = null;

  function initCovers() {
    const isDesktop = window.innerWidth >= 768;

    if (isDesktop) {
      if (swiperMain && !swiperThumbs) {
        swiperMain.destroy(true, true);
        swiperMain = null;
      }

      if (!swiperThumbs) {
        swiperThumbs = new Swiper('.thumbs-slider', {
          slidesPerView: 5,
          grid: {
            rows: 2,
            fill: 'row'
          },
          allowTouchMove: false,
          watchSlidesProgress: true,
        });

        swiperMain = new Swiper('.main-preview', {
          spaceBetween: 0,
          allowTouchMove: false,
          thumbs: {
            swiper: swiperThumbs,
          },
        });
      }

      return;
    }

    if (swiperThumbs) {
      swiperMain?.destroy(true, true);
      swiperThumbs.destroy(true, true);
      swiperThumbs = null;
      swiperMain = null;
    }

    if (!swiperMain) {
      swiperMain = new Swiper('.main-preview', {
      });
    }

    initMobileClicks();
  }

  function initMobileClicks() {
    document.querySelectorAll(
      '.thumbs-slider .swiper-slide:not(.upload-btn-slide)'
    );

    if (!thumbs.length) return;

    if (!document.querySelector('.thumbs-slider .swiper-slide-thumb-active')) {
      thumbs[0].classList.add('swiper-slide-thumb-active');
    }

    thumbs.forEach((thumb, index) => {
      thumb.onclick = () => {
        thumbs.forEach(t => t.classList.remove('swiper-slide-thumb-active'));
        thumb.classList.add('swiper-slide-thumb-active');

        swiperMain?.slideTo(index);
      };
    });
  }

  window.addEventListener('resize', () => {
    if (wizard.currentStep === 2) {
      initCovers();
      swiperThumbs?.update();
      swiperMain?.update();
    }
  });
}

function initMyProfileBackgroundSteps() {

  const popupBackground = document.querySelector('.my-profile-popup-2');

  if (!popupBackground) return;

  popupBackground.addEventListener('click', (e) => {
    if (e.target.closest('.close-btn')) {
      popupBackground.classList.remove('open');
      document.body.classList.remove('no-scroll');
    }
  });

  const wizardContent = {
    1: {
      title: 'Загрузка обложки',
      subtitle: 'Выберите файл для вашей новой обложки'
    },
    2: {
      title: 'Кадрування обложки',
      subtitle: 'Выберите видимую область банера'
    }
  };

  class UploadWizard {

    constructor() {

      this.popup = popupBackground;
      this.currentStep = 1;

      this.image = null;
      this.cropper = null;

      this.steps = this.popup.querySelectorAll('.popup-step');

      this.title = this.popup.querySelector('.header-text h3');
      this.subtitle = this.popup.querySelector('.header-text p');

      this.imageEl = this.popup.querySelector('.preview-image');

      this.render();
    }

    render() {

      this.steps.forEach(step => {
        step.classList.remove('is-active');
      });

      const activeStep =
        this.popup.querySelector(`[data-step="${this.currentStep}"]`);

      activeStep?.classList.add('is-active');

      this.title.textContent = wizardContent[this.currentStep].title;
      this.subtitle.textContent = wizardContent[this.currentStep].subtitle;

      // STEP 2 → init cropper
      if (this.currentStep === 2) {
        this.initCropper();
      }

      // destroy cropper when leaving step 2
      if (this.currentStep !== 2 && this.cropper) {
        this.cropper.destroy();
        this.cropper = null;
      }
    }

    /**
     * STEP 1 → load image
     */
    setImage(file) {

      const reader = new FileReader();

      reader.onload = (e) => {

        this.image = e.target.result;

        if (this.imageEl) {
          this.imageEl.src = this.image;
        }

        this.next();
      };

      reader.readAsDataURL(file);
    }

    /**
     * STEP 2 → Cropper.js init (CDN MODE)
     */
    initCropper() {

  if (!this.imageEl || this.cropper) return;

  const CropperCtor =
    window.Cropper?.default || window.Cropper;

  if (!CropperCtor) {
    console.error('Cropper is not loaded properly', window.Cropper);
    return;
  }

  this.cropper = new CropperCtor(this.imageEl, {
    viewMode: 1,
    dragMode: 'move',
    aspectRatio: 3 / 1,
    autoCropArea: 1,
    cropBoxResizable: true,
    cropBoxMovable: true,
    guides: false,
    background: false,
    responsive: true
  });
}

    /**
     * FINAL RESULT (upload ready)
     */
    getCropData() {

      if (!this.cropper) return null;

      const canvas = this.cropper.getCroppedCanvas({
        width: 1200,
        height: 400
      });

      return {
        image: canvas.toDataURL('image/jpeg', 0.9),
        blob: this.dataURLtoBlob(canvas.toDataURL('image/jpeg', 0.9))
      };
    }

    /**
     * helper: base64 → blob
     */
    dataURLtoBlob(dataURL) {

      const arr = dataURL.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);

      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new Blob([u8arr], { type: mime });
    }

    next() {
      if (this.currentStep < 2) {
        this.currentStep++;
        this.render();
      }
    }

    prev() {
      if (this.currentStep > 1) {
        this.currentStep--;
        this.render();
      }
    }
  }

  const wizard = new UploadWizard();

  popupBackground.addEventListener('click', (e) => {

    // file upload
    const fileInput = e.target.closest('input[type="file"]');

    if (fileInput?.files?.length) {
      wizard.setImage(fileInput.files[0]);
    }

    if (e.target.closest('.next-btn')) {
      wizard.next();
    }

    if (e.target.closest('.prev-btn')) {
      wizard.prev();
    }

    if (e.target.closest('.submit-btn')) {
      console.log('CROP RESULT:', wizard.getCropData());
    }

  });
}

function initMyProfileAvatarSteps() {

  const popupAvatar = document.querySelector('.my-profile-popup-3');

  if (!popupAvatar) return;

  popupAvatar.addEventListener('click', (e) => {
    if (e.target.closest('.close-btn')) {
      popupAvatar.classList.remove('open');
      document.body.classList.remove('no-scroll');
    }
  });

  const wizardContent = {
    1: {
      title: 'Загрузка нового аватара',
      subtitle: 'Выберите файл для вашей новой аватарки'
    },
    2: {
      title: 'Загрузка нового аватара',
      subtitle: 'Выберите файл для вашей новой аватарки'
    }
  };

  class UploadWizard {

    constructor() {

      this.popup = popupAvatar;
      this.currentStep = 1;

      this.image = null;
      this.cropper = null;

      this.steps = this.popup.querySelectorAll('.popup-step');

      this.title = this.popup.querySelector('.header-text h3');
      this.subtitle = this.popup.querySelector('.header-text p');

      this.imageEl = this.popup.querySelector('.preview-image');

      this.render();
    }

    render() {

      this.steps.forEach(step => {
        step.classList.remove('is-active');
      });

      const activeStep =
        this.popup.querySelector(`[data-step="${this.currentStep}"]`);

      activeStep?.classList.add('is-active');

      this.title.textContent = wizardContent[this.currentStep].title;
      this.subtitle.textContent = wizardContent[this.currentStep].subtitle;

      // STEP 2 → init cropper
      if (this.currentStep === 2) {
        this.initCropper();
      }

      // destroy cropper when leaving step 2
      if (this.currentStep !== 2 && this.cropper) {
        this.cropper.destroy();
        this.cropper = null;
      }
    }

    /**
     * STEP 1 → load image
     */
    setImage(file) {

      const reader = new FileReader();

      reader.onload = (e) => {

        this.image = e.target.result;

        if (this.imageEl) {
          this.imageEl.src = this.image;
        }

        this.next();
      };

      reader.readAsDataURL(file);
    }

    /**
     * STEP 2 → Cropper.js init (CDN MODE)
     */
    initCropper() {

  if (!this.imageEl || this.cropper) return;

  const CropperCtor =
    window.Cropper?.default || window.Cropper;

  if (!CropperCtor) {
    console.error('Cropper is not loaded properly', window.Cropper);
    return;
  }

  this.cropper = new CropperCtor(this.imageEl, {
    viewMode: 1,
    dragMode: 'move',
    aspectRatio: 3 / 1,
    autoCropArea: 1,
    cropBoxResizable: true,
    cropBoxMovable: true,
    guides: false,
    background: false,
    responsive: true
  });
}

    /**
     * FINAL RESULT (upload ready)
     */
    getCropData() {

      if (!this.cropper) return null;

      const canvas = this.cropper.getCroppedCanvas({
        width: 1200,
        height: 400
      });

      return {
        image: canvas.toDataURL('image/jpeg', 0.9),
        blob: this.dataURLtoBlob(canvas.toDataURL('image/jpeg', 0.9))
      };
    }

    /**
     * helper: base64 → blob
     */
    dataURLtoBlob(dataURL) {

      const arr = dataURL.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);

      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new Blob([u8arr], { type: mime });
    }

    next() {
      if (this.currentStep < 2) {
        this.currentStep++;
        this.render();
      }
    }

    prev() {
      if (this.currentStep > 1) {
        this.currentStep--;
        this.render();
      }
    }
  }

  const wizard = new UploadWizard();

  popupAvatar.addEventListener('click', (e) => {

    // file upload
    const fileInput = e.target.closest('input[type="file"]');

    if (fileInput?.files?.length) {
      wizard.setImage(fileInput.files[0]);
    }

    if (e.target.closest('.next-btn')) {
      wizard.next();
    }

    if (e.target.closest('.prev-btn')) {
      wizard.prev();
    }

    if (e.target.closest('.submit-btn')) {
      console.log('CROP RESULT:', wizard.getCropData());
    }

  });
}