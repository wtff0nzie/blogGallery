;(function (selector, undefined) {
    'use strict';

    var doc = document,
        docEl = doc.documentElement,
        currentPane = 0,
        body = doc.body,
        paneCount = 0,
        win = window,
        frameWidth,
        playTimer,
        blogArea,
        navRight,
        navLeft,
        gallery,
        nuImgs,
        rail,
        css,
        UA;


    if (!doc.querySelector || !Array.isArray || !Object.keys || docEl.className.indexOf('bpModule-_backpage') > -1) {
        return;
    }


    // CSS / JS helpers
    UA = (function () {
        var styles = win.getComputedStyle(docEl, ''),
            pre = ([].slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']))[1],
            dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1],
            nv = win.navigator,
            rx,
            ie;

        if (pre === 'ms') {
            rx = new RegExp('MSIE ([0-9]{1,}[\.0-9]{0,})');
            rx.exec(nv.userAgent);
            ie = parseFloat(RegExp.$1);
        }

        return {
            css         : '-' + pre + '-',
            dom         : dom,
            lowercase   : pre,
            ie          : !!ie,
            js          : pre[0].toUpperCase() + pre.substr(1),
            platform    : nv.platform.toLowerCase(),
            touch       : ('ontouchstart' in docEl || 'onmsgesturechange' in win) ? true : false
        };
    }());


    // Lightweight queryselector
    var q$ = function (selector, context) {
        if (typeof selector === 'string') {
            return [].slice.call((context || doc).querySelectorAll(selector));
        }
        return [selector];
    };


    // Discover dimensions / placement of element
    var offset = function (el) {
        var r = el.getBoundingClientRect();

        return {
            left    : (r.left + (body.scrollLeft || docEl.scrollLeft)),
            top     : (r.top + (body.scrollTop || docEl.scrollTop)),
            width   : (r.right - r.left),
            height  : (r.bottom - r.top)
        };
    };


    // Update navigation to reflect current state
    var navState = function () {
        if (currentPane === 0) {
            navLeft.style.display = 'none';
        } else {
            navLeft.style.display = 'block';
        }

        if (currentPane === (paneCount - 1)) {
            navRight.style.display = 'none';
        } else {
            navRight.style.display = 'block';
        }
    };


    // Slide from image to image
    var navTo = function (paneIndex) {
        var width = frameWidth;

        currentPane = paneIndex;

        if (currentPane < 0) {
            currentPane = 0;
        } else if (currentPane > (paneCount - 1)) {
            currentPane = (paneCount - 1);
        }

        setTimeout(function () {
            var transform = ('translate3d(-' + (currentPane * width) + 'px,0,0)');

            rail.style[UA.js + 'Transform3d'] = transform + ',0,0';
            rail.style.transform = transform;
        }, 9);

        navState();
    };


    // Add an image to slider
    var addImage = function (img) {
        if (offset(img).width > 200) {
            // Kill smaller images here
        }
    };


    // Auto play
    var play = function () {
        currentPane++;

        if (currentPane === paneCount) {
            currentPane = 0;
        }
        navTo(currentPane);
    };

    var initPlayTimer = function () {
        playTimer = setInterval(play, 3 * 1000);
    };


    blogArea = q$(selector)[0];

    if (!blogArea) {
        return;
    }


    // Widget styles
    css = doc.createElement('style');
    css.innerHTML = '.smlImageGallery,.smlImageGallery div{-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;margin:0;padding:0}.smlImageGallery{clear:both;height:300px;overflow:hidden;position:relative;width:500px;will-change:opacity}.smlImageGallery.live{opacity:1}.smlImageGallery>.imageRail{height:100%;width:1000%;will-change:transform,-webkit-transform;-webkit-transition:.3s;-moz-transition:.3s;transition:.3s}.smlImageGallery>.imageRail>div{background:center center no-repeat;-webkit-background-size:cover;-moz-background-size:cover;-o-background-size:cover;background-size:cover;height:100%;float:left;width:10%}.smlImageGallery>.imageRail>div>img{left:0;min-height:100%;position:absolute;width:100%;top:0}.smlImageGallery>.galNav{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAABgCAMAAACzHHtdAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAASUExURQAAAEFAQkFAQkFAQkFAQkFAQm97d0oAAAAGdFJOUwD6H1vPmy8OSLgAAAB6SURBVHja7dU5CsBADENReZn7XzmlWxkEziROrWL4zxDQXzSmdtipmzk/DXaa9BTJP/Z0psnXSmenrVq+BjcZ8GHvMvA1WINxA77W7w3AGwCWgLpXkalPoU5Mna045Mx1PvrM6GZekwGTscwXmmBNXmayvwhB5m+axANEMANYTrUKJgAAAABJRU5ErkJggg==)center center no-repeat;cursor:pointer;height:96px;height:100%;left:0;opacity:0;padding:20px;position:absolute;width:43px;top:0;z-index:3}.smlImageGallery:hover .galNav{opacity:1}.galNav:hover{background-color:rgba(255,255,255,.7)}.smlImageGallery>.galNavRight{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAABgCAMAAACzHHtdAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAVUExURQAAAEFAQkFAQkFAQkFAQkFAQkFAQjwWHqAAAAAHdFJOUwD6zxGbMmAzCf3vAAAAeElEQVR42u3UKRIAQQhDUcJ2/yOPHZkIRHeD/iqvCrM2+hJFtwUhbiCE2Pk44SbEyccuxOFoPoYQF9bkJRM/zSTW5CGTGjPpMZPU4lyTn4nym5XdBvCaSIUV9DR4iHAlzZlh2bTX4CwD3Ghga3CxQdxo4HcaWPHpB1x5A+/aEry2AAAAAElFTkSuQmCC);left:auto;right:0}.galNav,.smlImageGallery{-webkit-transition:.15s;-moz-transition:.15s;transition:.15s}@media(max-width:767px){.smlImageGallery{height:500px;width:100%}.galNav:hover{background-color:transparent}}';
    doc.body.appendChild(css);


    gallery = doc.createElement('div');
    gallery.className = 'smlImageGallery';

    gallery.onmouseover = function () {
        clearInterval(playTimer);
    };

    gallery.ontouchstart = function () {
        clearInterval(playTimer);
    };

    gallery.onmouseleave = function () {
        initPlayTimer();
    };

    gallery.ontouchend = function () {
        initPlayTimer();
    };

    rail = doc.createElement('div');
    rail.className = 'imageRail';

    navRight = doc.createElement('div');
    navLeft = doc.createElement('div');

    navRight.className = 'galNav galNavRight';
    navLeft.className = 'galNav galNavLeft';

    navRight.onclick = function () {
        navTo(currentPane + 1);
    };

    navLeft.onclick = function () {
        navTo(currentPane - 1);
    };


    // Append elements
    gallery.appendChild(navRight);
    gallery.appendChild(navLeft);
    gallery.appendChild(rail);
    blogArea.insertBefore(gallery, blogArea.firstChild);

    frameWidth = offset(gallery).width;

    // Add images
    nuImgs = q$('img', blogArea);

    nuImgs.forEach(function (img) {
        var div = doc.createElement('div');

        img.style.display = 'none';

        div.style.backgroundImage = 'url(' + img.src + ')';
        div.style.width = frameWidth + 'px';
        div.setAttribute('data-img', img.src);

        paneCount++;

        rail.appendChild(div);
        rail.style.width = (paneCount * frameWidth) + 'px';

        img.addEventListener('load', function () {
            addImage(this);
        });
    });


    // Start the show
    navState();
    initPlayTimer();
    gallery.classList.add('live');


    // Mobile nav
    (function (o) {
        var xDiff,
            yDiff,
            xUp,
            yUp,
            X,
            Y;

        var handleTouchStart = function (evt) {
            var t = evt.touches[0];

            X = t.clientX;
            Y = t.clientY;
        };

        var handleTouchMove = function (evt) {
            if (!X || !Y) {
                return;
            }

            xUp = evt.touches[0].clientX;
            yUp = evt.touches[0].clientY;

            xDiff = X - xUp;
            yDiff = Y - yUp;

            if (Math.abs(xDiff) > Math.abs(yDiff)) {
                if (xDiff > 0) {
                    if (o.swipeLeft) {
                        o.swipeLeft(evt);
                    }
                } else {
                    if (o.swipeRight) {
                        o.swipeRight(evt);
                    }
                }
            } else {
                if (yDiff > 0) {
                    if (o.swipeUp) {
                        o.swipeUp(evt);
                    }
                } else {
                    if (o.swipeDown) {
                        o.swipeDown(evt);
                    }
                }
            }

            X = null;
            Y = null;
        };

        gallery.addEventListener('touchstart', handleTouchStart, false);
        gallery.addEventListener('touchmove', handleTouchMove, false);
    }({
        swipeLeft: function () {
            navRight.click();
        },
        swipeRight: function () {
            navLeft.click();
        }
    }));
}('body'));