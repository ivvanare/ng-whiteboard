import { Injectable, ɵɵdefineInjectable, EventEmitter, Component, ViewChild, Input, Output, NgModule } from '@angular/core';
import { Subject } from 'rxjs';
import { line, curveBasis, select, drag, event, mouse } from 'd3';

/**
 * @fileoverview added by tsickle
 * Generated from: lib/ng-whiteboard.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var NgWhiteboardService = /** @class */ (function () {
    function NgWhiteboardService() {
        // Observable string sources
        this.eraseSvgMethodCallSource = new Subject();
        this.saveSvgMethodCallSource = new Subject();
        this.undoSvgMethodCallSource = new Subject();
        this.redoSvgMethodCallSource = new Subject();
        this.addImageMethodCallSource = new Subject();
        // Observable string streams
        this.eraseSvgMethodCalled$ = this.eraseSvgMethodCallSource.asObservable();
        this.saveSvgMethodCalled$ = this.saveSvgMethodCallSource.asObservable();
        this.undoSvgMethodCalled$ = this.undoSvgMethodCallSource.asObservable();
        this.redoSvgMethodCalled$ = this.redoSvgMethodCallSource.asObservable();
        this.addImageMethodCalled$ = this.addImageMethodCallSource.asObservable();
    }
    // Service message commands
    // Service message commands
    /**
     * @return {?}
     */
    NgWhiteboardService.prototype.erase = 
    // Service message commands
    /**
     * @return {?}
     */
    function () {
        this.eraseSvgMethodCallSource.next();
    };
    /**
     * @param {?=} name
     * @param {?=} format
     * @return {?}
     */
    NgWhiteboardService.prototype.save = /**
     * @param {?=} name
     * @param {?=} format
     * @return {?}
     */
    function (name, format) {
        if (name === void 0) { name = 'New image'; }
        if (format === void 0) { format = 'png'; }
        this.saveSvgMethodCallSource.next({ name: name, format: format });
    };
    /**
     * @return {?}
     */
    NgWhiteboardService.prototype.undo = /**
     * @return {?}
     */
    function () {
        this.undoSvgMethodCallSource.next();
    };
    /**
     * @return {?}
     */
    NgWhiteboardService.prototype.redo = /**
     * @return {?}
     */
    function () {
        this.redoSvgMethodCallSource.next();
    };
    /**
     * @param {?} image
     * @return {?}
     */
    NgWhiteboardService.prototype.addImage = /**
     * @param {?} image
     * @return {?}
     */
    function (image) {
        this.addImageMethodCallSource.next(image);
    };
    NgWhiteboardService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */ NgWhiteboardService.ɵprov = ɵɵdefineInjectable({ factory: function NgWhiteboardService_Factory() { return new NgWhiteboardService(); }, token: NgWhiteboardService, providedIn: "root" });
    return NgWhiteboardService;
}());
if (false) {
    /**
     * @type {?}
     * @private
     */
    NgWhiteboardService.prototype.eraseSvgMethodCallSource;
    /**
     * @type {?}
     * @private
     */
    NgWhiteboardService.prototype.saveSvgMethodCallSource;
    /**
     * @type {?}
     * @private
     */
    NgWhiteboardService.prototype.undoSvgMethodCallSource;
    /**
     * @type {?}
     * @private
     */
    NgWhiteboardService.prototype.redoSvgMethodCallSource;
    /**
     * @type {?}
     * @private
     */
    NgWhiteboardService.prototype.addImageMethodCallSource;
    /** @type {?} */
    NgWhiteboardService.prototype.eraseSvgMethodCalled$;
    /** @type {?} */
    NgWhiteboardService.prototype.saveSvgMethodCalled$;
    /** @type {?} */
    NgWhiteboardService.prototype.undoSvgMethodCalled$;
    /** @type {?} */
    NgWhiteboardService.prototype.redoSvgMethodCalled$;
    /** @type {?} */
    NgWhiteboardService.prototype.addImageMethodCalled$;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/ng-whiteboard.types.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var WhiteboardOptions = /** @class */ (function () {
    function WhiteboardOptions() {
        this.color = '#000000';
        this.backgroundColor = '#ffffff';
        this.size = '5px';
        this.linejoin = 'round';
        this.linecap = 'round';
    }
    return WhiteboardOptions;
}());
if (false) {
    /** @type {?} */
    WhiteboardOptions.prototype.color;
    /** @type {?} */
    WhiteboardOptions.prototype.backgroundColor;
    /** @type {?} */
    WhiteboardOptions.prototype.size;
    /** @type {?} */
    WhiteboardOptions.prototype.linejoin;
    /** @type {?} */
    WhiteboardOptions.prototype.linecap;
}
/**
 * @record
 */
function ActionStack() { }
if (false) {
    /** @type {?} */
    ActionStack.prototype.type;
    /** @type {?|undefined} */
    ActionStack.prototype.line;
    /** @type {?|undefined} */
    ActionStack.prototype.image;
}
/** @enum {number} */
var ActionType = {
    Line: 0,
    Image: 1,
};
ActionType[ActionType.Line] = 'Line';
ActionType[ActionType.Image] = 'Image';

/**
 * @fileoverview added by tsickle
 * Generated from: lib/ng-whiteboard.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var NgWhiteboardComponent = /** @class */ (function () {
    function NgWhiteboardComponent(whiteboardService) {
        this.whiteboardService = whiteboardService;
        this.whiteboardOptions = new WhiteboardOptions();
        this.init = new EventEmitter();
        this.clear = new EventEmitter();
        this.undo = new EventEmitter();
        this.redo = new EventEmitter();
        this.save = new EventEmitter();
        this.imageAdded = new EventEmitter();
        this.selection = undefined;
        this.subscriptionList = [];
        this.undoStack = [];
        this.redoStack = [];
    }
    /**
     * @return {?}
     */
    NgWhiteboardComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.subscriptionList.push(this.whiteboardService.eraseSvgMethodCalled$.subscribe((/**
         * @return {?}
         */
        function () { return _this.eraseSvg(_this.selection); })));
        this.subscriptionList.push(this.whiteboardService.saveSvgMethodCalled$.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var name = _a.name, format = _a.format;
            return _this.saveSvg(name, format);
        })));
        this.subscriptionList.push(this.whiteboardService.undoSvgMethodCalled$.subscribe((/**
         * @return {?}
         */
        function () { return _this.undoDraw(); })));
        this.subscriptionList.push(this.whiteboardService.redoSvgMethodCalled$.subscribe((/**
         * @return {?}
         */
        function () { return _this.redoDraw(); })));
        this.subscriptionList.push(this.whiteboardService.addImageMethodCalled$.subscribe((/**
         * @param {?} image
         * @return {?}
         */
        function (image) { return _this.addImage(image); })));
        this.selection = this.initSvg(this.svgContainer.nativeElement);
    };
    /**
     * @return {?}
     */
    NgWhiteboardComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.subscriptionList.forEach((/**
         * @param {?} subscription
         * @return {?}
         */
        function (subscription) { return _this._unsubscribe(subscription); }));
    };
    /**
     * @private
     * @param {?} selector
     * @return {?}
     */
    NgWhiteboardComponent.prototype.initSvg = /**
     * @private
     * @param {?} selector
     * @return {?}
     */
    function (selector) {
        var _this = this;
        /** @type {?} */
        var d3Line = line().curve(curveBasis);
        /** @type {?} */
        var svg = select(selector).call(drag()
            .container(selector)
            .subject((/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var p = [event.x, event.y];
            return [p, p];
        }))
            .on('start', (/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var d = event.subject;
            /** @type {?} */
            var active = svg
                .append('path')
                .datum(d)
                .attr('class', 'line')
                .attr('style', "\n           fill: none;\n           stroke: " + (_this.color || _this.whiteboardOptions.color) + ";\n           stroke-width: " + (_this.size || _this.whiteboardOptions.size) + ";\n           stroke-linejoin: " + (_this.linejoin || _this.whiteboardOptions.linejoin) + ";\n           stroke-linecap: " + (_this.linecap || _this.whiteboardOptions.linecap) + ";\n           ");
            active.attr('d', d3Line);
            event.on('drag', (/**
             * @return {?}
             */
            function () {
                active.datum().push(mouse(this));
                active.attr('d', d3Line);
            }));
            event.on('end', (/**
             * @return {?}
             */
            function () {
                active.attr('d', d3Line);
                if (_this.undoStack.length < 1) {
                    _this.redoStack = [];
                }
                _this.undoStack.push({ type: ActionType.Line, line: active.node() });
            }));
        })));
        this.init.emit();
        return svg;
    };
    /**
     * @private
     * @param {?} image
     * @return {?}
     */
    NgWhiteboardComponent.prototype.addImage = /**
     * @private
     * @param {?} image
     * @return {?}
     */
    function (image) {
        this.drawImage(image);
    };
    /**
     * @private
     * @param {?} svg
     * @return {?}
     */
    NgWhiteboardComponent.prototype.eraseSvg = /**
     * @private
     * @param {?} svg
     * @return {?}
     */
    function (svg) {
        svg.selectAll('*').remove();
        this.undoStack = [];
        this.redoStack = [];
        this.clear.emit();
    };
    /**
     * @private
     * @param {?} name
     * @param {?} format
     * @return {?}
     */
    NgWhiteboardComponent.prototype.saveSvg = /**
     * @private
     * @param {?} name
     * @param {?} format
     * @return {?}
     */
    function (name, format) {
        var _this = this;
        /** @type {?} */
        var svgString = this.saveAsSvg(this.selection.clone(true).node());
        if (format === 'svg') {
            this.download('data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString))), name);
        }
        else {
            this.svgString2Image(svgString, Number(this.selection.style('width').replace('px', '')), Number(this.selection.style('height').replace('px', '')), format, (/**
             * @param {?} img
             * @return {?}
             */
            function (img) {
                _this.download(img, name);
            }));
        }
        // this.save.emit();
    };
    /**
     * @private
     * @return {?}
     */
    NgWhiteboardComponent.prototype.undoDraw = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.undoStack.length) {
            return;
        }
        this.redoStack.push(this.undoStack.pop());
        this.selection.selectAll('.line').remove();
        this.undoStack.forEach((/**
         * @param {?} action
         * @return {?}
         */
        function (action) {
            if (action.type === ActionType.Line) {
                _this.drawLine(action.line);
            }
            else if (action.type === ActionType.Image) {
                _this.drawLine(action.image);
            }
        }));
        this.undo.emit();
    };
    /**
     * @private
     * @return {?}
     */
    NgWhiteboardComponent.prototype.redoDraw = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.redoStack.length) {
            return;
        }
        this.undoStack.push(this.redoStack.pop());
        this.selection.selectAll('.line').remove();
        this.undoStack.forEach((/**
         * @param {?} action
         * @return {?}
         */
        function (action) {
            if (action.type === ActionType.Line) {
                _this.drawLine(action.line);
            }
            else if (action.type === ActionType.Image) {
                _this.drawLine(action.image);
            }
        }));
        this.redo.emit();
    };
    /**
     * @private
     * @param {?} pathNode
     * @return {?}
     */
    NgWhiteboardComponent.prototype.drawLine = /**
     * @private
     * @param {?} pathNode
     * @return {?}
     */
    function (pathNode) {
        this.selection.node().appendChild(pathNode);
    };
    /**
     * @private
     * @param {?} image
     * @return {?}
     */
    NgWhiteboardComponent.prototype.drawImage = /**
     * @private
     * @param {?} image
     * @return {?}
     */
    function (image) {
        var _this = this;
        /** @type {?} */
        var group = this.selection
            .append('g')
            .data([{ x: 20, y: 20, r: 1, scale: 1 }])
            .attr('x', 0)
            .attr('y', 0)
            .attr('transform', 'translate(0,0)');
        /** @type {?} */
        var tempImg = new Image();
        tempImg.onload = (/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var aspectRatio = tempImg.width / tempImg.height;
            /** @type {?} */
            var height = Number(_this.selection.style('height').replace('px', ''));
            // tempImg.height > Number(this.selection.style('height').replace('px', ''))
            //   ? Number(this.selection.style('height').replace('px', '')) - 40
            //   : tempImg.height;
            /** @type {?} */
            var width = Number(_this.selection.style('width').replace('px', ''));
            // height === Number(this.selection.style('height').replace('px', '')) - 40
            //   ? (Number(this.selection.style('height').replace('px', '')) - 40) * aspectRatio
            //   : tempImg.width;
            group
                .append('image')
                .attr('x', 0)
                .attr('y', 0)
                .attr('height', height)
                .attr('width', width)
                .attr('preserveAspectRatio', 'none')
                .attr('xlink:href', image.toString());
            group
                .append('rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', 20)
                .attr('height', 20)
                .style('opacity', 0)
                .attr('fill', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) {
                return '#cccccc';
            }))
                .call(drag()
                .subject((/**
             * @return {?}
             */
            function () {
                /** @type {?} */
                var p = [event.x, event.y];
                return [p, p];
            }))
                .on('start', (/**
             * @return {?}
             */
            function () {
                event.on('drag', (/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) {
                    /** @type {?} */
                    var cursor = select(this);
                    /** @type {?} */
                    var cord = mouse(this);
                    d.x += cord[0] - Number(cursor.attr('width')) / 2;
                    d.y += cord[1] - Number(cursor.attr('height')) / 2;
                    select(this.parentNode).attr('transform', (/**
                     * @return {?}
                     */
                    function () {
                        return ('translate(' + [d.x, d.y] + '),rotate(' + 0 + ',160, 160),scale(' + d.scale + ',' + d.scale + ')');
                    }));
                }));
            })));
            group
                .on('mouseover', (/**
             * @return {?}
             */
            function () {
                select(this).select('rect').style('opacity', 1.0);
            }))
                .on('mouseout', (/**
             * @return {?}
             */
            function () {
                select(this).select('rect').style('opacity', 0);
            }));
            // this.undoStack.push({ type: ActionType.Image, image: group.node() });
        });
        tempImg.src = image.toString();
    };
    /**
     * @private
     * @param {?} subscription
     * @return {?}
     */
    NgWhiteboardComponent.prototype._unsubscribe = /**
     * @private
     * @param {?} subscription
     * @return {?}
     */
    function (subscription) {
        if (subscription) {
            subscription.unsubscribe();
        }
    };
    /**
     * @private
     * @param {?} svgString
     * @param {?} width
     * @param {?} height
     * @param {?} format
     * @param {?} callback
     * @return {?}
     */
    NgWhiteboardComponent.prototype.svgString2Image = /**
     * @private
     * @param {?} svgString
     * @param {?} width
     * @param {?} height
     * @param {?} format
     * @param {?} callback
     * @return {?}
     */
    function (svgString, width, height, format, callback) {
        // set default for format parameter
        format = format || 'png';
        // SVG data URL from SVG string
        /** @type {?} */
        var svgData = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
        // create canvas in memory(not in DOM)
        /** @type {?} */
        var canvas = document.createElement('canvas');
        // get canvas context for drawing on canvas
        /** @type {?} */
        var context = canvas.getContext('2d');
        // set canvas size
        canvas.width = width;
        canvas.height = height;
        // create image in memory(not in DOM)
        /** @type {?} */
        var image = new Image();
        // later when image loads run this
        image.onload = (/**
         * @return {?}
         */
        function () {
            // async (happens later)
            // clear canvas
            context.clearRect(0, 0, width, height);
            // draw image with SVG data to canvas
            context.drawImage(image, 0, 0, width, height);
            // snapshot canvas as png
            /** @type {?} */
            var pngData = canvas.toDataURL('image/' + format);
            // pass png data URL to callback
            callback(pngData);
        }); // end async
        // start loading SVG data into in memory image
        image.src = svgData;
    };
    /**
     * @private
     * @param {?} svgNode
     * @return {?}
     */
    NgWhiteboardComponent.prototype.saveAsSvg = /**
     * @private
     * @param {?} svgNode
     * @return {?}
     */
    function (svgNode) {
        svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
        /** @type {?} */
        var serializer = new XMLSerializer();
        /** @type {?} */
        var svgString = serializer.serializeToString(svgNode);
        svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
        svgString = svgString.replace(/NS\d+:href/g, 'xlink:href');
        return svgString;
    };
    /**
     * @private
     * @param {?} url
     * @param {?} name
     * @return {?}
     */
    NgWhiteboardComponent.prototype.download = /**
     * @private
     * @param {?} url
     * @param {?} name
     * @return {?}
     */
    function (url, name) {
        /** @type {?} */
        var file = this.dataURLtoFile(url, name);
        this.save.emit(file);
        return file;
        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute('visibility', 'hidden');
        // link.download = name || 'new white-board';
        // document.body.appendChild(link);
        // link.click();
    };
    /**
     * transformar base64
     * @param dataurl string base64
     * @param filename nombre para el File
     */
    /**
     * transformar base64
     * @param {?} dataurl string base64
     * @param {?} filename nombre para el File
     * @return {?}
     */
    NgWhiteboardComponent.prototype.dataURLtoFile = /**
     * transformar base64
     * @param {?} dataurl string base64
     * @param {?} filename nombre para el File
     * @return {?}
     */
    function (dataurl, filename) {
        /** @type {?} */
        var arr = dataurl.split(',');
        /** @type {?} */
        var mime = arr[0].match(/:(.*?);/)[1];
        /** @type {?} */
        var bstr = atob(arr[1]);
        /** @type {?} */
        var n = bstr.length;
        /** @type {?} */
        var u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };
    NgWhiteboardComponent.decorators = [
        { type: Component, args: [{
                    // tslint:disable-next-line: component-selector
                    selector: 'ng-whiteboard-btc',
                    template: "\n    <svg #svgContainer [style.background-color]=\"this.backgroundColor || this.whiteboardOptions.backgroundColor\"></svg>\n  ",
                    styles: [":host{width:inherit;height:inherit;min-width:inherit;min-height:inherit;max-width:inherit;max-height:inherit}:host svg{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;width:inherit;height:inherit;min-width:inherit;min-height:inherit;max-width:inherit;max-height:inherit;cursor:url(cursor.svg) 5 5,crosshair;background-size:cover;background-position:50%;background-repeat:no-repeat}:host svg .bg-image{position:relative}:host svg .bg-image .image-cursor{position:absolute;width:10px;height:10px;background-color:#080;top:0;right:0}"]
                }] }
    ];
    /** @nocollapse */
    NgWhiteboardComponent.ctorParameters = function () { return [
        { type: NgWhiteboardService }
    ]; };
    NgWhiteboardComponent.propDecorators = {
        svgContainer: [{ type: ViewChild, args: ['svgContainer', { static: false },] }],
        whiteboardOptions: [{ type: Input }],
        color: [{ type: Input }],
        backgroundColor: [{ type: Input }],
        size: [{ type: Input }],
        linejoin: [{ type: Input }],
        linecap: [{ type: Input }],
        init: [{ type: Output }],
        clear: [{ type: Output }],
        undo: [{ type: Output }],
        redo: [{ type: Output }],
        save: [{ type: Output }],
        imageAdded: [{ type: Output }]
    };
    return NgWhiteboardComponent;
}());
if (false) {
    /**
     * @type {?}
     * @private
     */
    NgWhiteboardComponent.prototype.svgContainer;
    /** @type {?} */
    NgWhiteboardComponent.prototype.whiteboardOptions;
    /** @type {?} */
    NgWhiteboardComponent.prototype.color;
    /** @type {?} */
    NgWhiteboardComponent.prototype.backgroundColor;
    /** @type {?} */
    NgWhiteboardComponent.prototype.size;
    /** @type {?} */
    NgWhiteboardComponent.prototype.linejoin;
    /** @type {?} */
    NgWhiteboardComponent.prototype.linecap;
    /** @type {?} */
    NgWhiteboardComponent.prototype.init;
    /** @type {?} */
    NgWhiteboardComponent.prototype.clear;
    /** @type {?} */
    NgWhiteboardComponent.prototype.undo;
    /** @type {?} */
    NgWhiteboardComponent.prototype.redo;
    /** @type {?} */
    NgWhiteboardComponent.prototype.save;
    /** @type {?} */
    NgWhiteboardComponent.prototype.imageAdded;
    /**
     * @type {?}
     * @private
     */
    NgWhiteboardComponent.prototype.selection;
    /**
     * @type {?}
     * @private
     */
    NgWhiteboardComponent.prototype.subscriptionList;
    /**
     * @type {?}
     * @private
     */
    NgWhiteboardComponent.prototype.undoStack;
    /**
     * @type {?}
     * @private
     */
    NgWhiteboardComponent.prototype.redoStack;
    /**
     * @type {?}
     * @private
     */
    NgWhiteboardComponent.prototype.whiteboardService;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/ng-whiteboard.module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var NgWhiteboardModule = /** @class */ (function () {
    function NgWhiteboardModule() {
    }
    NgWhiteboardModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [NgWhiteboardComponent],
                    imports: [],
                    exports: [NgWhiteboardComponent]
                },] }
    ];
    return NgWhiteboardModule;
}());

/**
 * @fileoverview added by tsickle
 * Generated from: public-api.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: ng-whiteboard.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { NgWhiteboardComponent, NgWhiteboardModule, NgWhiteboardService };
//# sourceMappingURL=ng-whiteboard.js.map
