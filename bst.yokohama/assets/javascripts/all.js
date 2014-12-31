/**
 * jQuery bxSlider v3.0
 * http://bxslider.com
 *
 * Copyright 2011, Steven Wanderski
 * http://bxcreative.com
 *
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 */


(function($){
	
	$.fn.bxSlider = function(options){		
				
		var defaults = {
			mode: 'horizontal',									// 'horizontal', 'vertical', 'fade'
			childSelector: '',  					      // jQuery selector - elements to be used as slides
			infiniteLoop: true,									// true, false - display first slide after last
			hideControlOnEnd: false,						// true, false - if true, will hide 'next' control on last slide and 'prev' control on first
			controls: true,											// true, false - previous and next controls
			speed: 500,													// integer - in ms, duration of time slide transitions will occupy
			easing: 'swing',                    // used with jquery.easing.1.3.js - see http://gsgd.co.uk/sandbox/jquery/easing/ for available options
			pager: false,												// true / false - display a pager
			pagerSelector: null,								// jQuery selector - element to contain the pager. ex: '#pager'
			pagerType: 'full',									// 'full', 'short' - if 'full' pager displays 1,2,3... if 'short' pager displays 1 / 4
			pagerLocation: 'bottom',						// 'bottom', 'top' - location of pager
			pagerShortSeparator: '/',						// string - ex: 'of' pager would display 1 of 4
			pagerActiveClass: 'pager-active',		// string - classname attached to the active pager link
			nextText: 'next',										// string - text displayed for 'next' control
			nextImage: '',											// string - filepath of image used for 'next' control. ex: 'images/next.jpg'
			nextSelector: null,									// jQuery selector - element to contain the next control. ex: '#next'
			prevText: 'prev',										// string - text displayed for 'previous' control
			prevImage: '',											// string - filepath of image used for 'previous' control. ex: 'images/prev.jpg'
			prevSelector: null,									// jQuery selector - element to contain the previous control. ex: '#next'
			captions: false,										// true, false - display image captions (reads the image 'title' tag)
			captionsSelector: null,							// jQuery selector - element to contain the captions. ex: '#captions'
			auto: false,												// true, false - make slideshow change automatically
			autoDirection: 'next',							// 'next', 'prev' - direction in which auto show will traverse
			autoControls: false,								// true, false - show 'start' and 'stop' controls for auto show
			autoControlsSelector: null,					// jQuery selector - element to contain the auto controls. ex: '#auto-controls'
			autoStart: true,										// true, false - if false show will wait for 'start' control to activate
			autoHover: false,										// true, false - if true show will pause on mouseover
			autoDelay: 0,                       // integer - in ms, the amount of time before starting the auto show
			pause: 3000,												// integer - in ms, the duration between each slide transition
			startText: 'start',									// string - text displayed for 'start' control
			startImage: '',											// string - filepath of image used for 'start' control. ex: 'images/start.jpg'
			stopText: 'stop',										// string - text displayed for 'stop' control
			stopImage: '',											// string - filepath of image used for 'stop' control. ex: 'images/stop.jpg'
			ticker: false,											// true, false - continuous motion ticker mode (think news ticker)
																					// note: autoControls, autoControlsSelector, and autoHover apply to ticker!
			tickerSpeed: 5000,								  // float - use value between 1 and 5000 to determine ticker speed - the smaller the value the faster the ticker speed
			tickerDirection: 'next',						// 'next', 'prev' - direction in which ticker show will traverse
			tickerHover: false,                 // true, false - if true ticker will pause on mouseover
			wrapperClass: 'bx-wrapper',					// string - classname attached to the slider wraper
			startingSlide: 0, 									// integer - show will start on specified slide. note: slides are zero based!
			displaySlideQty: 1,									// integer - number of slides to display at once
			moveSlideQty: 1,										// integer - number of slides to move at once
			randomStart: false,									// true, false - if true show will start on a random slide
			onBeforeSlide: function(){},				// function(currentSlideNumber, totalSlideQty, currentSlideHtmlObject) - advanced use only! see the tutorial here: http://bxslider.com/custom-pager
			onAfterSlide: function(){},					// function(currentSlideNumber, totalSlideQty, currentSlideHtmlObject) - advanced use only! see the tutorial here: http://bxslider.com/custom-pager
			onLastSlide: function(){},					// function(currentSlideNumber, totalSlideQty, currentSlideHtmlObject) - advanced use only! see the tutorial here: http://bxslider.com/custom-pager
			onFirstSlide: function(){},					// function(currentSlideNumber, totalSlideQty, currentSlideHtmlObject) - advanced use only! see the tutorial here: http://bxslider.com/custom-pager
			onNextSlide: function(){},					// function(currentSlideNumber, totalSlideQty, currentSlideHtmlObject) - advanced use only! see the tutorial here: http://bxslider.com/custom-pager
			onPrevSlide: function(){},					// function(currentSlideNumber, totalSlideQty, currentSlideHtmlObject) - advanced use only! see the tutorial here: http://bxslider.com/custom-pager
			buildPager: null,										// function(slideIndex, slideHtmlObject){ return string; } - advanced use only! see the tutorial here: http://bxslider.com/custom-pager
		}
		
		var options = $.extend(defaults, options);
		
		// cache the base element
		var base = this;
		// initialize (and localize) all variables
		var $parent = '';
		var $origElement = '';
		var $children = '';
		var $outerWrapper = '';
		var $firstChild = '';
		var childrenWidth = '';
		var childrenOuterWidth = '';
		var wrapperWidth = '';
		var wrapperHeight = '';
		var $pager = '';	
		var interval = '';
		var $autoControls = '';
		var $stopHtml = '';
		var $startContent = '';
		var $stopContent = '';
		var autoPlaying = true;
		var loaded = false;
		var childrenMaxWidth = 0;
		var childrenMaxHeight = 0;
		var currentSlide = 0;	
		var origLeft = 0;
		var origTop = 0;
		var origShowWidth = 0;
		var origShowHeight = 0;
		var tickerLeft = 0;
		var tickerTop = 0;
		var isWorking = false;
    
		var firstSlide = 0;
		var lastSlide = $children.length - 1;
		
						
		// PUBLIC FUNCTIONS
						
		/**
		 * Go to specified slide
		 */		
		this.goToSlide = function(number, stopAuto){
			if(!isWorking){
				isWorking = true;
				// set current slide to argument
				currentSlide = number;
				options.onBeforeSlide(currentSlide, $children.length, $children.eq(currentSlide));
				// check if stopAuto argument is supplied
				if(typeof(stopAuto) == 'undefined'){
					var stopAuto = true;
				}
				if(stopAuto){
					// if show is auto playing, stop it
					if(options.auto){
						base.stopShow(true);
					}
				}			
				slide = number;
				// check for first slide callback
				if(slide == firstSlide){
					options.onFirstSlide(currentSlide, $children.length, $children.eq(currentSlide));
				}
				// check for last slide callback
				if(slide == lastSlide){
					options.onLastSlide(currentSlide, $children.length, $children.eq(currentSlide));
				}
				// horizontal
				if(options.mode == 'horizontal'){
					$parent.animate({'left': '-'+getSlidePosition(slide, 'left')+'px'}, options.speed, options.easing, function(){
						isWorking = false;
						// perform the callback function
						options.onAfterSlide(currentSlide, $children.length, $children.eq(currentSlide));
					});
				// vertical
				}else if(options.mode == 'vertical'){
					$parent.animate({'top': '-'+getSlidePosition(slide, 'top')+'px'}, options.speed, options.easing, function(){
						isWorking = false;
						// perform the callback function
						options.onAfterSlide(currentSlide, $children.length, $children.eq(currentSlide));
					});			
				// fade	
				}else if(options.mode == 'fade'){
					setChildrenFade();
				}
				// check to remove controls on last/first slide
				checkEndControls();
				// accomodate multi slides
				if(options.moveSlideQty > 1){
					number = Math.floor(number / options.moveSlideQty);
				}
				// make the current slide active
				makeSlideActive(number);
				// display the caption
				showCaptions();
			}
		}
		
		/**
		 * Go to next slide
		 */		
		this.goToNextSlide = function(stopAuto){
			// check if stopAuto argument is supplied
			if(typeof(stopAuto) == 'undefined'){
				var stopAuto = true;
			}
			if(stopAuto){
				// if show is auto playing, stop it
				if(options.auto){
					base.stopShow(true);
				}
			}			
			// makes slideshow finite
			if(!options.infiniteLoop){
				if(!isWorking){
					var slideLoop = false;
					// make current slide the old value plus moveSlideQty
					currentSlide = (currentSlide + (options.moveSlideQty));
					// if current slide has looped on itself
					if(currentSlide <= lastSlide){
						checkEndControls();
						// next slide callback
						options.onNextSlide(currentSlide, $children.length, $children.eq(currentSlide));
						// move to appropriate slide
						base.goToSlide(currentSlide);						
					}else{
						currentSlide -= options.moveSlideQty;
					}
				} // end if(!isWorking)		
			}else{ 
				if(!isWorking){
					isWorking = true;					
					var slideLoop = false;
					// make current slide the old value plus moveSlideQty
					currentSlide = (currentSlide + options.moveSlideQty);
					// if current slide has looped on itself
					if(currentSlide > lastSlide){
						currentSlide = currentSlide % $children.length;
						slideLoop = true;
					}
					// next slide callback
					options.onNextSlide(currentSlide, $children.length, $children.eq(currentSlide));
					// slide before callback
					options.onBeforeSlide(currentSlide, $children.length, $children.eq(currentSlide));
					if(options.mode == 'horizontal'){						
						// get the new 'left' property for $parent
						var parentLeft = (options.moveSlideQty * childrenOuterWidth);
						// animate to the new 'left'
						$parent.animate({'left': '-='+parentLeft+'px'}, options.speed, options.easing, function(){
							isWorking = false;
							// if its time to loop, reset the $parent
							if(slideLoop){
								$parent.css('left', '-'+getSlidePosition(currentSlide, 'left')+'px');
							}
							// perform the callback function
							options.onAfterSlide(currentSlide, $children.length, $children.eq(currentSlide));
						});
					}else if(options.mode == 'vertical'){
						// get the new 'left' property for $parent
						var parentTop = (options.moveSlideQty * childrenMaxHeight);
						// animate to the new 'left'
						$parent.animate({'top': '-='+parentTop+'px'}, options.speed, options.easing, function(){
							isWorking = false;
							// if its time to loop, reset the $parent
							if(slideLoop){
								$parent.css('top', '-'+getSlidePosition(currentSlide, 'top')+'px');
							}
							// perform the callback function
							options.onAfterSlide(currentSlide, $children.length, $children.eq(currentSlide));
						});
					}else if(options.mode == 'fade'){
						setChildrenFade();
					}					
					// make the current slide active
					if(options.moveSlideQty > 1){
						makeSlideActive(Math.ceil(currentSlide / options.moveSlideQty));
					}else{
						makeSlideActive(currentSlide);
					}
					// display the caption
					showCaptions();
				} // end if(!isWorking)
				
			}	
		} // end function
		
		/**
		 * Go to previous slide
		 */		
		this.goToPreviousSlide = function(stopAuto){
			// check if stopAuto argument is supplied
			if(typeof(stopAuto) == 'undefined'){
				var stopAuto = true;
			}
			if(stopAuto){
				// if show is auto playing, stop it
				if(options.auto){
					base.stopShow(true);
				}
			}			
			// makes slideshow finite
			if(!options.infiniteLoop){	
				if(!isWorking){
					var slideLoop = false;
					// make current slide the old value plus moveSlideQty
					currentSlide = currentSlide - options.moveSlideQty;
					// if current slide has looped on itself
					if(currentSlide < 0){
						currentSlide = 0;
						// if specified, hide the control on the last slide
						if(options.hideControlOnEnd){
							$outerWrapper.children('.bx-prev').hide();
						}
					}
					checkEndControls();
					// next slide callback
					options.onPrevSlide(currentSlide, $children.length, $children.eq(currentSlide));
					// move to appropriate slide
					base.goToSlide(currentSlide);
				}							
			}else{
				if(!isWorking){
					isWorking = true;			
					var slideLoop = false;
					// make current slide the old value plus moveSlideQty
					currentSlide = (currentSlide - (options.moveSlideQty));
					// if current slide has looped on itself
					if(currentSlide < 0){
						negativeOffset = (currentSlide % $children.length);
						if(negativeOffset == 0){
							currentSlide = 0;
						}else{
							currentSlide = ($children.length) + negativeOffset; 
						}
						slideLoop = true;
					}
					// next slide callback
					options.onPrevSlide(currentSlide, $children.length, $children.eq(currentSlide));
					// slide before callback
					options.onBeforeSlide(currentSlide, $children.length, $children.eq(currentSlide));
					if(options.mode == 'horizontal'){
						// get the new 'left' property for $parent
						var parentLeft = (options.moveSlideQty * childrenOuterWidth);
						// animate to the new 'left'
						$parent.animate({'left': '+='+parentLeft+'px'}, options.speed, options.easing, function(){
							isWorking = false;
							// if its time to loop, reset the $parent
							if(slideLoop){
								$parent.css('left', '-'+getSlidePosition(currentSlide, 'left')+'px');
							}
							// perform the callback function
							options.onAfterSlide(currentSlide, $children.length, $children.eq(currentSlide));
						});
					}else if(options.mode == 'vertical'){
						// get the new 'left' property for $parent
						var parentTop = (options.moveSlideQty * childrenMaxHeight);
						// animate to the new 'left'
						$parent.animate({'top': '+='+parentTop+'px'}, options.speed, options.easing, function(){
							isWorking = false;
							// if its time to loop, reset the $parent
							if(slideLoop){
								$parent.css('top', '-'+getSlidePosition(currentSlide, 'top')+'px');
							}
							// perform the callback function
							options.onAfterSlide(currentSlide, $children.length, $children.eq(currentSlide));
						});
					}else if(options.mode == 'fade'){
						setChildrenFade();
					}					
					// make the current slide active
					if(options.moveSlideQty > 1){
						makeSlideActive(Math.ceil(currentSlide / options.moveSlideQty));
					}else{
						makeSlideActive(currentSlide);
					}
					// display the caption
					showCaptions();
				} // end if(!isWorking)				
			}
		} // end function
		
		/**
		 * Go to first slide
		 */		
		this.goToFirstSlide = function(stopAuto){
			// check if stopAuto argument is supplied
			if(typeof(stopAuto) == 'undefined'){
				var stopAuto = true;
			}
			base.goToSlide(firstSlide, stopAuto);
		}
		
		/**
		 * Go to last slide
		 */		
		this.goToLastSlide = function(){
			// check if stopAuto argument is supplied
			if(typeof(stopAuto) == 'undefined'){
				var stopAuto = true;
			}
			base.goToSlide(lastSlide, stopAuto);
		}
		
		/**
		 * Get the current slide
		 */		
		this.getCurrentSlide = function(){
			return currentSlide;
		}
		
		/**
		 * Get the total slide count
		 */		
		this.getSlideCount = function(){
			return $children.length;
		}
		
		/**
		 * Suspend the slideshow
		 */		
		this.suspendShow = function(changeText){
			clearInterval(interval);
			// check if changeText argument is supplied
			if(typeof(changeText) == 'undefined'){
				var changeText = true;
			}
			if(changeText && options.autoControls){
				$autoControls.html($startContent).removeClass('stop').addClass('start');
			}
		}
		
		/**
		 * Restart the suspended slideshow
		 */		
		this.restartShow = function(changeText){
			// check if changeText argument is supplied
			if(typeof(changeText) == 'undefined'){
				var changeText = true;
			}
			if(autoPlaying){
				setAutoInterval();
			}
			if(changeText && options.autoControls){
				$autoControls.html($stopContent).removeClass('start').addClass('stop');
			}
		}
		
		/**
		 * Stop the slideshow permanently
		 */		
		this.stopShow = function(changeText){
			autoPlaying = false;
			this.suspendShow(changeText);
		}
		
		/**
		 * Start the slideshow
		 */		
		this.startShow = function(changeText){
			autoPlaying = true;
			this.restartShow(changeText);
		}
		
		/**
		 * Stops the ticker
		 */		
		this.stopTicker = function(changeText){
			$parent.stop();
			// check if changeText argument is supplied
			if(typeof(changeText) == 'undefined'){
				var changeText = true;
			}
			if(changeText && options.ticker){
				$autoControls.html($startContent).removeClass('stop').addClass('start');
				autoPlaying = false;
			}			
		}
		
		/**
		 * Starts the ticker
		 */		
		this.startTicker = function(changeText){
			if(options.mode == 'horizontal'){
				if(options.tickerDirection == 'next'){
					// get the 'left' property where the ticker stopped
					var stoppedLeft = parseInt($parent.css('left'));
					// calculate the remaining distance the show must travel until the loop
					var remainingDistance = (origShowWidth + stoppedLeft) + $children.eq(0).width();			
				}else if(options.tickerDirection == 'prev'){
					// get the 'left' property where the ticker stopped
					var stoppedLeft = -parseInt($parent.css('left'));
					// calculate the remaining distance the show must travel until the loop
					var remainingDistance = (stoppedLeft) - $children.eq(0).width();
				}
				// calculate the speed ratio to seamlessly finish the loop
				var finishingSpeed = (remainingDistance * options.tickerSpeed) / origShowWidth;
				// call the show
				moveTheShow(tickerLeft, remainingDistance, finishingSpeed);					
			}else if(options.mode == 'vertical'){
				if(options.tickerDirection == 'next'){
					// get the 'top' property where the ticker stopped
					var stoppedTop = parseInt($parent.css('top'));
					// calculate the remaining distance the show must travel until the loop
					var remainingDistance = (origShowHeight + stoppedTop) + $children.eq(0).height();			
				}else if(options.tickerDirection == 'prev'){
					// get the 'left' property where the ticker stopped
					var stoppedTop = -parseInt($parent.css('top'));
					// calculate the remaining distance the show must travel until the loop
					var remainingDistance = (stoppedTop) - $children.eq(0).height();
				}
				// calculate the speed ratio to seamlessly finish the loop
				var finishingSpeed = (remainingDistance * options.tickerSpeed) / origShowHeight;
				// call the show
				moveTheShow(tickerTop, remainingDistance, finishingSpeed);
				// check if changeText argument is supplied
				if(typeof(changeText) == 'undefined'){
					var changeText = true;
				}
				if(changeText && options.ticker){
					$autoControls.html($stopContent).removeClass('start').addClass('stop');
					autoPlaying = true;
				}						
			}
		}
				
		/**
		 * Initialize a new slideshow
		 */		
		this.initShow = function(){
			
			// reinitialize all variables
			// base = this;
			$parent = $(this);
			$origElement = $parent.clone();
			$children = $parent.children(options.childSelector);
			$outerWrapper = '';
			$firstChild = $parent.children(options.childSelector + ':first');
			childrenWidth = $firstChild.width();
			childrenMaxWidth = 0;
			childrenOuterWidth = $firstChild.outerWidth();
			childrenMaxHeight = 0;
			wrapperWidth = getWrapperWidth();
			wrapperHeight = getWrapperHeight();
			isWorking = false;
			$pager = '';	
			currentSlide = 0;	
			origLeft = 0;
			origTop = 0;
			interval = '';
			$autoControls = '';
			$stopHtml = '';
			$startContent = '';
			$stopContent = '';
			autoPlaying = true;
			loaded = false;
			origShowWidth = 0;
			origShowHeight = 0;
			tickerLeft = 0;
			tickerTop = 0;
      
			firstSlide = 0;
			lastSlide = $children.length - 1;
						
			// get the largest child's height and width
			$children.each(function(index) {
			  if($(this).outerHeight() > childrenMaxHeight){
					childrenMaxHeight = $(this).outerHeight();
				}
				if($(this).outerWidth() > childrenMaxWidth){
					childrenMaxWidth = $(this).outerWidth();
				}
			});

			// get random slide number
			if(options.randomStart){
				var randomNumber = Math.floor(Math.random() * $children.length);
				currentSlide = randomNumber;
				origLeft = childrenOuterWidth * (options.moveSlideQty + randomNumber);
				origTop = childrenMaxHeight * (options.moveSlideQty + randomNumber);
			// start show at specific slide
			}else{
				currentSlide = options.startingSlide;
				origLeft = childrenOuterWidth * (options.moveSlideQty + options.startingSlide);
				origTop = childrenMaxHeight * (options.moveSlideQty + options.startingSlide);
			}
						
			// set initial css
			initCss();
			
			// check to show pager
			if(options.pager && !options.ticker){
				if(options.pagerType == 'full'){
					showPager('full');
				}else if(options.pagerType == 'short'){
					showPager('short');
				}
			}
						
			// check to show controls
			if(options.controls && !options.ticker && $children.length > 1){
				setControlsVars();
			}
						
			// check if auto
			if(options.auto || options.ticker){
				// check if auto controls are displayed
				if(options.autoControls){
					setAutoControlsVars();
				}
				// check if show should auto start
				if(options.autoStart){
					// check if autostart should delay
					autoPlaying = false; // prevent playing during the deplay
					setTimeout(function(){
						base.startShow(true);
					}, options.autoDelay);
				}else{
					base.stopShow(true);
				}
				// check if show should pause on hover
				if(options.autoHover && !options.ticker){
					setAutoHover();
				}
			}						
			// make the starting slide active
			if(options.moveSlideQty > 1){
				makeSlideActive(Math.ceil(currentSlide / options.moveSlideQty));
			}else{			
				makeSlideActive(currentSlide);			
			}
			// check for finite show and if controls should be hidden
			checkEndControls();
			// show captions
			if(options.captions){
				showCaptions();
			}
			// perform the callback function
			options.onAfterSlide(currentSlide, $children.length, $children.eq(currentSlide));
		}
		
		/**
		 * Destroy the current slideshow
		 */		
		this.destroyShow = function(){			
			// stop the auto show
			clearInterval(interval);
			// remove any controls / pagers that have been appended
			$outerWrapper.children('.bx-next, .bx-prev, .bx-pager, .bx-auto').remove();
			// unwrap all bx-wrappers
			$parent.unwrap().unwrap().removeAttr('style');
			// remove any styles that were appended
			$parent.children(options.childSelector).removeAttr('style').not('.bx-child').remove();
			// remove any childrent that were appended
			$children.removeClass('bx-child');
			
		}
		
		/**
		 * Reload the current slideshow
		 */		
		this.reloadShow = function(){
			base.destroyShow();
			base.initShow();
		}
		
		// PRIVATE FUNCTIONS
		
		/**
		 * Creates all neccessary styling for the slideshow
		 */		
		function initCss(){
			// layout the children
			setChildrenLayout(options.startingSlide);
			// CSS for horizontal mode
			if(options.mode == 'horizontal'){
				// wrap the <ul> in div that acts as a window and make the <ul> uber wide
				$parent
				.wrap('<div class="'+options.wrapperClass+'" style="width:'+wrapperWidth+'px; position:relative;"></div>')
				.wrap('<div class="bx-window" style="position:relative; overflow:hidden; width:'+wrapperWidth+'px;"></div>')
				.css({
				  width: '999999px',
				  position: 'relative',
					left: '-'+(options.infiniteLoop ? origLeft : 0)+'px'
				});
				$parent.children(options.childSelector).css({
					width: childrenWidth,
				  'float': 'left',
				  listStyle: 'none'
				});					
				$outerWrapper = $parent.parent().parent();
				$children.addClass('bx-child');
			// CSS for vertical mode
			}else if(options.mode == 'vertical'){
				// wrap the <ul> in div that acts as a window and make the <ul> uber tall
				$parent
				.wrap('<div class="'+options.wrapperClass+'" style="width:'+childrenMaxWidth+'px; position:relative;"></div>')
				.wrap('<div class="bx-window" style="width:'+childrenMaxWidth+'px; height:'+wrapperHeight+'px; position:relative; overflow:hidden;"></div>')
				.css({
				  height: '999999px',
				  position: 'relative',
					top: '-'+(origTop)+'px'
				});
				$parent.children(options.childSelector).css({
				  listStyle: 'none',
					height: childrenMaxHeight
				});					
				$outerWrapper = $parent.parent().parent();
				$children.addClass('bx-child');
			// CSS for fade mode
			}else if(options.mode == 'fade'){
				// wrap the <ul> in div that acts as a window
				$parent
				.wrap('<div class="'+options.wrapperClass+'" style="width:'+childrenMaxWidth+'px; position:relative;"></div>')
				.wrap('<div class="bx-window" style="height:'+childrenMaxHeight+'px; width:'+childrenMaxWidth+'px; position:relative; overflow:hidden;"></div>');
				$parent.children(options.childSelector).css({
				  listStyle: 'none',
				  position: 'absolute',
					top: 0,
					left: 0,
					zIndex: 98
				});					
				$outerWrapper = $parent.parent().parent();
				$children.not(':eq('+currentSlide+')').fadeTo(0, 0);
				$children.eq(currentSlide).css('zIndex', 99);
			}
			// if captions = true setup a div placeholder
			if(options.captions && options.captionsSelector == null){
				$outerWrapper.append('<div class="bx-captions"></div>');
			}			
		}
		
		/**
		 * Depending on mode, lays out children in the proper setup
		 */		
		function setChildrenLayout(){			
			// lays out children for horizontal or vertical modes
			if( (options.mode == 'horizontal' || options.mode == 'vertical') && options.infiniteLoop) {
				// get the children behind
				var $prependedChildren = getArraySample($children, 0, options.moveSlideQty, 'backward');
				
				// add each prepended child to the back of the original element
				$.each($prependedChildren, function(index) {
					$parent.prepend($(this));
				});			
				
				// total number of slides to be hidden after the window
				var totalNumberAfterWindow = ($children.length + options.moveSlideQty) - 1;
				// number of original slides hidden after the window
				var pagerExcess = $children.length - options.displaySlideQty;
				// number of slides to append to the original hidden slides
				var numberToAppend = totalNumberAfterWindow - pagerExcess;
				// get the sample of extra slides to append
				var $appendedChildren = getArraySample($children, 0, numberToAppend, 'forward');
				
				if(options.infiniteLoop){
					// add each appended child to the front of the original element
					$.each($appendedChildren, function(index) {
						$parent.append($(this));
					});
				}
			}
		}
		
		/**
		 * Sets all variables associated with the controls
		 */		
		function setControlsVars(){
			// check if text or images should be used for controls
			// check "next"
			if(options.nextImage != ''){
				nextContent = options.nextImage;
				nextType = 'image';
			}else{
				nextContent = options.nextText;
				nextType = 'text';
			}
			// check "prev"
			if(options.prevImage != ''){
				prevContent = options.prevImage;
				prevType = 'image';
			}else{
				prevContent = options.prevText;
				prevType = 'text';
			}
			// show the controls
			showControls(nextType, nextContent, prevType, prevContent);
		}			
		
		/**
		 * Puts slideshow into auto mode
		 *
		 * @param int pause number of ms the slideshow will wait between slides 
		 * @param string direction 'forward', 'backward' sets the direction of the slideshow (forward/backward)
		 * @param bool controls determines if start/stop controls will be displayed
		 */		
		function setAutoInterval(){
			if(options.auto){
				clearInterval(interval); // clear any existing interval
				
				// finite loop
				if(!options.infiniteLoop){
					if(options.autoDirection == 'next'){
						interval = setInterval(function(){
							currentSlide += options.moveSlideQty;
							// if currentSlide has exceeded total number
							if(currentSlide > lastSlide){
								currentSlide = currentSlide % $children.length;
							}
							base.goToSlide(currentSlide, false);
						}, options.pause);
					}else if(options.autoDirection == 'prev'){
						interval = setInterval(function(){
							currentSlide -= options.moveSlideQty;
							// if currentSlide is smaller than zero
							if(currentSlide < 0){
								negativeOffset = (currentSlide % $children.length);
								if(negativeOffset == 0){
									currentSlide = 0;
								}else{
									currentSlide = ($children.length) + negativeOffset; 
								}
							}
							base.goToSlide(currentSlide, false);
						}, options.pause);
					}
				// infinite loop
				}else{
					if(options.autoDirection == 'next'){
						interval = setInterval(function(){
							base.goToNextSlide(false);
						}, options.pause);
					}else if(options.autoDirection == 'prev'){
						interval = setInterval(function(){
							base.goToPreviousSlide(false);
						}, options.pause);
					}
				}
			
			}else if(options.ticker){
				
				options.tickerSpeed *= 10;
												
				// get the total width of the original show
				$('.bx-child', $outerWrapper).each(function(index) {
				  origShowWidth += $(this).width();
					origShowHeight += $(this).height();
				});
				
				// if prev start the show from the last slide
				if(options.tickerDirection == 'prev' && options.mode == 'horizontal'){
					$parent.css('left', '-'+(origShowWidth+origLeft)+'px');
				}else if(options.tickerDirection == 'prev' && options.mode == 'vertical'){
					$parent.css('top', '-'+(origShowHeight+origTop)+'px');
				}
				
				if(options.mode == 'horizontal'){
					// get the starting left position
					tickerLeft = parseInt($parent.css('left'));
					// start the ticker
					moveTheShow(tickerLeft, origShowWidth, options.tickerSpeed);
				}else if(options.mode == 'vertical'){
					// get the starting top position
					tickerTop = parseInt($parent.css('top'));
					// start the ticker
					moveTheShow(tickerTop, origShowHeight, options.tickerSpeed);
				}												
				
				// check it tickerHover applies
				if(options.tickerHover){
					setTickerHover();
				}					
			}			
		}
		
		function moveTheShow(leftCss, distance, speed){
			// if horizontal
			if(options.mode == 'horizontal'){
				// if next
				if(options.tickerDirection == 'next'){
					$parent.animate({'left': '-='+distance+'px'}, speed, 'linear', function(){
						$parent.css('left', leftCss);
						moveTheShow(leftCss, origShowWidth, options.tickerSpeed);
					});
				// if prev
				}else if(options.tickerDirection == 'prev'){
					$parent.animate({'left': '+='+distance+'px'}, speed, 'linear', function(){
						$parent.css('left', leftCss);
						moveTheShow(leftCss, origShowWidth, options.tickerSpeed);
					});
				}
			// if vertical		
			}else if(options.mode == 'vertical'){
				// if next
				if(options.tickerDirection == 'next'){
					$parent.animate({'top': '-='+distance+'px'}, speed, 'linear', function(){
						$parent.css('top', leftCss);
						moveTheShow(leftCss, origShowHeight, options.tickerSpeed);
					});
				// if prev
				}else if(options.tickerDirection == 'prev'){
					$parent.animate({'top': '+='+distance+'px'}, speed, 'linear', function(){
						$parent.css('top', leftCss);
						moveTheShow(leftCss, origShowHeight, options.tickerSpeed);
					});
				}
			}
		}		
		
		/**
		 * Sets all variables associated with the controls
		 */		
		function setAutoControlsVars(){
			// check if text or images should be used for controls
			// check "start"
			if(options.startImage != ''){
				startContent = options.startImage;
				startType = 'image';
			}else{
				startContent = options.startText;
				startType = 'text';
			}
			// check "stop"
			if(options.stopImage != ''){
				stopContent = options.stopImage;
				stopType = 'image';
			}else{
				stopContent = options.stopText;
				stopType = 'text';
			}
			// show the controls
			showAutoControls(startType, startContent, stopType, stopContent);
		}
		
		/**
		 * Handles hover events for auto shows
		 */		
		function setAutoHover(){
			// hover over the slider window
			$outerWrapper.children('.bx-window').hover(function() {
				if(autoPlaying){
					base.suspendShow(false);
				}
			}, function() {
				if(autoPlaying){
					base.restartShow(false);
				}
			});
		}
		
		/**
		 * Handles hover events for ticker mode
		 */		
		function setTickerHover(){
			// on hover stop the animation
			$parent.hover(function() {
				if(autoPlaying){
					base.stopTicker(false);
				}
			}, function() {
				if(autoPlaying){
					base.startTicker(false);
				}
			});
		}		
		
		/**
		 * Handles fade animation
		 */		
		function setChildrenFade(){
			// fade out any other child besides the current
			$children.not(':eq('+currentSlide+')').fadeTo(options.speed, 0).css('zIndex', 98);
			// fade in the current slide
			$children.eq(currentSlide).css('zIndex', 99).fadeTo(options.speed, 1, function(){
				isWorking = false;
				// ie fade fix
				if(jQuery.browser.msie){
					$children.eq(currentSlide).get(0).style.removeAttribute('filter');
				}
				// perform the callback function
				options.onAfterSlide(currentSlide, $children.length, $children.eq(currentSlide));
			});
		};
				
		/**
		 * Makes slide active
		 */		
		function makeSlideActive(number){
			if(options.pagerType == 'full' && options.pager){
				// remove all active classes
				$('a', $pager).removeClass(options.pagerActiveClass);
				// assign active class to appropriate slide
				$('a', $pager).eq(number).addClass(options.pagerActiveClass);
			}else if(options.pagerType == 'short' && options.pager){
				$('.bx-pager-current', $pager).html(currentSlide+1);
			}
		}
				
		/**
		 * Displays next/prev controls
		 *
		 * @param string nextType 'image', 'text'
		 * @param string nextContent if type='image', specify a filepath to the image. if type='text', specify text.
		 * @param string prevType 'image', 'text'
		 * @param string prevContent if type='image', specify a filepath to the image. if type='text', specify text.
		 */		
		function showControls(nextType, nextContent, prevType, prevContent){
			// create pager html elements
			var $nextHtml = $('<a href="" class="bx-next"></a>');
			var $prevHtml = $('<a href="" class="bx-prev"></a>');
			// check if next is 'text' or 'image'
			if(nextType == 'text'){
				$nextHtml.html(nextContent);
			}else{
				$nextHtml.html('<img src="'+nextContent+'" />');
			}
			// check if prev is 'text' or 'image'
			if(prevType == 'text'){
				$prevHtml.html(prevContent);
			}else{
				$prevHtml.html('<img src="'+prevContent+'" />');
			}
			// check if user supplied a selector to populate next control
			if(options.prevSelector){
				$(options.prevSelector).append($prevHtml);
			}else{
				$outerWrapper.append($prevHtml);
			}
			// check if user supplied a selector to populate next control
			if(options.nextSelector){
				$(options.nextSelector).append($nextHtml);
			}else{
				$outerWrapper.append($nextHtml);
			}
			// click next control
			$nextHtml.click(function() {
				base.goToNextSlide();
				return false;
			});
			// click prev control
			$prevHtml.click(function() {
				base.goToPreviousSlide();
				return false;
			});
		}
		
		/**
		 * Displays the pager
		 *
		 * @param string type 'full', 'short'
		 */		
		function showPager(type){
			// sets up logic for finite multi slide shows
			var pagerQty = $children.length;
			// if we are moving more than one at a time and we have a finite loop
			if(options.moveSlideQty > 1){
				// if slides create an odd number of pages
				if($children.length % options.moveSlideQty != 0){
					// pagerQty = $children.length / options.moveSlideQty + 1;
					pagerQty = Math.ceil($children.length / options.moveSlideQty);
				// if slides create an even number of pages
				}else{
					pagerQty = $children.length / options.moveSlideQty;
				}
			}
			var pagerString = '';
			// check if custom build function was supplied
			if(options.buildPager){
				for(var i=0; i<pagerQty; i++){
					pagerString += options.buildPager(i, $children.eq(i * options.moveSlideQty));
				}
				
			// if not, use default pager
			}else if(type == 'full'){
				// build the full pager
				for(var i=1; i<=pagerQty; i++){
					pagerString += '<a href="" class="pager-link pager-'+i+'">'+i+'</a>';
				}
			}else if(type == 'short') {
				// build the short pager
				pagerString = '<span class="bx-pager-current">'+(options.startingSlide+1)+'</span> '+options.pagerShortSeparator+' <span class="bx-pager-total">'+$children.length+'</span>';
			}	
			// check if user supplied a pager selector
			if(options.pagerSelector){
				$(options.pagerSelector).append(pagerString);
				$pager = $(options.pagerSelector);
			}else{
				var $pagerContainer = $('<div class="bx-pager"></div>');
				$pagerContainer.append(pagerString);
				// attach the pager to the DOM
				if(options.pagerLocation == 'top'){
					$outerWrapper.prepend($pagerContainer);
				}else if(options.pagerLocation == 'bottom'){
					$outerWrapper.append($pagerContainer);
				}
				// cache the pager element
				$pager = $outerWrapper.children('.bx-pager');
			}
			$pager.children().click(function() {
				// only if pager is full mode
				if(options.pagerType == 'full'){
					// get the index from the link
					var slideIndex = $pager.children().index(this);
					// accomodate moving more than one slide
					if(options.moveSlideQty > 1){
						slideIndex *= options.moveSlideQty;
					}
					base.goToSlide(slideIndex);
				}
				return false;
			});
		}
				
		/**
		 * Displays captions
		 */		
		function showCaptions(){
			// get the title from each image
		  var caption = $('img', $children.eq(currentSlide)).attr('title');
			// if the caption exists
			if(caption != ''){
				// if user supplied a selector
				if(options.captionsSelector){
					$(options.captionsSelector).html(caption);
				}else{
					$outerWrapper.children('.bx-captions').html(caption);
				}
			}else{
				// if user supplied a selector
				if(options.captionsSelector){
					$(options.captionsSelector).html('&nbsp;');
				}else{
					$outerWrapper.children('.bx-captions').html('&nbsp;');
				}				
			}
		}
		
		/**
		 * Displays start/stop controls for auto and ticker mode
		 *
		 * @param string type 'image', 'text'
		 * @param string next [optional] if type='image', specify a filepath to the image. if type='text', specify text.
		 * @param string prev [optional] if type='image', specify a filepath to the image. if type='text', specify text.
		 */
		function showAutoControls(startType, startContent, stopType, stopContent){
			// create pager html elements
			$autoControls = $('<a href="" class="bx-start"></a>');
			// check if start is 'text' or 'image'
			if(startType == 'text'){
				$startContent = startContent;
			}else{
				$startContent = '<img src="'+startContent+'" />';
			}
			// check if stop is 'text' or 'image'
			if(stopType == 'text'){
				$stopContent = stopContent;
			}else{
				$stopContent = '<img src="'+stopContent+'" />';
			}
			// check if user supplied a selector to populate next control
			if(options.autoControlsSelector){
				$(options.autoControlsSelector).append($autoControls);
			}else{
				$outerWrapper.append('<div class="bx-auto"></div>');
				$outerWrapper.children('.bx-auto').html($autoControls);
			}
						
			// click start control
			$autoControls.click(function() {
				if(options.ticker){
					if($(this).hasClass('stop')){
						base.stopTicker();
					}else if($(this).hasClass('start')){
						base.startTicker();
					}
				}else{
					if($(this).hasClass('stop')){
						base.stopShow(true);
					}else if($(this).hasClass('start')){
						base.startShow(true);
					}
				}
				return false;
			});
			
		}
		
		/**
		 * Checks if show is in finite mode, and if slide is either first or last, then hides the respective control
		 */		
		function checkEndControls(){
			if(!options.infiniteLoop && options.hideControlOnEnd){
				// check previous
				if(currentSlide == firstSlide){
					$outerWrapper.children('.bx-prev').hide();				
				}else{
					$outerWrapper.children('.bx-prev').show();
				}
				// check next
				var lastPossibleSlide = Math.floor(lastSlide/options.displaySlideQty) * options.displaySlideQty;
        if(currentSlide >= lastPossibleSlide){
					$outerWrapper.children('.bx-next').hide();
				}else{
					$outerWrapper.children('.bx-next').show();
				}
			}
		}
		
		/**
		 * Returns the left offset of the slide from the parent container
		 */		
		function getSlidePosition(number, side){			
			var $slidePosition = $parent.find(' > .bx-child').eq(number).position();
			return (side == 'left') ? $slidePosition.left : $slidePosition.top;
		}
		
		/**
		 * Returns the width of the wrapper
		 */		
		function getWrapperWidth(){
			var wrapperWidth = $firstChild.outerWidth() * options.displaySlideQty;
			return wrapperWidth;
		}
		
		/**
		 * Returns the height of the wrapper
		 */		
		function getWrapperHeight(){
			// if displaying multiple slides, multiple wrapper width by number of slides to display
			var wrapperHeight = $firstChild.outerHeight() * options.displaySlideQty;
			return wrapperHeight;
		}
		
		/**
		 * Returns a sample of an arry and loops back on itself if the end of the array is reached
		 *
		 * @param array array original array the sample is derived from
		 * @param int start array index sample will start
		 * @param int length number of items in the sample
		 * @param string direction 'forward', 'backward' direction the loop should travel in the array
		 */		
		function getArraySample(array, start, length, direction){
			// initialize empty array
			var sample = [];
			// clone the length argument
			var loopLength = length;
			// determines when the empty array should start being populated
			var startPopulatingArray = false;
			// reverse the array if direction = 'backward'
			if(direction == 'backward'){
				array = $.makeArray(array);
				array.reverse();
			}
			// loop through original array until the length argument is met
			while(loopLength > 0){				
				// loop through original array
				$.each(array, function(index, val) {
					// check if length has been met
					if(loopLength > 0){
						// don't do anything unless first index has been reached
					  if(!startPopulatingArray){
							// start populating empty array
							if(index == start){
								startPopulatingArray = true;
								// add element to array
								sample.push($(this).clone());
								// decrease the length clone variable
								loopLength--;
							}
						}else{
							// add element to array
							sample.push($(this).clone());
							// decrease the length clone variable
							loopLength--;
						}
					// if length has been met, break loose
					}else{
						return false;
					}			
				});				
			}
			return sample;
		}
												
		this.each(function(){
			// make sure the element has children
			if($(this).children().length > 0){
				base.initShow();
			}
		});
				
		return this;						
	}
	
	jQuery.fx.prototype.cur = function(){
		if ( this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null) ) {
			return this.elem[ this.prop ];
		}

		var r = parseFloat( jQuery.css( this.elem, this.prop ) );
		// return r && r > -10000 ? r : 0;
		return r;
	}

		
})(jQuery);
if(!window['googleLT_']){window['googleLT_']=(new Date()).getTime();}if (!window['google']) {
window['google'] = {};
}
if (!window['google']['loader']) {
window['google']['loader'] = {};
google.loader.ServiceBase = 'https://www.google.com/uds';
google.loader.GoogleApisBase = 'https://ajax.googleapis.com/ajax';
google.loader.ApiKey = 'notsupplied';
google.loader.KeyVerified = true;
google.loader.LoadFailure = false;
google.loader.Secure = true;
google.loader.GoogleLocale = 'www.google.com';
google.loader.ClientLocation = null;
google.loader.AdditionalParams = '';
(function() {var d=encodeURIComponent,g=window,h=document;function l(a,b){return a.load=b}var m="replace",n="charAt",q="getTime",r="setTimeout",t="push",u="indexOf",v="ServiceBase",w="name",x="length",y="prototype",z="loader",A="substring",B="join",C="toLowerCase";function D(a){return a in E?E[a]:E[a]=-1!=navigator.userAgent[C]()[u](a)}var E={};function F(a,b){var c=function(){};c.prototype=b[y];a.U=b[y];a.prototype=new c}
function G(a,b,c){var e=Array[y].slice.call(arguments,2)||[];return function(){return a.apply(b,e.concat(Array[y].slice.call(arguments)))}}function H(a){a=Error(a);a.toString=function(){return this.message};return a}function I(a,b){for(var c=a.split(/\./),e=g,f=0;f<c[x]-1;f++)e[c[f]]||(e[c[f]]={}),e=e[c[f]];e[c[c[x]-1]]=b}function J(a,b,c){a[b]=c}if(!K)var K=I;if(!L)var L=J;google[z].v={};K("google.loader.callbacks",google[z].v);var M={},N={};google[z].eval={};K("google.loader.eval",google[z].eval);
l(google,function(a,b,c){function e(a){var b=a.split(".");if(2<b[x])throw H("Module: '"+a+"' not found!");"undefined"!=typeof b[1]&&(f=b[0],c.packages=c.packages||[],c.packages[t](b[1]))}var f=a;c=c||{};if(a instanceof Array||a&&"object"==typeof a&&"function"==typeof a[B]&&"function"==typeof a.reverse)for(var k=0;k<a[x];k++)e(a[k]);else e(a);if(a=M[":"+f]){c&&!c.language&&c.locale&&(c.language=c.locale);c&&"string"==typeof c.callback&&(k=c.callback,k.match(/^[[\]A-Za-z0-9._]+$/)&&(k=g.eval(k),c.callback=
k));if((k=c&&null!=c.callback)&&!a.s(b))throw H("Module: '"+f+"' must be loaded before DOM onLoad!");k?a.m(b,c)?g[r](c.callback,0):a.load(b,c):a.m(b,c)||a.load(b,c)}else throw H("Module: '"+f+"' not found!");});K("google.load",google.load);
google.T=function(a,b){b?(0==O[x]&&(P(g,"load",Q),!D("msie")&&!D("safari")&&!D("konqueror")&&D("mozilla")||g.opera?g.addEventListener("DOMContentLoaded",Q,!1):D("msie")?h.write("<script defer onreadystatechange='google.loader.domReady()' src=//:>\x3c/script>"):(D("safari")||D("konqueror"))&&g[r](S,10)),O[t](a)):P(g,"load",a)};K("google.setOnLoadCallback",google.T);
function P(a,b,c){if(a.addEventListener)a.addEventListener(b,c,!1);else if(a.attachEvent)a.attachEvent("on"+b,c);else{var e=a["on"+b];a["on"+b]=null!=e?aa([c,e]):c}}function aa(a){return function(){for(var b=0;b<a[x];b++)a[b]()}}var O=[];google[z].P=function(){var a=g.event.srcElement;"complete"==a.readyState&&(a.onreadystatechange=null,a.parentNode.removeChild(a),Q())};K("google.loader.domReady",google[z].P);var ba={loaded:!0,complete:!0};function S(){ba[h.readyState]?Q():0<O[x]&&g[r](S,10)}
function Q(){for(var a=0;a<O[x];a++)O[a]();O.length=0}google[z].d=function(a,b,c){if(c){var e;"script"==a?(e=h.createElement("script"),e.type="text/javascript",e.src=b):"css"==a&&(e=h.createElement("link"),e.type="text/css",e.href=b,e.rel="stylesheet");(a=h.getElementsByTagName("head")[0])||(a=h.body.parentNode.appendChild(h.createElement("head")));a.appendChild(e)}else"script"==a?h.write('<script src="'+b+'" type="text/javascript">\x3c/script>'):"css"==a&&h.write('<link href="'+b+'" type="text/css" rel="stylesheet"></link>')};
K("google.loader.writeLoadTag",google[z].d);google[z].Q=function(a){N=a};K("google.loader.rfm",google[z].Q);google[z].S=function(a){for(var b in a)"string"==typeof b&&b&&":"==b[n](0)&&!M[b]&&(M[b]=new T(b[A](1),a[b]))};K("google.loader.rpl",google[z].S);google[z].R=function(a){if((a=a.specs)&&a[x])for(var b=0;b<a[x];++b){var c=a[b];"string"==typeof c?M[":"+c]=new U(c):(c=new V(c[w],c.baseSpec,c.customSpecs),M[":"+c[w]]=c)}};K("google.loader.rm",google[z].R);google[z].loaded=function(a){M[":"+a.module].l(a)};
K("google.loader.loaded",google[z].loaded);google[z].O=function(){return"qid="+((new Date)[q]().toString(16)+Math.floor(1E7*Math.random()).toString(16))};K("google.loader.createGuidArg_",google[z].O);I("google_exportSymbol",I);I("google_exportProperty",J);google[z].a={};K("google.loader.themes",google[z].a);google[z].a.I="//www.google.com/cse/style/look/bubblegum.css";L(google[z].a,"BUBBLEGUM",google[z].a.I);google[z].a.K="//www.google.com/cse/style/look/greensky.css";L(google[z].a,"GREENSKY",google[z].a.K);
google[z].a.J="//www.google.com/cse/style/look/espresso.css";L(google[z].a,"ESPRESSO",google[z].a.J);google[z].a.M="//www.google.com/cse/style/look/shiny.css";L(google[z].a,"SHINY",google[z].a.M);google[z].a.L="//www.google.com/cse/style/look/minimalist.css";L(google[z].a,"MINIMALIST",google[z].a.L);google[z].a.N="//www.google.com/cse/style/look/v2/default.css";L(google[z].a,"V2_DEFAULT",google[z].a.N);function U(a){this.b=a;this.o=[];this.n={};this.e={};this.f={};this.j=!0;this.c=-1}
U[y].g=function(a,b){var c="";void 0!=b&&(void 0!=b.language&&(c+="&hl="+d(b.language)),void 0!=b.nocss&&(c+="&output="+d("nocss="+b.nocss)),void 0!=b.nooldnames&&(c+="&nooldnames="+d(b.nooldnames)),void 0!=b.packages&&(c+="&packages="+d(b.packages)),null!=b.callback&&(c+="&async=2"),void 0!=b.style&&(c+="&style="+d(b.style)),void 0!=b.noexp&&(c+="&noexp=true"),void 0!=b.other_params&&(c+="&"+b.other_params));if(!this.j){google[this.b]&&google[this.b].JSHash&&(c+="&sig="+d(google[this.b].JSHash));
var e=[],f;for(f in this.n)":"==f[n](0)&&e[t](f[A](1));for(f in this.e)":"==f[n](0)&&this.e[f]&&e[t](f[A](1));c+="&have="+d(e[B](","))}return google[z][v]+"/?file="+this.b+"&v="+a+google[z].AdditionalParams+c};U[y].t=function(a){var b=null;a&&(b=a.packages);var c=null;if(b)if("string"==typeof b)c=[a.packages];else if(b[x])for(c=[],a=0;a<b[x];a++)"string"==typeof b[a]&&c[t](b[a][m](/^\s*|\s*$/,"")[C]());c||(c=["default"]);b=[];for(a=0;a<c[x];a++)this.n[":"+c[a]]||b[t](c[a]);return b};
l(U[y],function(a,b){var c=this.t(b),e=b&&null!=b.callback;if(e)var f=new W(b.callback);for(var k=[],p=c[x]-1;0<=p;p--){var s=c[p];e&&f.B(s);if(this.e[":"+s])c.splice(p,1),e&&this.f[":"+s][t](f);else k[t](s)}if(c[x]){b&&b.packages&&(b.packages=c.sort()[B](","));for(p=0;p<k[x];p++)s=k[p],this.f[":"+s]=[],e&&this.f[":"+s][t](f);if(b||null==N[":"+this.b]||null==N[":"+this.b].versions[":"+a]||google[z].AdditionalParams||!this.j)b&&b.autoloaded||google[z].d("script",this.g(a,b),e);else{c=N[":"+this.b];
google[this.b]=google[this.b]||{};for(var R in c.properties)R&&":"==R[n](0)&&(google[this.b][R[A](1)]=c.properties[R]);google[z].d("script",google[z][v]+c.path+c.js,e);c.css&&google[z].d("css",google[z][v]+c.path+c.css,e)}this.j&&(this.j=!1,this.c=(new Date)[q](),1!=this.c%100&&(this.c=-1));for(p=0;p<k[x];p++)s=k[p],this.e[":"+s]=!0}});
U[y].l=function(a){-1!=this.c&&(X("al_"+this.b,"jl."+((new Date)[q]()-this.c),!0),this.c=-1);this.o=this.o.concat(a.components);google[z][this.b]||(google[z][this.b]={});google[z][this.b].packages=this.o.slice(0);for(var b=0;b<a.components[x];b++){this.n[":"+a.components[b]]=!0;this.e[":"+a.components[b]]=!1;var c=this.f[":"+a.components[b]];if(c){for(var e=0;e<c[x];e++)c[e].C(a.components[b]);delete this.f[":"+a.components[b]]}}};U[y].m=function(a,b){return 0==this.t(b)[x]};U[y].s=function(){return!0};
function W(a){this.F=a;this.q={};this.r=0}W[y].B=function(a){this.r++;this.q[":"+a]=!0};W[y].C=function(a){this.q[":"+a]&&(this.q[":"+a]=!1,this.r--,0==this.r&&g[r](this.F,0))};function V(a,b,c){this.name=a;this.D=b;this.p=c;this.u=this.h=!1;this.k=[];google[z].v[this[w]]=G(this.l,this)}F(V,U);l(V[y],function(a,b){var c=b&&null!=b.callback;c?(this.k[t](b.callback),b.callback="google.loader.callbacks."+this[w]):this.h=!0;b&&b.autoloaded||google[z].d("script",this.g(a,b),c)});V[y].m=function(a,b){return b&&null!=b.callback?this.u:this.h};V[y].l=function(){this.u=!0;for(var a=0;a<this.k[x];a++)g[r](this.k[a],0);this.k=[]};
var Y=function(a,b){return a.string?d(a.string)+"="+d(b):a.regex?b[m](/(^.*$)/,a.regex):""};V[y].g=function(a,b){return this.G(this.w(a),a,b)};
V[y].G=function(a,b,c){var e="";a.key&&(e+="&"+Y(a.key,google[z].ApiKey));a.version&&(e+="&"+Y(a.version,b));b=google[z].Secure&&a.ssl?a.ssl:a.uri;if(null!=c)for(var f in c)a.params[f]?e+="&"+Y(a.params[f],c[f]):"other_params"==f?e+="&"+c[f]:"base_domain"==f&&(b="http://"+c[f]+a.uri[A](a.uri[u]("/",7)));google[this[w]]={};-1==b[u]("?")&&e&&(e="?"+e[A](1));return b+e};V[y].s=function(a){return this.w(a).deferred};V[y].w=function(a){if(this.p)for(var b=0;b<this.p[x];++b){var c=this.p[b];if((new RegExp(c.pattern)).test(a))return c}return this.D};function T(a,b){this.b=a;this.i=b;this.h=!1}F(T,U);l(T[y],function(a,b){this.h=!0;google[z].d("script",this.g(a,b),!1)});T[y].m=function(){return this.h};T[y].l=function(){};T[y].g=function(a,b){if(!this.i.versions[":"+a]){if(this.i.aliases){var c=this.i.aliases[":"+a];c&&(a=c)}if(!this.i.versions[":"+a])throw H("Module: '"+this.b+"' with version '"+a+"' not found!");}return google[z].GoogleApisBase+"/libs/"+this.b+"/"+a+"/"+this.i.versions[":"+a][b&&b.uncompressed?"uncompressed":"compressed"]};
T[y].s=function(){return!1};var ca=!1,Z=[],da=(new Date)[q](),fa=function(){ca||(P(g,"unload",ea),ca=!0)},ga=function(a,b){fa();if(!(google[z].Secure||google[z].Options&&!1!==google[z].Options.csi)){for(var c=0;c<a[x];c++)a[c]=d(a[c][C]()[m](/[^a-z0-9_.]+/g,"_"));for(c=0;c<b[x];c++)b[c]=d(b[c][C]()[m](/[^a-z0-9_.]+/g,"_"));g[r](G($,null,"//gg.google.com/csi?s=uds&v=2&action="+a[B](",")+"&it="+b[B](",")),1E4)}},X=function(a,b,c){c?ga([a],[b]):(fa(),Z[t]("r"+Z[x]+"="+d(a+(b?"|"+b:""))),g[r](ea,5<Z[x]?0:15E3))},ea=function(){if(Z[x]){var a=
google[z][v];0==a[u]("http:")&&(a=a[m](/^http:/,"https:"));$(a+"/stats?"+Z[B]("&")+"&nc="+(new Date)[q]()+"_"+((new Date)[q]()-da));Z.length=0}},$=function(a){var b=new Image,c=$.H++;$.A[c]=b;b.onload=b.onerror=function(){delete $.A[c]};b.src=a;b=null};$.A={};$.H=0;I("google.loader.recordCsiStat",ga);I("google.loader.recordStat",X);I("google.loader.createImageForLogging",$);

}) ();google.loader.rm({"specs":[{"name":"books","baseSpec":{"uri":"http://books.google.com/books/api.js","ssl":"https://encrypted.google.com/books/api.js","key":{"string":"key"},"version":{"string":"v"},"deferred":true,"params":{"callback":{"string":"callback"},"language":{"string":"hl"}}}},"feeds",{"name":"friendconnect","baseSpec":{"uri":"http://www.google.com/friendconnect/script/friendconnect.js","ssl":"https://www.google.com/friendconnect/script/friendconnect.js","key":{"string":"key"},"version":{"string":"v"},"deferred":false,"params":{}}},"spreadsheets","identitytoolkit","gdata","ima","visualization",{"name":"sharing","baseSpec":{"uri":"http://www.google.com/s2/sharing/js","ssl":null,"key":{"string":"key"},"version":{"string":"v"},"deferred":false,"params":{"language":{"string":"hl"}}}},{"name":"maps","baseSpec":{"uri":"http://maps.google.com/maps?file\u003dgoogleapi","ssl":"https://maps-api-ssl.google.com/maps?file\u003dgoogleapi","key":{"string":"key"},"version":{"string":"v"},"deferred":true,"params":{"callback":{"regex":"callback\u003d$1\u0026async\u003d2"},"language":{"string":"hl"}}},"customSpecs":[{"uri":"http://maps.googleapis.com/maps/api/js","ssl":"https://maps.googleapis.com/maps/api/js","version":{"string":"v"},"deferred":true,"params":{"callback":{"string":"callback"},"language":{"string":"hl"}},"pattern":"^(3|3..*)$"}]},"search","annotations_v2","payments","wave","orkut",{"name":"annotations","baseSpec":{"uri":"http://www.google.com/reviews/scripts/annotations_bootstrap.js","ssl":null,"key":{"string":"key"},"version":{"string":"v"},"deferred":true,"params":{"callback":{"string":"callback"},"language":{"string":"hl"},"country":{"string":"gl"}}}},"language","earth","picker","ads","elements"]});
google.loader.rfm({":search":{"versions":{":1":"1",":1.0":"1"},"path":"/api/search/1.0/23952f7483f1bca4119a89c020d13def/","js":"default+ja.I.js","css":"default+ja.css","properties":{":JSHash":"23952f7483f1bca4119a89c020d13def",":NoOldNames":false,":Version":"1.0"}},":language":{"versions":{":1":"1",":1.0":"1"},"path":"/api/language/1.0/7b15944f20c0d2d7b2d2d87406a8916b/","js":"default+ja.I.js","properties":{":JSHash":"7b15944f20c0d2d7b2d2d87406a8916b",":Version":"1.0"}},":feeds":{"versions":{":1":"1",":1.0":"1"},"path":"/api/feeds/1.0/482f2817cdf8982edf2e5669f9e3a627/","js":"default+ja.I.js","css":"default+ja.css","properties":{":JSHash":"482f2817cdf8982edf2e5669f9e3a627",":Version":"1.0"}},":spreadsheets":{"versions":{":0":"1",":0.4":"1"},"path":"/api/spreadsheets/0.4/87ff7219e9f8a8164006cbf28d5e911a/","js":"default.I.js","properties":{":JSHash":"87ff7219e9f8a8164006cbf28d5e911a",":Version":"0.4"}},":ima":{"versions":{":3":"1",":3.0":"1"},"path":"/api/ima/3.0/28a914332232c9a8ac0ae8da68b1006e/","js":"default.I.js","properties":{":JSHash":"28a914332232c9a8ac0ae8da68b1006e",":Version":"3.0"}},":wave":{"versions":{":1":"1",":1.0":"1"},"path":"/api/wave/1.0/3b6f7573ff78da6602dda5e09c9025bf/","js":"default.I.js","properties":{":JSHash":"3b6f7573ff78da6602dda5e09c9025bf",":Version":"1.0"}},":annotations":{"versions":{":1":"1",":1.0":"1"},"path":"/api/annotations/1.0/ee29f1a32c343fea662c6e1b58ec6d0d/","js":"default+ja.I.js","properties":{":JSHash":"ee29f1a32c343fea662c6e1b58ec6d0d",":Version":"1.0"}},":earth":{"versions":{":1":"1",":1.0":"1"},"path":"/api/earth/1.0/db22e5693e0a8de1f62f3536f5a8d7d3/","js":"default.I.js","properties":{":JSHash":"db22e5693e0a8de1f62f3536f5a8d7d3",":Version":"1.0"}},":picker":{"versions":{":1":"1",":1.0":"1"},"path":"/api/picker/1.0/1c635e91b9d0c082c660a42091913907/","js":"default.I.js","css":"default.css","properties":{":JSHash":"1c635e91b9d0c082c660a42091913907",":Version":"1.0"}}});
google.loader.rpl({":scriptaculous":{"versions":{":1.8.3":{"uncompressed":"scriptaculous.js","compressed":"scriptaculous.js"},":1.9.0":{"uncompressed":"scriptaculous.js","compressed":"scriptaculous.js"},":1.8.2":{"uncompressed":"scriptaculous.js","compressed":"scriptaculous.js"},":1.8.1":{"uncompressed":"scriptaculous.js","compressed":"scriptaculous.js"}},"aliases":{":1.8":"1.8.3",":1":"1.9.0",":1.9":"1.9.0"}},":yui":{"versions":{":2.6.0":{"uncompressed":"build/yuiloader/yuiloader.js","compressed":"build/yuiloader/yuiloader-min.js"},":2.9.0":{"uncompressed":"build/yuiloader/yuiloader.js","compressed":"build/yuiloader/yuiloader-min.js"},":2.7.0":{"uncompressed":"build/yuiloader/yuiloader.js","compressed":"build/yuiloader/yuiloader-min.js"},":2.8.0r4":{"uncompressed":"build/yuiloader/yuiloader.js","compressed":"build/yuiloader/yuiloader-min.js"},":2.8.2r1":{"uncompressed":"build/yuiloader/yuiloader.js","compressed":"build/yuiloader/yuiloader-min.js"},":2.8.1":{"uncompressed":"build/yuiloader/yuiloader.js","compressed":"build/yuiloader/yuiloader-min.js"},":3.3.0":{"uncompressed":"build/yui/yui.js","compressed":"build/yui/yui-min.js"}},"aliases":{":3":"3.3.0",":2":"2.9.0",":2.7":"2.7.0",":2.8.2":"2.8.2r1",":2.6":"2.6.0",":2.9":"2.9.0",":2.8":"2.8.2r1",":2.8.0":"2.8.0r4",":3.3":"3.3.0"}},":swfobject":{"versions":{":2.1":{"uncompressed":"swfobject_src.js","compressed":"swfobject.js"},":2.2":{"uncompressed":"swfobject_src.js","compressed":"swfobject.js"}},"aliases":{":2":"2.2"}},":webfont":{"versions":{":1.0.28":{"uncompressed":"webfont_debug.js","compressed":"webfont.js"},":1.0.27":{"uncompressed":"webfont_debug.js","compressed":"webfont.js"},":1.0.29":{"uncompressed":"webfont_debug.js","compressed":"webfont.js"},":1.0.12":{"uncompressed":"webfont_debug.js","compressed":"webfont.js"},":1.0.13":{"uncompressed":"webfont_debug.js","compressed":"webfont.js"},":1.0.14":{"uncompressed":"webfont_debug.js","compressed":"webfont.js"},":1.0.15":{"uncompressed":"webfont_debug.js","compressed":"webfont.js"},":1.0.10":{"uncompressed":"webfont_debug.js","compressed":"webfont.js"},":1.0.11":{"uncompressed":"webfont_debug.js","compressed":"webfont.js"},":1.0.2":{"uncompressed":"webfont_debug.js","compressed":"webfont.js"},":1.0.1":{"uncompressed":"webfont_debug.js","compressed":"webfont.js"},":1.0.0":{"uncompressed":"webfont_debug.js","compressed":"webfont.js"},":1.0.6":{"uncompressed":"webfont_debug.js","compressed":"webfont.js"},":1.0.19":{"uncompressed":"webfont_debug.js","compressed":"webfont.js"},":1.0.5":{"uncompressed":"webfont_debug.js","compressed":"webfont.js"},":1.0.18":{"uncompressed":"webfont_debug.js","compressed":"webfont.js"},":1.0.4":{"uncompressed":"webfont_debug.js","compressed":"webfont.js"},":1.0.17":{"uncompressed":"webfont_debug.js","compressed":"webfont.js"},":1.0.16":{"uncompressed":"webfont_debug.js","compressed":"webfont.js"},":1.0.3":{"uncompressed":"webfont_debug.js","compressed":"webfont.js"},":1.0.9":{"uncompressed":"webfont_debug.js","compressed":"webfont.js"},":1.0.21":{"uncompressed":"webfont_debug.js","compressed":"webfont.js"},":1.0.22":{"uncompressed":"webfont_debug.js","compressed":"webfont.js"},":1.0.25":{"uncompressed":"webfont_debug.js","compressed":"webfont.js"},":1.0.26":{"uncompressed":"webfont_debug.js","compressed":"webfont.js"},":1.0.23":{"uncompressed":"webfont_debug.js","compressed":"webfont.js"},":1.0.24":{"uncompressed":"webfont_debug.js","compressed":"webfont.js"}},"aliases":{":1":"1.0.29",":1.0":"1.0.29"}},":ext-core":{"versions":{":3.1.0":{"uncompressed":"ext-core-debug.js","compressed":"ext-core.js"},":3.0.0":{"uncompressed":"ext-core-debug.js","compressed":"ext-core.js"}},"aliases":{":3":"3.1.0",":3.0":"3.0.0",":3.1":"3.1.0"}},":mootools":{"versions":{":1.3.1":{"uncompressed":"mootools.js","compressed":"mootools-yui-compressed.js"},":1.1.1":{"uncompressed":"mootools.js","compressed":"mootools-yui-compressed.js"},":1.3.0":{"uncompressed":"mootools.js","compressed":"mootools-yui-compressed.js"},":1.3.2":{"uncompressed":"mootools.js","compressed":"mootools-yui-compressed.js"},":1.1.2":{"uncompressed":"mootools.js","compressed":"mootools-yui-compressed.js"},":1.2.3":{"uncompressed":"mootools.js","compressed":"mootools-yui-compressed.js"},":1.2.4":{"uncompressed":"mootools.js","compressed":"mootools-yui-compressed.js"},":1.2.1":{"uncompressed":"mootools.js","compressed":"mootools-yui-compressed.js"},":1.2.2":{"uncompressed":"mootools.js","compressed":"mootools-yui-compressed.js"},":1.2.5":{"uncompressed":"mootools.js","compressed":"mootools-yui-compressed.js"},":1.4.0":{"uncompressed":"mootools.js","compressed":"mootools-yui-compressed.js"},":1.4.1":{"uncompressed":"mootools.js","compressed":"mootools-yui-compressed.js"},":1.4.2":{"uncompressed":"mootools.js","compressed":"mootools-yui-compressed.js"}},"aliases":{":1":"1.1.2",":1.11":"1.1.1",":1.4":"1.4.2",":1.3":"1.3.2",":1.2":"1.2.5",":1.1":"1.1.2"}},":jqueryui":{"versions":{":1.6.0":{"uncompressed":"jquery-ui.js","compressed":"jquery-ui.min.js"},":1.8.0":{"uncompressed":"jquery-ui.js","compressed":"jquery-ui.min.js"},":1.8.2":{"uncompressed":"jquery-ui.js","compressed":"jquery-ui.min.js"},":1.8.1":{"uncompressed":"jquery-ui.js","compressed":"jquery-ui.min.js"},":1.8.9":{"uncompressed":"jquery-ui.js","compressed":"jquery-ui.min.js"},":1.8.15":{"uncompressed":"jquery-ui.js","compressed":"jquery-ui.min.js"},":1.8.14":{"uncompressed":"jquery-ui.js","compressed":"jquery-ui.min.js"},":1.8.7":{"uncompressed":"jquery-ui.js","compressed":"jquery-ui.min.js"},":1.8.13":{"uncompressed":"jquery-ui.js","compressed":"jquery-ui.min.js"},":1.8.8":{"uncompressed":"jquery-ui.js","compressed":"jquery-ui.min.js"},":1.8.12":{"uncompressed":"jquery-ui.js","compressed":"jquery-ui.min.js"},":1.7.2":{"uncompressed":"jquery-ui.js","compressed":"jquery-ui.min.js"},":1.8.5":{"uncompressed":"jquery-ui.js","compressed":"jquery-ui.min.js"},":1.8.11":{"uncompressed":"jquery-ui.js","compressed":"jquery-ui.min.js"},":1.7.3":{"uncompressed":"jquery-ui.js","compressed":"jquery-ui.min.js"},":1.8.10":{"uncompressed":"jquery-ui.js","compressed":"jquery-ui.min.js"},":1.8.6":{"uncompressed":"jquery-ui.js","compressed":"jquery-ui.min.js"},":1.7.0":{"uncompressed":"jquery-ui.js","compressed":"jquery-ui.min.js"},":1.7.1":{"uncompressed":"jquery-ui.js","compressed":"jquery-ui.min.js"},":1.8.4":{"uncompressed":"jquery-ui.js","compressed":"jquery-ui.min.js"},":1.5.3":{"uncompressed":"jquery-ui.js","compressed":"jquery-ui.min.js"},":1.5.2":{"uncompressed":"jquery-ui.js","compressed":"jquery-ui.min.js"},":1.8.17":{"uncompressed":"jquery-ui.js","compressed":"jquery-ui.min.js"},":1.8.16":{"uncompressed":"jquery-ui.js","compressed":"jquery-ui.min.js"}},"aliases":{":1.8":"1.8.17",":1.7":"1.7.3",":1.6":"1.6.0",":1":"1.8.17",":1.5":"1.5.3",":1.8.3":"1.8.4"}},":chrome-frame":{"versions":{":1.0.2":{"uncompressed":"CFInstall.js","compressed":"CFInstall.min.js"},":1.0.1":{"uncompressed":"CFInstall.js","compressed":"CFInstall.min.js"},":1.0.0":{"uncompressed":"CFInstall.js","compressed":"CFInstall.min.js"}},"aliases":{":1":"1.0.2",":1.0":"1.0.2"}},":dojo":{"versions":{":1.3.1":{"uncompressed":"dojo/dojo.xd.js.uncompressed.js","compressed":"dojo/dojo.xd.js"},":1.6.1":{"uncompressed":"dojo/dojo.xd.js.uncompressed.js","compressed":"dojo/dojo.xd.js"},":1.3.0":{"uncompressed":"dojo/dojo.xd.js.uncompressed.js","compressed":"dojo/dojo.xd.js"},":1.1.1":{"uncompressed":"dojo/dojo.xd.js.uncompressed.js","compressed":"dojo/dojo.xd.js"},":1.3.2":{"uncompressed":"dojo/dojo.xd.js.uncompressed.js","compressed":"dojo/dojo.xd.js"},":1.6.0":{"uncompressed":"dojo/dojo.xd.js.uncompressed.js","compressed":"dojo/dojo.xd.js"},":1.2.3":{"uncompressed":"dojo/dojo.xd.js.uncompressed.js","compressed":"dojo/dojo.xd.js"},":1.7.2":{"uncompressed":"dojo/dojo.js.uncompressed.js","compressed":"dojo/dojo.js"},":1.7.0":{"uncompressed":"dojo/dojo.js.uncompressed.js","compressed":"dojo/dojo.js"},":1.7.1":{"uncompressed":"dojo/dojo.js.uncompressed.js","compressed":"dojo/dojo.js"},":1.4.3":{"uncompressed":"dojo/dojo.xd.js.uncompressed.js","compressed":"dojo/dojo.xd.js"},":1.5.1":{"uncompressed":"dojo/dojo.xd.js.uncompressed.js","compressed":"dojo/dojo.xd.js"},":1.5.0":{"uncompressed":"dojo/dojo.xd.js.uncompressed.js","compressed":"dojo/dojo.xd.js"},":1.2.0":{"uncompressed":"dojo/dojo.xd.js.uncompressed.js","compressed":"dojo/dojo.xd.js"},":1.4.0":{"uncompressed":"dojo/dojo.xd.js.uncompressed.js","compressed":"dojo/dojo.xd.js"},":1.4.1":{"uncompressed":"dojo/dojo.xd.js.uncompressed.js","compressed":"dojo/dojo.xd.js"}},"aliases":{":1.7":"1.7.2",":1":"1.6.1",":1.6":"1.6.1",":1.5":"1.5.1",":1.4":"1.4.3",":1.3":"1.3.2",":1.2":"1.2.3",":1.1":"1.1.1"}},":prototype":{"versions":{":1.7.0.0":{"uncompressed":"prototype.js","compressed":"prototype.js"},":1.6.0.2":{"uncompressed":"prototype.js","compressed":"prototype.js"},":1.6.1.0":{"uncompressed":"prototype.js","compressed":"prototype.js"},":1.6.0.3":{"uncompressed":"prototype.js","compressed":"prototype.js"}},"aliases":{":1.7":"1.7.0.0",":1.6.1":"1.6.1.0",":1":"1.7.0.0",":1.6":"1.6.1.0",":1.7.0":"1.7.0.0",":1.6.0":"1.6.0.3"}},":jquery":{"versions":{":1.6.2":{"uncompressed":"jquery.js","compressed":"jquery.min.js"},":1.3.1":{"uncompressed":"jquery.js","compressed":"jquery.min.js"},":1.6.1":{"uncompressed":"jquery.js","compressed":"jquery.min.js"},":1.3.0":{"uncompressed":"jquery.js","compressed":"jquery.min.js"},":1.6.4":{"uncompressed":"jquery.js","compressed":"jquery.min.js"},":1.6.3":{"uncompressed":"jquery.js","compressed":"jquery.min.js"},":1.3.2":{"uncompressed":"jquery.js","compressed":"jquery.min.js"},":1.6.0":{"uncompressed":"jquery.js","compressed":"jquery.min.js"},":1.2.3":{"uncompressed":"jquery.js","compressed":"jquery.min.js"},":1.7.0":{"uncompressed":"jquery.js","compressed":"jquery.min.js"},":1.7.1":{"uncompressed":"jquery.js","compressed":"jquery.min.js"},":1.2.6":{"uncompressed":"jquery.js","compressed":"jquery.min.js"},":1.4.3":{"uncompressed":"jquery.js","compressed":"jquery.min.js"},":1.4.4":{"uncompressed":"jquery.js","compressed":"jquery.min.js"},":1.5.1":{"uncompressed":"jquery.js","compressed":"jquery.min.js"},":1.5.0":{"uncompressed":"jquery.js","compressed":"jquery.min.js"},":1.4.0":{"uncompressed":"jquery.js","compressed":"jquery.min.js"},":1.5.2":{"uncompressed":"jquery.js","compressed":"jquery.min.js"},":1.4.1":{"uncompressed":"jquery.js","compressed":"jquery.min.js"},":1.4.2":{"uncompressed":"jquery.js","compressed":"jquery.min.js"}},"aliases":{":1.7":"1.7.1",":1.6":"1.6.4",":1":"1.7.1",":1.5":"1.5.2",":1.4":"1.4.4",":1.3":"1.3.2",":1.2":"1.2.6"}}});
}
;
/**
 * MicroEngine MailForm
 * http://microengine.jp/mailform/
 *
 * Copyright 2014, MicroEngine Inc. (http://microengine.jp)
 *
 * @copyright Copyright (C) 2014 MicroEngine Inc.
 * @version 1.0.0
 */

