window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    // Responsive carousel options
    var isMobile = window.innerWidth <= 768;
    var options = {
		slidesToScroll: 1,
		slidesToShow: isMobile ? 1 : 3,
		loop: true,
		infinite: true,
		autoplay: false,
		autoplaySpeed: 3000,
    }

	// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
    var mainCarousel = carousels.length > 0 ? carousels[0] : null;

    // Manual carousel control for mobile
    if (isMobile && mainCarousel) {
        var currentIndex = 0;
        var slides = document.querySelectorAll('#results-carousel .item');
        var totalSlides = slides.length;

        console.log('Manual mobile carousel initialized. Total slides:', totalSlides);

        function showSlide(index) {
            // Use Bulma Carousel's internal state if possible
            try {
                // Try to use the carousel's show method
                if (mainCarousel.state && mainCarousel.state.next !== undefined) {
                    var targetIndex = index % totalSlides;
                    mainCarousel.state.next = targetIndex;

                    // Force a re-render by calling the carousel's internal methods
                    if (typeof mainCarousel._show === 'function') {
                        mainCarousel._show(targetIndex);
                    } else if (typeof mainCarousel.show === 'function') {
                        mainCarousel.show(targetIndex);
                    }
                }
                console.log('Moved to slide:', index);
            } catch(e) {
                console.error('Error moving carousel:', e);
            }
        }

        // Wire up custom navigation buttons
        var customPrevBtn = document.getElementById('custom-prev');
        var customNextBtn = document.getElementById('custom-next');

        if (customPrevBtn && customNextBtn) {
            function handlePrev(e) {
                e.preventDefault();
                e.stopPropagation();
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                console.log('PREV - Moving to index:', currentIndex);

                // Try multiple methods
                if (mainCarousel.previous && typeof mainCarousel.previous === 'function') {
                    mainCarousel.previous();
                } else {
                    showSlide(currentIndex);
                }
            }

            function handleNext(e) {
                e.preventDefault();
                e.stopPropagation();
                currentIndex = (currentIndex + 1) % totalSlides;
                console.log('NEXT - Moving to index:', currentIndex);

                // Try multiple methods
                if (mainCarousel.next && typeof mainCarousel.next === 'function') {
                    mainCarousel.next();
                } else {
                    showSlide(currentIndex);
                }
            }

            customPrevBtn.addEventListener('click', handlePrev);
            customPrevBtn.addEventListener('touchend', handlePrev);
            customNextBtn.addEventListener('click', handleNext);
            customNextBtn.addEventListener('touchend', handleNext);

            console.log('Custom buttons wired up!');
            console.log('Carousel object:', mainCarousel);
            console.log('Available methods:', Object.keys(mainCarousel));
        }
    }

    // Re-initialize carousel on window resize
    var resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            var newIsMobile = window.innerWidth <= 768;
            if (newIsMobile !== isMobile) {
                isMobile = newIsMobile;
                options.slidesToShow = isMobile ? 1 : 3;
                carousels = bulmaCarousel.attach('.carousel', options);
                location.reload(); // Reload to reinitialize properly
            }
        }, 250);
    });

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

})
