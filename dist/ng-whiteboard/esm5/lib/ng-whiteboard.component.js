/**
 * @fileoverview added by tsickle
 * Generated from: lib/ng-whiteboard.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { NgWhiteboardService } from './ng-whiteboard.service';
import { WhiteboardOptions, ActionType } from './ng-whiteboard.types';
import { curveBasis, select, drag, line, event, mouse } from 'd3';
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
        /**
         * convertir base64 a blob
         * @param b64DataUrl
         * @param contentType
         * @param sliceSize
         */
        this.b64toBlob = (/**
         * @param {?} b64DataUrl
         * @param {?=} sliceSize
         * @return {?}
         */
        function (b64DataUrl, sliceSize) {
            if (sliceSize === void 0) { sliceSize = 512; }
            /** @type {?} */
            var arr = b64DataUrl.split(",");
            /** @type {?} */
            var contentType = arr[0].match(/:(.*?);/)[1];
            /** @type {?} */
            var byteCharacters = atob(arr[1]);
            /** @type {?} */
            var byteArrays = [];
            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                /** @type {?} */
                var slice = byteCharacters.slice(offset, offset + sliceSize);
                /** @type {?} */
                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                /** @type {?} */
                var byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }
            /** @type {?} */
            var blob = new Blob(byteArrays, { type: contentType });
            return blob;
        });
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
        var file = this.b64toBlob(url);
        this.save.emit(file);
        return file;
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
export { NgWhiteboardComponent };
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
     * convertir base64 a blob
     * \@param b64DataUrl
     * \@param contentType
     * \@param sliceSize
     * @type {?}
     */
    NgWhiteboardComponent.prototype.b64toBlob;
    /**
     * @type {?}
     * @private
     */
    NgWhiteboardComponent.prototype.whiteboardService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctd2hpdGVib2FyZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy13aGl0ZWJvYXJkLyIsInNvdXJjZXMiOlsibGliL25nLXdoaXRlYm9hcmQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBaUIsU0FBUyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQWEsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN4SCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUU5RCxPQUFPLEVBQUUsaUJBQWlCLEVBQWUsVUFBVSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDbkYsT0FBTyxFQUFvQixVQUFVLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBYSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLElBQUksQ0FBQztBQUUvRjtJQStCRSwrQkFBb0IsaUJBQXNDO1FBQXRDLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBcUI7UUFyQmpELHNCQUFpQixHQUFzQixJQUFJLGlCQUFpQixFQUFFLENBQUM7UUFPOUQsU0FBSSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDMUIsVUFBSyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDM0IsU0FBSSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDMUIsU0FBSSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDMUIsU0FBSSxHQUFzQixJQUFJLFlBQVksRUFBd0IsQ0FBQztRQUNuRSxlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUVsQyxjQUFTLEdBQTZDLFNBQVMsQ0FBQztRQUVoRSxxQkFBZ0IsR0FBbUIsRUFBRSxDQUFDO1FBRXRDLGNBQVMsR0FBa0IsRUFBRSxDQUFDO1FBQzlCLGNBQVMsR0FBa0IsRUFBRSxDQUFDOzs7Ozs7O1FBMlF0QyxjQUFTOzs7OztRQUFHLFVBQUMs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QXVFOztJQUN2RSx3Q0FBOEM7O0lBRTlDLHFDQUFvQzs7SUFDcEMsc0NBQXFDOztJQUNyQyxxQ0FBb0M7O0lBQ3BDLHFDQUFvQzs7SUFDcEMscUNBQTZFOztJQUM3RSwyQ0FBMEM7Ozs7O0lBRTFDLDBDQUF3RTs7Ozs7SUFFeEUsaURBQThDOzs7OztJQUU5QywwQ0FBc0M7Ozs7O0lBQ3RDLDBDQUFzQzs7Ozs7Ozs7SUEyUXRDLDBDQW9CQzs7Ozs7SUE3Ulcsa0RBQThDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBBZnRlclZpZXdJbml0LCBWaWV3Q2hpbGQsIElucHV0LCBFbGVtZW50UmVmLCBPbkRlc3Ryb3ksIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE5nV2hpdGVib2FyZFNlcnZpY2UgfSBmcm9tICcuL25nLXdoaXRlYm9hcmQuc2VydmljZSc7XHJcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBXaGl0ZWJvYXJkT3B0aW9ucywgQWN0aW9uU3RhY2ssIEFjdGlvblR5cGUgfSBmcm9tICcuL25nLXdoaXRlYm9hcmQudHlwZXMnO1xyXG5pbXBvcnQgeyBDb250YWluZXJFbGVtZW50LCBjdXJ2ZUJhc2lzLCBzZWxlY3QsIGRyYWcsIFNlbGVjdGlvbiwgbGluZSwgZXZlbnQsIG1vdXNlIH0gZnJvbSAnZDMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBjb21wb25lbnQtc2VsZWN0b3JcclxuICBzZWxlY3RvcjogJ25nLXdoaXRlYm9hcmQtYnRjJyxcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPHN2ZyAjc3ZnQ29udGFpbmVyIFtzdHlsZS5iYWNrZ3JvdW5kLWNvbG9yXT1cInRoaXMuYmFja2dyb3VuZENvbG9yIHx8IHRoaXMud2hpdGVib2FyZE9wdGlvbnMuYmFja2dyb3VuZENvbG9yXCI+PC9zdmc+XHJcbiAgYCxcclxuICBzdHlsZVVybHM6IFsnbmctd2hpdGVib2FyZC5jb21wb25lbnQuc2NzcyddLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmdXaGl0ZWJvYXJkQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcclxuICBAVmlld0NoaWxkKCdzdmdDb250YWluZXInLCB7IHN0YXRpYzogZmFsc2UgfSkgcHJpdmF0ZSBzdmdDb250YWluZXI6IEVsZW1lbnRSZWY8Q29udGFpbmVyRWxlbWVudD47XHJcbiAgQElucHV0KCkgd2hpdGVib2FyZE9wdGlvbnM6IFdoaXRlYm9hcmRPcHRpb25zID0gbmV3IFdoaXRlYm9hcmRPcHRpb25zKCk7XHJcbiAgQElucHV0KCkgY29sb3I6IHN0cmluZztcclxuICBASW5wdXQoKSBiYWNrZ3JvdW5kQ29sb3I6IHN0cmluZztcclxuICBASW5wdXQoKSBzaXplOiBzdHJpbmc7XHJcbiAgQElucHV0KCkgbGluZWpvaW46ICdtaXRlcicgfCAncm91bmQnIHwgJ2JldmVsJyB8ICdtaXRlci1jbGlwJyB8ICdhcmNzJztcclxuICBASW5wdXQoKSBsaW5lY2FwOiAnYnV0dCcgfCAnc3F1YXJlJyB8ICdyb3VuZCc7XHJcblxyXG4gIEBPdXRwdXQoKSBpbml0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSBjbGVhciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgdW5kbyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgcmVkbyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgc2F2ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZyB8IEJsb2IgfCBGaWxlPigpO1xyXG4gIEBPdXRwdXQoKSBpbWFnZUFkZGVkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBwcml2YXRlIHNlbGVjdGlvbjogU2VsZWN0aW9uPGFueSwgdW5rbm93biwgbnVsbCwgdW5kZWZpbmVkPiA9IHVuZGVmaW5lZDtcclxuXHJcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25MaXN0OiBTdWJzY3JpcHRpb25bXSA9IFtdO1xyXG5cclxuICBwcml2YXRlIHVuZG9TdGFjazogQWN0aW9uU3RhY2tbXSA9IFtdO1xyXG4gIHByaXZhdGUgcmVkb1N0YWNrOiBBY3Rpb25TdGFja1tdID0gW107XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgd2hpdGVib2FyZFNlcnZpY2U6IE5nV2hpdGVib2FyZFNlcnZpY2UpIHt9XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgIHRoaXMuc3Vic2NyaXB0aW9uTGlzdC5wdXNoKFxyXG4gICAgICB0aGlzLndoaXRlYm9hcmRTZXJ2aWNlLmVyYXNlU3ZnTWV0aG9kQ2FsbGVkJC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5lcmFzZVN2Zyh0aGlzLnNlbGVjdGlvbikpXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuc3Vic2NyaXB0aW9uTGlzdC5wdXNoKFxyXG4gICAgICB0aGlzLndoaXRlYm9hcmRTZXJ2aWNlLnNhdmVTdmdNZXRob2RDYWxsZWQkLnN1YnNjcmliZSgoeyBuYW1lLCBmb3JtYXQgfSkgPT4gdGhpcy5zYXZlU3ZnKG5hbWUsIGZvcm1hdCkpXHJcbiAgICApO1xyXG4gICAgdGhpcy5zdWJzY3JpcHRpb25MaXN0LnB1c2godGhpcy53aGl0ZWJvYXJkU2VydmljZS51bmRvU3ZnTWV0aG9kQ2FsbGVkJC5zdWJzY3JpYmUoKCkgPT4gdGhpcy51bmRvRHJhdygpKSk7XHJcbiAgICB0aGlzLnN1YnNjcmlwdGlvbkxpc3QucHVzaCh0aGlzLndoaXRlYm9hcmRTZXJ2aWNlLnJlZG9TdmdNZXRob2RDYWxsZWQkLnN1YnNjcmliZSgoKSA9PiB0aGlzLnJlZG9EcmF3KCkpKTtcclxuICAgIHRoaXMuc3Vic2NyaXB0aW9uTGlzdC5wdXNoKHRoaXMud2hpdGVib2FyZFNlcnZpY2UuYWRkSW1hZ2VNZXRob2RDYWxsZWQkLnN1YnNjcmliZSgoaW1hZ2UpID0+IHRoaXMuYWRkSW1hZ2UoaW1hZ2UpKSk7XHJcblxyXG4gICAgdGhpcy5zZWxlY3Rpb24gPSB0aGlzLmluaXRTdmcodGhpcy5zdmdDb250YWluZXIubmF0aXZlRWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgIHRoaXMuc3Vic2NyaXB0aW9uTGlzdC5mb3JFYWNoKChzdWJzY3JpcHRpb24pID0+IHRoaXMuX3Vuc3Vic2NyaWJlKHN1YnNjcmlwdGlvbikpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpbml0U3ZnKHNlbGVjdG9yOiBDb250YWluZXJFbGVtZW50KSB7XHJcbiAgICBjb25zdCBkM0xpbmUgPSBsaW5lKCkuY3VydmUoY3VydmVCYXNpcyk7XHJcbiAgICBjb25zdCBzdmcgPSBzZWxlY3Qoc2VsZWN0b3IpLmNhbGwoXHJcbiAgICAgIGRyYWcoKVxyXG4gICAgICAgIC5jb250YWluZXIoc2VsZWN0b3IpXHJcbiAgICAgICAgLnN1YmplY3QoKCkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgcCA9IFtldmVudC54LCBldmVudC55XTtcclxuICAgICAgICAgIHJldHVybiBbcCwgcF07XHJcbiAgICAgICAgfSlcclxuICAgICAgICAub24oJ3N0YXJ0JywgKCkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgZCA9IGV2ZW50LnN1YmplY3Q7XHJcbiAgICAgICAgICBjb25zdCBhY3RpdmUgPSBzdmdcclxuICAgICAgICAgICAgLmFwcGVuZCgncGF0aCcpXHJcbiAgICAgICAgICAgIC5kYXR1bShkKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGluZScpXHJcbiAgICAgICAgICAgIC5hdHRyKFxyXG4gICAgICAgICAgICAgICdzdHlsZScsXHJcbiAgICAgICAgICAgICAgYFxyXG4gICAgICAgICAgIGZpbGw6IG5vbmU7XHJcbiAgICAgICAgICAgc3Ryb2tlOiAke3RoaXMuY29sb3IgfHwgdGhpcy53aGl0ZWJvYXJkT3B0aW9ucy5jb2xvcn07XHJcbiAgICAgICAgICAgc3Ryb2tlLXdpZHRoOiAke3RoaXMuc2l6ZSB8fCB0aGlzLndoaXRlYm9hcmRPcHRpb25zLnNpemV9O1xyXG4gICAgICAgICAgIHN0cm9rZS1saW5lam9pbjogJHt0aGlzLmxpbmVqb2luIHx8IHRoaXMud2hpdGVib2FyZE9wdGlvbnMubGluZWpvaW59O1xyXG4gICAgICAgICAgIHN0cm9rZS1saW5lY2FwOiAke3RoaXMubGluZWNhcCB8fCB0aGlzLndoaXRlYm9hcmRPcHRpb25zLmxpbmVjYXB9O1xyXG4gICAgICAgICAgIGBcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIGFjdGl2ZS5hdHRyKCdkJywgZDNMaW5lKTtcclxuICAgICAgICAgIGV2ZW50Lm9uKCdkcmFnJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBhY3RpdmUuZGF0dW0oKS5wdXNoKG1vdXNlKHRoaXMpKTtcclxuICAgICAgICAgICAgYWN0aXZlLmF0dHIoJ2QnLCBkM0xpbmUpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBldmVudC5vbignZW5kJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBhY3RpdmUuYXR0cignZCcsIGQzTGluZSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnVuZG9TdGFjay5sZW5ndGggPCAxKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZWRvU3RhY2sgPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnVuZG9TdGFjay5wdXNoKHsgdHlwZTogQWN0aW9uVHlwZS5MaW5lLCBsaW5lOiBhY3RpdmUubm9kZSgpIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSlcclxuICAgICk7XHJcbiAgICB0aGlzLmluaXQuZW1pdCgpO1xyXG4gICAgcmV0dXJuIHN2ZztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWRkSW1hZ2UoaW1hZ2U6IHN0cmluZyB8IEFycmF5QnVmZmVyKSB7XHJcbiAgICB0aGlzLmRyYXdJbWFnZShpbWFnZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGVyYXNlU3ZnKHN2ZzogU2VsZWN0aW9uPGFueSwgdW5rbm93biwgbnVsbCwgdW5kZWZpbmVkPikge1xyXG4gICAgc3ZnLnNlbGVjdEFsbCgnKicpLnJlbW92ZSgpO1xyXG4gICAgdGhpcy51bmRvU3RhY2sgPSBbXTtcclxuICAgIHRoaXMucmVkb1N0YWNrID0gW107XHJcbiAgICB0aGlzLmNsZWFyLmVtaXQoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2F2ZVN2ZyhuYW1lLCBmb3JtYXQ6ICdwbmcnIHwgJ2pwZWcnIHwgJ3N2ZycpIHtcclxuICAgIGNvbnN0IHN2Z1N0cmluZyA9IHRoaXMuc2F2ZUFzU3ZnKHRoaXMuc2VsZWN0aW9uLmNsb25lKHRydWUpLm5vZGUoKSk7XHJcbiAgICBpZiAoZm9ybWF0ID09PSAnc3ZnJykge1xyXG4gICAgICB0aGlzLmRvd25sb2FkKCdkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LCcgKyBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChzdmdTdHJpbmcpKSksIG5hbWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zdmdTdHJpbmcySW1hZ2UoXHJcbiAgICAgICAgc3ZnU3RyaW5nLFxyXG4gICAgICAgIE51bWJlcih0aGlzLnNlbGVjdGlvbi5zdHlsZSgnd2lkdGgnKS5yZXBsYWNlKCdweCcsICcnKSksXHJcbiAgICAgICAgTnVtYmVyKHRoaXMuc2VsZWN0aW9uLnN0eWxlKCdoZWlnaHQnKS5yZXBsYWNlKCdweCcsICcnKSksXHJcbiAgICAgICAgZm9ybWF0LFxyXG4gICAgICAgIChpbWcpID0+IHtcclxuICAgICAgICAgIHRoaXMuZG93bmxvYWQoaW1nLCBuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdGhpcy5zYXZlLmVtaXQoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgdW5kb0RyYXcoKSB7XHJcbiAgICBpZiAoIXRoaXMudW5kb1N0YWNrLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLnJlZG9TdGFjay5wdXNoKHRoaXMudW5kb1N0YWNrLnBvcCgpKTtcclxuICAgIHRoaXMuc2VsZWN0aW9uLnNlbGVjdEFsbCgnLmxpbmUnKS5yZW1vdmUoKTtcclxuICAgIHRoaXMudW5kb1N0YWNrLmZvckVhY2goKGFjdGlvbikgPT4ge1xyXG4gICAgICBpZiAoYWN0aW9uLnR5cGUgPT09IEFjdGlvblR5cGUuTGluZSkge1xyXG4gICAgICAgIHRoaXMuZHJhd0xpbmUoYWN0aW9uLmxpbmUpO1xyXG4gICAgICB9IGVsc2UgaWYgKGFjdGlvbi50eXBlID09PSBBY3Rpb25UeXBlLkltYWdlKSB7XHJcbiAgICAgICAgdGhpcy5kcmF3TGluZShhY3Rpb24uaW1hZ2UpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHRoaXMudW5kby5lbWl0KCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlZG9EcmF3KCkge1xyXG4gICAgaWYgKCF0aGlzLnJlZG9TdGFjay5sZW5ndGgpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy51bmRvU3RhY2sucHVzaCh0aGlzLnJlZG9TdGFjay5wb3AoKSk7XHJcbiAgICB0aGlzLnNlbGVjdGlvbi5zZWxlY3RBbGwoJy5saW5lJykucmVtb3ZlKCk7XHJcbiAgICB0aGlzLnVuZG9TdGFjay5mb3JFYWNoKChhY3Rpb24pID0+IHtcclxuICAgICAgaWYgKGFjdGlvbi50eXBlID09PSBBY3Rpb25UeXBlLkxpbmUpIHtcclxuICAgICAgICB0aGlzLmRyYXdMaW5lKGFjdGlvbi5saW5lKTtcclxuICAgICAgfSBlbHNlIGlmIChhY3Rpb24udHlwZSA9PT0gQWN0aW9uVHlwZS5JbWFnZSkge1xyXG4gICAgICAgIHRoaXMuZHJhd0xpbmUoYWN0aW9uLmltYWdlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnJlZG8uZW1pdCgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkcmF3TGluZShwYXRoTm9kZTogU1ZHUGF0aEVsZW1lbnQgfCBTVkdHRWxlbWVudCkge1xyXG4gICAgdGhpcy5zZWxlY3Rpb24ubm9kZSgpLmFwcGVuZENoaWxkKHBhdGhOb2RlKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZHJhd0ltYWdlKGltYWdlOiBzdHJpbmcgfCBBcnJheUJ1ZmZlcikge1xyXG4gICAgY29uc3QgZ3JvdXAgPSB0aGlzLnNlbGVjdGlvblxyXG4gICAgICAuYXBwZW5kKCdnJylcclxuICAgICAgLmRhdGEoW3sgeDogMjAsIHk6IDIwLCByOiAxLCBzY2FsZTogMSB9XSlcclxuICAgICAgLmF0dHIoJ3gnLCAwKVxyXG4gICAgICAuYXR0cigneScsIDApXHJcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknKTtcclxuXHJcbiAgICBjb25zdCB0ZW1wSW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICB0ZW1wSW1nLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgY29uc3QgYXNwZWN0UmF0aW8gPSB0ZW1wSW1nLndpZHRoIC8gdGVtcEltZy5oZWlnaHQ7XHJcbiAgICAgIGNvbnN0IGhlaWdodCA9IE51bWJlcih0aGlzLnNlbGVjdGlvbi5zdHlsZSgnaGVpZ2h0JykucmVwbGFjZSgncHgnLCAnJykpO1xyXG4gICAgICAvLyB0ZW1wSW1nLmhlaWdodCA+IE51bWJlcih0aGlzLnNlbGVjdGlvbi5zdHlsZSgnaGVpZ2h0JykucmVwbGFjZSgncHgnLCAnJykpXHJcbiAgICAgIC8vICAgPyBOdW1iZXIodGhpcy5zZWxlY3Rpb24uc3R5bGUoJ2hlaWdodCcpLnJlcGxhY2UoJ3B4JywgJycpKSAtIDQwXHJcbiAgICAgIC8vICAgOiB0ZW1wSW1nLmhlaWdodDtcclxuICAgICAgY29uc3Qgd2lkdGggPSBOdW1iZXIodGhpcy5zZWxlY3Rpb24uc3R5bGUoJ3dpZHRoJykucmVwbGFjZSgncHgnLCAnJykpO1xyXG4gICAgICAvLyBoZWlnaHQgPT09IE51bWJlcih0aGlzLnNlbGVjdGlvbi5zdHlsZSgnaGVpZ2h0JykucmVwbGFjZSgncHgnLCAnJykpIC0gNDBcclxuICAgICAgLy8gICA/IChOdW1iZXIodGhpcy5zZWxlY3Rpb24uc3R5bGUoJ2hlaWdodCcpLnJlcGxhY2UoJ3B4JywgJycpKSAtIDQwKSAqIGFzcGVjdFJhdGlvXHJcbiAgICAgIC8vICAgOiB0ZW1wSW1nLndpZHRoO1xyXG4gICAgICBncm91cFxyXG4gICAgICAgIC5hcHBlbmQoJ2ltYWdlJylcclxuICAgICAgICAuYXR0cigneCcsIDApXHJcbiAgICAgICAgLmF0dHIoJ3knLCAwKVxyXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCBoZWlnaHQpXHJcbiAgICAgICAgLmF0dHIoJ3dpZHRoJywgd2lkdGgpXHJcbiAgICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAnbm9uZScpXHJcbiAgICAgICAgLmF0dHIoJ3hsaW5rOmhyZWYnLCBpbWFnZS50b1N0cmluZygpKTtcclxuXHJcbiAgICAgIGdyb3VwXHJcbiAgICAgICAgLmFwcGVuZCgncmVjdCcpXHJcbiAgICAgICAgLmF0dHIoJ3gnLCAwKVxyXG4gICAgICAgIC5hdHRyKCd5JywgMClcclxuICAgICAgICAuYXR0cignd2lkdGgnLCAyMClcclxuICAgICAgICAuYXR0cignaGVpZ2h0JywgMjApXHJcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcclxuICAgICAgICAuYXR0cignZmlsbCcsIChkKSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gJyNjY2NjY2MnO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhbGwoXHJcbiAgICAgICAgICBkcmFnKClcclxuICAgICAgICAgICAgLnN1YmplY3QoKCkgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHAgPSBbZXZlbnQueCwgZXZlbnQueV07XHJcbiAgICAgICAgICAgICAgcmV0dXJuIFtwLCBwXTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm9uKCdzdGFydCcsICgpID0+IHtcclxuICAgICAgICAgICAgICBldmVudC5vbignZHJhZycsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJzb3IgPSBzZWxlY3QodGhpcyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb3JkID0gbW91c2UodGhpcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgZC54ICs9IGNvcmRbMF0gLSBOdW1iZXIoY3Vyc29yLmF0dHIoJ3dpZHRoJykpIC8gMjtcclxuICAgICAgICAgICAgICAgIGQueSArPSBjb3JkWzFdIC0gTnVtYmVyKGN1cnNvci5hdHRyKCdoZWlnaHQnKSkgLyAyO1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0KHRoaXMucGFyZW50Tm9kZSkuYXR0cigndHJhbnNmb3JtJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgICd0cmFuc2xhdGUoJyArIFtkLngsIGQueV0gKyAnKSxyb3RhdGUoJyArIDAgKyAnLDE2MCwgMTYwKSxzY2FsZSgnICsgZC5zY2FsZSArICcsJyArIGQuc2NhbGUgKyAnKSdcclxuICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIGdyb3VwXHJcbiAgICAgICAgLm9uKCdtb3VzZW92ZXInLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBzZWxlY3QodGhpcykuc2VsZWN0KCdyZWN0Jykuc3R5bGUoJ29wYWNpdHknLCAxLjApO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLm9uKCdtb3VzZW91dCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHNlbGVjdCh0aGlzKS5zZWxlY3QoJ3JlY3QnKS5zdHlsZSgnb3BhY2l0eScsIDApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAvLyB0aGlzLnVuZG9TdGFjay5wdXNoKHsgdHlwZTogQWN0aW9uVHlwZS5JbWFnZSwgaW1hZ2U6IGdyb3VwLm5vZGUoKSB9KTtcclxuICAgIH07XHJcbiAgICB0ZW1wSW1nLnNyYyA9IGltYWdlLnRvU3RyaW5nKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF91bnN1YnNjcmliZShzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbik6IHZvaWQge1xyXG4gICAgaWYgKHN1YnNjcmlwdGlvbikge1xyXG4gICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3ZnU3RyaW5nMkltYWdlKFxyXG4gICAgc3ZnU3RyaW5nOiBzdHJpbmcsXHJcbiAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICBmb3JtYXQ6IHN0cmluZyxcclxuICAgIGNhbGxiYWNrOiAoaW1nOiBzdHJpbmcpID0+IHZvaWRcclxuICApIHtcclxuICAgIC8vIHNldCBkZWZhdWx0IGZvciBmb3JtYXQgcGFyYW1ldGVyXHJcbiAgICBmb3JtYXQgPSBmb3JtYXQgfHwgJ3BuZyc7XHJcbiAgICAvLyBTVkcgZGF0YSBVUkwgZnJvbSBTVkcgc3RyaW5nXHJcbiAgICBjb25zdCBzdmdEYXRhID0gJ2RhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsJyArIGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KHN2Z1N0cmluZykpKTtcclxuICAgIC8vIGNyZWF0ZSBjYW52YXMgaW4gbWVtb3J5KG5vdCBpbiBET00pXHJcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgIC8vIGdldCBjYW52YXMgY29udGV4dCBmb3IgZHJhd2luZyBvbiBjYW52YXNcclxuICAgIGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIC8vIHNldCBjYW52YXMgc2l6ZVxyXG4gICAgY2FudmFzLndpZHRoID0gd2lkdGg7XHJcbiAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgLy8gY3JlYXRlIGltYWdlIGluIG1lbW9yeShub3QgaW4gRE9NKVxyXG4gICAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgIC8vIGxhdGVyIHdoZW4gaW1hZ2UgbG9hZHMgcnVuIHRoaXNcclxuICAgIGltYWdlLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgLy8gYXN5bmMgKGhhcHBlbnMgbGF0ZXIpXHJcbiAgICAgIC8vIGNsZWFyIGNhbnZhc1xyXG4gICAgICBjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgLy8gZHJhdyBpbWFnZSB3aXRoIFNWRyBkYXRhIHRvIGNhbnZhc1xyXG4gICAgICBjb250ZXh0LmRyYXdJbWFnZShpbWFnZSwgMCwgMCwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgIC8vIHNuYXBzaG90IGNhbnZhcyBhcyBwbmdcclxuICAgICAgY29uc3QgcG5nRGF0YSA9IGNhbnZhcy50b0RhdGFVUkwoJ2ltYWdlLycgKyBmb3JtYXQpO1xyXG4gICAgICAvLyBwYXNzIHBuZyBkYXRhIFVSTCB0byBjYWxsYmFja1xyXG4gICAgICBjYWxsYmFjayhwbmdEYXRhKTtcclxuICAgIH07IC8vIGVuZCBhc3luY1xyXG4gICAgLy8gc3RhcnQgbG9hZGluZyBTVkcgZGF0YSBpbnRvIGluIG1lbW9yeSBpbWFnZVxyXG4gICAgaW1hZ2Uuc3JjID0gc3ZnRGF0YTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2F2ZUFzU3ZnKHN2Z05vZGUpOiBzdHJpbmcge1xyXG4gICAgc3ZnTm9kZS5zZXRBdHRyaWJ1dGUoJ3hsaW5rJywgJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnKTtcclxuICAgIGNvbnN0IHNlcmlhbGl6ZXIgPSBuZXcgWE1MU2VyaWFsaXplcigpO1xyXG4gICAgbGV0IHN2Z1N0cmluZyA9IHNlcmlhbGl6ZXIuc2VyaWFsaXplVG9TdHJpbmcoc3ZnTm9kZSk7XHJcbiAgICBzdmdTdHJpbmcgPSBzdmdTdHJpbmcucmVwbGFjZSgvKFxcdyspPzo/eGxpbms9L2csICd4bWxuczp4bGluaz0nKTsgLy8gRml4IHJvb3QgeGxpbmsgd2l0aG91dCBuYW1lc3BhY2VcclxuICAgIHN2Z1N0cmluZyA9IHN2Z1N0cmluZy5yZXBsYWNlKC9OU1xcZCs6aHJlZi9nLCAneGxpbms6aHJlZicpO1xyXG4gICAgcmV0dXJuIHN2Z1N0cmluZztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZG93bmxvYWQodXJsOiBzdHJpbmcsIG5hbWU6IHN0cmluZyk6IGFueSB7XHJcbiAgICB2YXIgZmlsZSA9IHRoaXMuYjY0dG9CbG9iKHVybCk7XHJcbiAgICB0aGlzLnNhdmUuZW1pdChmaWxlKTtcclxuXHJcbiAgICByZXR1cm4gZmlsZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGNvbnZlcnRpciBiYXNlNjQgYSBibG9iXHJcbiAgICogQHBhcmFtIGI2NERhdGFVcmwgXHJcbiAgICogQHBhcmFtIGNvbnRlbnRUeXBlIFxyXG4gICAqIEBwYXJhbSBzbGljZVNpemUgXHJcbiAgICovXHJcbiAgYjY0dG9CbG9iID0gKGI2NERhdGFVcmwsIHNsaWNlU2l6ZT01MTIpID0+IHtcclxuICAgIHZhciBhcnIgPSBiNjREYXRhVXJsLnNwbGl0KFwiLFwiKTtcclxuICAgIHZhciBjb250ZW50VHlwZSA9IGFyclswXS5tYXRjaCgvOiguKj8pOy8pWzFdXHJcbiAgICBjb25zdCBieXRlQ2hhcmFjdGVycyA9IGF0b2IoYXJyWzFdKTtcclxuICAgIGNvbnN0IGJ5dGVBcnJheXMgPSBbXTtcclxuICBcclxuICAgIGZvciAobGV0IG9mZnNldCA9IDA7IG9mZnNldCA8IGJ5dGVDaGFyYWN0ZXJzLmxlbmd0aDsgb2Zmc2V0ICs9IHNsaWNlU2l6ZSkge1xyXG4gICAgICBjb25zdCBzbGljZSA9IGJ5dGVDaGFyYWN0ZXJzLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgc2xpY2VTaXplKTtcclxuICBcclxuICAgICAgY29uc3QgYnl0ZU51bWJlcnMgPSBuZXcgQXJyYXkoc2xpY2UubGVuZ3RoKTtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbGljZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGJ5dGVOdW1iZXJzW2ldID0gc2xpY2UuY2hhckNvZGVBdChpKTtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBjb25zdCBieXRlQXJyYXkgPSBuZXcgVWludDhBcnJheShieXRlTnVtYmVycyk7XHJcbiAgICAgIGJ5dGVBcnJheXMucHVzaChieXRlQXJyYXkpO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKGJ5dGVBcnJheXMsIHt0eXBlOiBjb250ZW50VHlwZX0pO1xyXG4gICAgcmV0dXJuIGJsb2I7XHJcbiAgfVxyXG59XHJcbiJdfQ==