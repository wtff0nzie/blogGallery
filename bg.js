;(function (win, doc, undefined) {
    var docEl = doc.document,
        body = doc.body,
        nuImgs = [],
        blogArea,
        navRight,
        navLeft,
        gallery,
        rail;


    if (!doc.querySelector || !Array.isArray || !Object.keys) {
        return;
    }


    var q$ = function (selector, context) {
        if (typeof selector === 'string') {
            return [].slice.call((context || doc).querySelectorAll(selector));
        }
        return [selector];
    };


    var offset = function (el) {
        var r = el.getBoundingClientRect();

        return {
            left    : (r.left + (body.scrollLeft || docEl.scrollLeft)),
            top     : (r.top + (body.scrollTop || docEl.scrollTop)),
            width   : (r.right - r.left),
            height  : (r.bottom - r.top)
        };
    };


    blogArea = q$('.bpModule-blog-post .hfeed.post')[0];

    if (!blogArea) {
        return;
    }

    gallery = doc.createElement('div');
    gallery.className = 'imageGallery';

    rail = doc.createElement('div');
    rail.className = 'imageRail';

    gallery.appendChild(rail);
    blogArea.insertBefore(gallery, blogArea.firstChild);

    q$('img', blogArea).forEach(function (img) {
        if (offset(el).width > 200) {
            nuImgs.push(img.src);
            img.style.display = 'none';
        }
    });

    nuImgs.forEach(function (src) {
        var img = new Image();

        img.onload = function () {
            rail.appendChild(img);
        };

        img.src = src;
    });

}(window, document));