
// Route State Load Spinner(used on page or content load)

MetronicApp.directive('ngSpinnerBar', ['$rootScope',
    function($rootScope) {
        return {
            link: function(scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function() {
                    element.removeClass('hide'); // show spinner bar
                    Layout.closeMainMenu();
                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function() {
                    element.addClass('hide'); // hide spinner bar
                    $('body').removeClass('page-on-load'); // remove page loading indicator
                    Layout.setMainMenuActiveLink('match'); // activate selected link in the sidebar menu

                    // auto scorll to page top
                    setTimeout(function () {
                        Metronic.scrollTop(); // scroll to the top on content load
                    }, $rootScope.settings.layout.pageAutoScrollOnLoad);
                });

                // handle errors
                $rootScope.$on('$stateNotFound', function() {
                    element.addClass('hide'); // hide spinner bar
                });

                // handle errors
                $rootScope.$on('$stateChangeError', function() {
                    element.addClass('hide'); // hide spinner bar
                });
            }
        };
    }
]);

// Handle global LINK click
MetronicApp.directive('a',
    function() {
        return {
            restrict: 'E',
            link: function(scope, elem, attrs) {
                if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                    elem.on('click', function(e) {
                        e.preventDefault(); // prevent link click for above criteria
                    });
                }
            }
        };
    });

MetronicApp.directive('diHref', ['$location', '$route',
    function($location, $route) {
        return function(scope, element, attrs) {
            scope.$watch('diHref', function() {
                if(attrs.diHref) {
                    element.attr('href', attrs.diHref);
                    element.bind('click', function(event) {
                        scope.$apply(function(){
                            if($location.path() == attrs.diHref) $route.reload();
                        });
                    });
                }
            });
        }
    }]);

MetronicApp.directive('customOnChange', function() {
    return {
        restrict: 'AE',
        link: function (scope, element, attrs) {
            var onChangeHandler = scope.$eval(attrs.customOnChange);
            element.bind('change', onChangeHandler);
        }
    };
});

MetronicApp.directive('fileUpload2', function($log, $parse,staticFileServer) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var options = $parse(attrs.fileUpload2)(scope) || {};
            element.fileupload({
                dataType: 'json',
                url: staticFileServer,
                autoUpload:options.autoUpload,
                limitMultiFileUploads:100,
                maxNumberOfFiles:100,
                singleFileUploads:false,
                add:function(e,data){
                    if (e.isDefaultPrevented()) {
                        return false;
                    }
                    scope.$emit('AddFile',data);
                    if (data.autoUpload || (data.autoUpload !== false &&
                        $(this).fileupload('option', 'autoUpload'))) {
                        data.process().done(function () {
                            data.submit();
                        });
                    }else{
                        $('#UploadFileSubmit').unbind('click');

                        $('#UploadFileSubmit').bind('click',function(){
                            options = $parse(attrs.fileUpload2)(scope) || {};
                            data.submit();
                        })
                    }
                },
                done: function(e, data) {
                    scope.$emit('FileDone',data);
                },
                fail: function(e, data) {
                    scope.$emit('FileFail',data);
                },
                progress: function(e, data) {
                    //options.progress = parseInt(data.loaded / data.total * 100, 10);
                    //scope.$apply();
                },
                submit: function(e, data) {
                    data.formData=options.formData;
                }
            });

            var afterInit=true;
            element.on('fileuploadsubmit',function(e,data){
            });
            element.on('fileuploadprogress',function(e,data){
                options.progress = parseInt(data.loaded / data.total * 100, 10);
                scope.$apply();
            });
            //scope.$watch(attrs.fileUpload2,function(newOptions){
            //    if(newOptions && afterInit){
            //        $(this).fileupload('option',newOptions);
            //    }
            //});


        }
    }
});

