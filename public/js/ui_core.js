     /***************
     * ScrollMagic *
     ***************/
    const controller = new ScrollMagic.Controller();

    // Element transitions selectors
    const buildTransitionSelectors = function (arr) {
      let selector = '';
      for (let i = 0; i < arr.length; i++) {
        if (i > 0) {
          selector += ', ';
        }
        selector += '.' + arr[i] + '-in, ';
        selector += '.' + arr[i] + '-in-out, ';
        selector += '.' + arr[i] + '-out, ';
        selector += '.' + arr[i] + '-out-in';
      }
      return selector;
    };
    const transformTransitionSelector = buildTransitionSelectors('scale');
    const elTransitionSelector = transformTransitionSelector + ', ' + buildTransitionSelectors('fade');
    const elTransitionArray = elTransitionSelector.replace(/[.]+/g, '').split(', ');

    // keep track of all live tweens / scenes for resize event.
    const currentTransitions = {};
    let transitionId = 0;

    // Scroll Transition Plugin Methods
    const methods = {
      init: function () {
        return this.each(function () {
          var $this = $(this);

          // Don't init if child of staggered element transition
          if ($this.parent('.staggered-transition-wrapper').length &&
              hasClassInArray($this, elTransitionArray)) {
            return;
          }

          var dataId = $this.attr('data-id');
          if (!dataId) {
            transitionId++;
            dataId = transitionId;
            $this.attr('data-id', dataId);
          }

          // Shared variables
          var navbar = $('nav.navbar').first();
          var originalOffset = $this.offset().top;

          // Shared navbar functions
          var toggleSolid = function (e) {
            if (e.scrollDirection === 'FORWARD') {
              navbar.addClass('solid');
            } else {
              navbar.removeClass('solid');
            }
          };

          // Only initialize if past responsive threshold
          /**************
           * CIRCLE REVEAL *
           **************/
          if ($this.hasClass('circle-reveal-intro')) {
            // Read more
            $this.find('.nextp').off('click.nextp').on('click.nextp', function () {
              const index = $(this).closest('.circle-reveal-wrapper').index('.circle-reveal-wrapper') + 1;
              $('html, body').animate({scrollTop: originalOffset + (window.innerHeight * index)}, 800);
            });

            const tweenCircleTimeline = new TimelineMax();
            const tweenFadeTimeline = new TimelineMax();
            const len = $('.circle-reveal-wrapper').length;
            const backgroundLayer = $this.find('.background-layer');

            const getFullHeight = function () {
              return window.innerHeight * len;
            };

            $this.find('.circle-reveal-wrapper').each(function (i) {
              const wrapper = $(this);
              const header = wrapper.find('.header-wrapper');
              const circle = wrapper.find('.circle-background');
              wrapper.css('z-index', len - i);

              // build tween
              tweenCircleTimeline.to(circle, 1, {scale: 0, ease: Power2.easeInOut});
              tweenFadeTimeline
                  .to(header, .5, {opacity: 0, ease: Power2.easeInOut})
                  .to({}, .5, {});
            });
            // build scene
            const scene = new ScrollMagic.Scene({
              triggerElement: $this[0],
              triggerHook: 'onLeave',
              duration: getFullHeight
            })
                .setTween(tweenCircleTimeline)
                .setPin($this[0])
                .addTo(controller);
            const scene2 = new ScrollMagic.Scene({
              triggerElement: $this[0],
              triggerHook: 'onLeave',
              duration: getFullHeight
            })
                .setTween(tweenFadeTimeline)
                .on('end', function (e) {
                  toggleSolid(e);
                  if (e.scrollDirection === 'FORWARD') {
                    backgroundLayer.addClass('end');
                  } else {
                    backgroundLayer.removeClass('end');
                  }
                })
                .addTo(controller);

            // Add to list
            currentTransitions[dataId] = {
              type: 'circleReveal',
              sceneTweenPairs: [{scene: scene, tween: tweenCircleTimeline, isTimeline: true}, {
                scene: scene2,
                tween: tweenFadeTimeline,
                isTimeline: true
              }]
            };
          }

          currentTransitions[dataId].class = $this.attr('class');

          $(window)
              .off('resize.scrollTransition' + dataId)
              .on('resize.scrollTransition' + dataId, debouncedResize);
        });
      },
    };

    // Scroll Transition Plugin
    $.fn.scrollTransition = function(methodOrOptions) {
      if ( methods[methodOrOptions] ) {
        return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
      } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
        // Default to "init"
        return methods.init.apply( this, arguments );
      } else {
        $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.scrollTransition' );
      }
    }; // Plugin end

     // Init Scroll Transitions
    $('.circle-reveal-intro').scrollTransition();
