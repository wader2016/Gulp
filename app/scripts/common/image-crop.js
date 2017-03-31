var ImageCrop = function () {

    var cropParam = {
        origPicSize: { width: 0, height: 0 },
        CropPicParam: { x1: 0, y1: 0, x2: 400, y2: 400, w: 400, h: 400 },
        OImage: { w: 400, h: 400 },

        PSize: { width: 175, height: 175 },
        x: 0,
        y: 0,
        w: 0,
        h: 0



    };

    var APi_Methods;

    var _PreviewUpdateCall;

    var _UpdatePreview;

    var demo3 = function () {
        // Create variables (in this scope) to hold the API and image size
        var jcrop_api,
            boundx,
            boundy,
            leftx,
            lefty,
            rightx,
            righty,

        // Grab some information about the preview pane
            $preview = $('#preview-pane'),
            $pcnt = $('#preview-pane .preview-container'),
            $pimg = $('#preview-pane .preview-container img'),

            xsize = $pcnt.width(),
            ysize = $pcnt.height();
        cropParam.PSize.width = xsize;
        cropParam.PSize.height = ysize;

        // console.log('init',[xsize,ysize]);

        $('#avatarPicInput').Jcrop({
            onChange: updatePreview,
            onSelect: updatePreview,
            aspectRatio: xsize / ysize,
            //  boxWidth: 450, boxHeight: 400,
        }, function () {
            // Use the API to get the real image size
            var bounds = this.getBounds();
            boundx = bounds[0];
            boundy = bounds[1];
            cropParam.origPicSize.width = boundx;
            cropParam.origPicSize.height = boundy;
            // Store the API in the jcrop_api variable
            jcrop_api = this;
            APi_Methods = this;

            jcrop_api.setSelect([50, 50, 180, 180]);
            // Move the preview into the jcrop container for css positioning
            $preview.appendTo(jcrop_api.ui.holder);
        });

        function updatePreview(c) {
            cropParam.CropPicParam = c;
            if (parseInt(c.w) > 0) {
                var rx = xsize / c.w;
                var ry = ysize / c.h;
                // console.log('filecrop'+c);

                var w1 = Math.round(rx * boundx);
                var h1 = Math.round(ry * boundy);
                var shiftx = Math.round(rx * c.x);
                var shifty = Math.round(ry * c.y);
                cropParam.OImage.w = w1;
                cropParam.OImage.h = h1;
                cropParam.w = xsize;
                cropParam.h = ysize;
                cropParam.x = shiftx;
                cropParam.y = shifty;
                //console.log("w1:"+w1+"  h1:"+h1);

                $pimg.css({
                    width: w1 + 'px',
                    height: h1 + 'px',
                    marginLeft: '-' + shiftx + 'px',
                    marginTop: '-' + shifty + 'px'
                });


                if (_PreviewUpdateCall) {
                    _PreviewUpdateCall(cropParam);
                }
            }
        };

        _UpdatePreview = updatePreview;
    }

    var resetPreview = function () {
        $pcnt = $('#preview-pane .preview-container');
        $pimg = $('#preview-pane .preview-container img');

        xsize = $pcnt.width();
        ysize = $pcnt.height();

        cropParam.OImage.w = xsize;
        cropParam.OImage.h = ysize;
        cropParam.w = xsize;
        cropParam.h = ysize;
        cropParam.x = 0;
        cropParam.y = 0;

        $pimg.css({
            width: xsize + 'px',
            height: ysize + 'px',
            marginLeft: '0',
            marginTop: '0'
        });

        if (_PreviewUpdateCall) {
            _PreviewUpdateCall(cropParam);
        }
    }


    var handleResponsive = function () {
        if ($(window).width() <= 1024 && $(window).width() >= 678) {
            $('.responsive-1024').each(function () {
                $(this).attr("data-class", $(this).attr("class"));
                $(this).attr("class", 'responsive-1024 col-md-12');
            });
        } else {
            $('.responsive-1024').each(function () {
                if ($(this).attr("data-class")) {
                    $(this).attr("class", $(this).attr("data-class"));
                    $(this).removeAttr("data-class");
                }
            });
        }
    }

    return {
        //main function to initiate the module
        init: function (PreviewUpdateCall) {

            if (!jQuery().Jcrop) {
                return;
            }
            _PreviewUpdateCall = PreviewUpdateCall;
            Metronic.addResizeHandler(handleResponsive);
            handleResponsive();
            demo3();
        },
        CropParam: function () { return cropParam },
        Api: function () { return APi_Methods; },
        ResetPreview: function () { return resetPreview() },
        UpdatePreview: function (e) { return _UpdatePreview(e) }

    };

}();