MetronicApp.directive("fileRead", [function () {
    return {
        link: function (scope, element, attributes) {

            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
            // console.log('edge:',isEdge);
            element.bind("change", function (changeEvent) {

                var fileread = changeEvent.target.files[0];

                if (fileread) {

                    var objUrl;
                    if (navigator.userAgent.indexOf("MSIE") > 0) {
                        objUrl = fileread;
                    } else {
                        objUrl = InputFileOp.GetObjectUrl(fileread);
                    }

                    if (objUrl) {
                        scope.$apply(function () {
                            scope.UpdateFileUrl(objUrl);
                        })

                    }

                    var imgtemp = new Image();//创建一个image对象
                    imgtemp.src = objUrl;
                    var realWidth, realHeight;
                    imgtemp.onload = function () {//图片加载完成后执行

                        //获取图像原始尺寸
                        realWidth = this.width;
                        realHeight = this.height;
                        //调整图像尺寸
                        var ratio = realWidth / realHeight;
                        var imgHeight;
                        if (ratio >= 1) {
                            imgWidth = realWidth <= 400 ? realWidth : 400;
                            imgHeight = realWidth <= 400 ? realHeight : 400 / ratio;
                        } else {
                            imgWidth = realHeight <= 400 ? realWidth : 400 * ratio;
                            imgHeight = realHeight <= 400 ? realHeight : 400;
                        }

                        $('#avatarPicInput').css('width', imgWidth);
                        $('#avatarPicInput').css('height', imgHeight);

                        if (!scope.ImageCropAlreadyinit) {
                            scope.ImageCropAlreadyinit = true;
                            ImageCrop.init(scope.UpdateCropParam);
                            scope.UpdateCropParam(ImageCrop.CropParam());
                        }

                        if (ImageCrop.Api()) {
                            //完全清理图像裁剪元素
                            if (isEdge) {
                                console.log('jcroplength', $('.jcrop-holder').length);

                                var holdernodes = document.getElementsByClassName('jcrop-holder');
                                while (holdernodes && holdernodes.length) {
                                    var parentnode = holdernodes[0].parentNode;
                                    parentnode.removeChild(holdernodes[0]);
                                    holdernodes = document.getElementsByClassName('jcrop-holder');
                                }

                                var previewnodes = document.getElementsByClassName('preview');
                                if (previewnodes && previewnodes.length) {
                                    previewnodes[0].parentNode.innerHTML = '';
                                }
                            }

                            ImageCrop.Api().destroy();


                            if (isEdge) {
                                $('#avatarPreview').append('<div id="preview-pane" class="preview">' +
                                    '<div class="preview-container " style="width:140px;height: 140px ">' +
                                    '<img src="' + objUrl + '" class="jcrop-preview IEImgBorder" alt="预览" style="width:140px;height: 140px "/>' +
                                    '</div> </div>');
                            } else {
                                $('#avatarPreview').append('<div id="preview-pane" class="preview">' +
                                    '<div class="preview-container " style="width:140px;height: 140px ">' +
                                    '<img ng-src="{{inputFile.FileUrl}}" class="jcrop-preview IEImgBorder" alt="预览" style="width:140px;height: 140px "/>' +
                                    '</div> </div>');
                            }


                            //重新初始化图像裁剪元素
                            ImageCrop.init(scope.UpdateCropParam);

                            window.setTimeout(function () {
                                var holdernodes = document.getElementsByClassName('jcrop-holder');
                                while (holdernodes && holdernodes.length > 1) {
                                    var parentnode = holdernodes[1].parentNode;
                                    parentnode.removeChild(holdernodes[1]);
                                    holdernodes = document.getElementsByClassName('jcrop-holder');
                                }
                            }, 200);

                            scope.$apply(function () {
                                scope.UpdateFileUrl(objUrl);
                            });

                            scope.UpdateCropParam(ImageCrop.CropParam());


                        }
                        scope.$apply(function () {
                            scope.UpdateInputFile(fileread);
                        })
                    }

                }

            });
        }
    }
}]);