var memf = {};

(function ($) {

var lastZipcode = '';

memf.zipAddr = function (zip1, zip2, pref, city, town, st) {
    var zipcode = $('[name=' + zip1 + ']').val().replace(/-/, '');
    if (zip2) {
        zipcode += $('[name=' + zip2 + ']').val();
    }
    if (zipcode.length === 7 && lastZipcode !== zipcode) {
        $.ajax({
            type: 'GET',
            url: window.location.pathname + '?zipcode=' + zipcode,
            dataType: 'json',
            success: function (json) {
                if (!json) {
                    return;
                }
                var str = '';
                (function(obj){
                    for (var i in obj) {
                        if (json[i]) {
                            str = json[i] + str;
                        }
                        if (obj[i]) {
                            $('[name=' + obj[i] + ']').val(str);
                            str = '';
                        }
                    }
                })({st: st, town:town, city:city, pref:pref});
            }
        });
        lastZipcode = zipcode;
    }
};

})(jQuery);

$(function(){
  $('#imagepanel_top_inner').bxSlider({
    auto: true,
    pause: 5000,
    controls: false
  });
});

$(function(){
  $("#interviews nav li").on("click", function(){
    $(this).parent().find("li").removeClass("active");
    $(this).addClass("active");
    var target = $(this).attr("id") + "_area";
    $(this).parents(".interview").find(".screen").removeClass("active");
    $(this).parents(".interview").find("."+target).addClass("active");
  });
});
/*
$(function(){
  $("#image_gallery li img").each(function(){
    $(this).next("span").html($(this).attr("alt"));
  })
});
*/

;
