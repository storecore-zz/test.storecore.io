// $(window).on('load', documentReady);
$(document).ready(function() {
  documentReady();
});

var thePath;

function documentReady() {
  thePath = window.location.pathname;
  setSideMenu();

  // Dropdown functionality
  $('html').click(function() {
      $('.dropdown').removeClass('dropdown__active');
  });

  $('.dropdown').click(function (e) {
    $(this).toggleClass('dropdown__active');
    e.stopPropagation();
  });

  $('#versions-dropdown .dropdown__item').click(function(e) {
    var goToUrl = $(this).data('url');
    console.log('goToUrl: ', goToUrl);
    window.location = goToUrl;
  })

  // Set side menu
  function setSideMenu() {
    var firstPartUrl = thePath.split('/')[1];
    $('.side-menu-list').each(function () {
      var parentUrl = $(this).data('parenturl');
      var firstPartUrlMenu = parentUrl.split('/')[1];
      if (firstPartUrl === firstPartUrlMenu) {
        $(this).css('display', 'block');
      }
    });

    $('.top-menu-item').each(function () {
      var parentUrl = $(this).data('parenturl');
      var firstPartUrlMenu = parentUrl.split('/')[1];
      $(this).removeClass('active');
      if (firstPartUrl === firstPartUrlMenu) {
        $(this).addClass('active');
      }
    });

    var urlInfo = getInfoFromUrl(window.location.pathname);
    console.log(urlInfo);

    if (urlInfo) {
      $('.side-menu__sub__item__text').each(function (element) {
        var elementUrlInfo = getInfoFromUrl($(this).data('url'));
        console.log(elementUrlInfo);
        var isCurrent = '';

        if (elementUrlInfo.version === urlInfo.version) {
          console.log(urlInfo.version);
          isCurrent = 'selected';
          $(this).css('display', 'block');
        }

        if (elementUrlInfo.pageName === urlInfo.pageName) {
          // $('#versions-dropdown .dropdown__items').append('<option value="' + $(this).attr('href') + '"'+isCurrent+'>' + elementUrlInfo.version + '</option>')
          $('#versions-dropdown .dropdown__items').append('<div data-url="' +$(this).attr('href')+ '" class="dropdown__item '+ isCurrent +'"><i class="fa fa-check" aria-hidden="true"></i>' + elementUrlInfo.version + '</div>');
          $('#versions-dropdown .dropdown__selected').html(urlInfo.version);
        }
      });

      $('#versions-dropdown').css('display', 'block');
    } else {
      $('.side-menu__sub__item__text').each(function () {
        $(this).css('display', 'block');
      });
    }


    function getInfoFromUrl(url) {
      var splittedUrl = url.split('/').slice(1,-1);
      var urlInfo =  {
        pageName: splittedUrl[splittedUrl.length-1],
        version: splittedUrl[splittedUrl.length-2]
      }

      return urlInfo && urlInfo.version && (((urlInfo.version.substring(0,1) === 'v') && !isNaN(urlInfo.version.substring(1,2))) || urlInfo.version === 'katana') ? urlInfo : false;
    }
  }
}
