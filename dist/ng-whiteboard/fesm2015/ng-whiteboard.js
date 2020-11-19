import { Injectable, ɵɵdefineInjectable, EventEmitter, Component, ViewChild, Input, Output, NgModule } from '@angular/core';
import { Subject } from 'rxjs';
import { line, curveBasis, select, drag, event, mouse } from 'd3';

/**
 * @fileoverview added by tsickle
 * Generated from: lib/ng-whiteboard.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NgWhiteboardService {
    constructor() {
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
    /**
     * @return {?}
     */
    erase() {
        this.eraseSvgMethodCallSource.next();
    }
    /**
     * @param {?=} name
     * @param {?=} format
     * @return {?}
     */
    save(name = 'New image', format = 'png') {
        this.saveSvgMethodCallSource.next({ name, format });
    }
    /**
     * @return {?}
     */
    undo() {
        this.undoSvgMethodCallSource.next();
    }
    /**
     * @return {?}
     */
    redo() {
        this.redoSvgMethodCallSource.next();
    }
    /**
     * @param {?} image
     * @return {?}
     */
    addImage(image) {
        this.addImageMethodCallSource.next(image);
    }
}
NgWhiteboardService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */ NgWhiteboardService.ɵprov = ɵɵdefineInjectable({ factory: function NgWhiteboardService_Factory() { return new NgWhiteboardService(); }, token: NgWhiteboardService, providedIn: "root" });
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
class WhiteboardOptions {
    constructor() {
        this.color = '#000000';
        this.backgroundColor = '#ffffff';
        this.size = '5px';
        this.linejoin = 'round';
        this.linecap = 'round';
    }
}
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
const ActionType = {
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
class NgWhiteboardComponent {
    /**
     * @param {?} whiteboardService
     */
    constructor(whiteboardService) {
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
        (b64DataUrl, sliceSize = 512) => {
            /** @type {?} */
            var arr = b64DataUrl.split(",");
            /** @type {?} */
            var contentType = arr[0].match(/:(.*?);/)[1];
            /** @type {?} */
            const byteCharacters = atob(arr[1]);
            /** @type {?} */
            const byteArrays = [];
            for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                /** @type {?} */
                const slice = byteCharacters.slice(offset, offset + sliceSize);
                /** @type {?} */
                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                /** @type {?} */
                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }
            /** @type {?} */
            const blob = new Blob(byteArrays, { type: contentType });
            return blob;
        });
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.subscriptionList.push(this.whiteboardService.eraseSvgMethodCalled$.subscribe((/**
         * @return {?}
         */
        () => this.eraseSvg(this.selection))));
        this.subscriptionList.push(this.whiteboardService.saveSvgMethodCalled$.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ name, format }) => this.saveSvg(name, format))));
        this.subscriptionList.push(this.whiteboardService.undoSvgMethodCalled$.subscribe((/**
         * @return {?}
         */
        () => this.undoDraw())));
        this.subscriptionList.push(this.whiteboardService.redoSvgMethodCalled$.subscribe((/**
         * @return {?}
         */
        () => this.redoDraw())));
        this.subscriptionList.push(this.whiteboardService.addImageMethodCalled$.subscribe((/**
         * @param {?} image
         * @return {?}
         */
        (image) => this.addImage(image))));
        this.selection = this.initSvg(this.svgContainer.nativeElement);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.subscriptionList.forEach((/**
         * @param {?} subscription
         * @return {?}
         */
        (subscription) => this._unsubscribe(subscription)));
    }
    /**
     * @private
     * @param {?} selector
     * @return {?}
     */
    initSvg(selector) {
        /** @type {?} */
        const d3Line = line().curve(curveBasis);
        /** @type {?} */
        const svg = select(selector).call(drag()
            .container(selector)
            .subject((/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const p = [event.x, event.y];
            return [p, p];
        }))
            .on('start', (/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const d = event.subject;
            /** @type {?} */
            const active = svg
                .append('path')
                .datum(d)
                .attr('class', 'line')
                .attr('style', `
           fill: none;
           stroke: ${this.color || this.whiteboardOptions.color};
           stroke-width: ${this.size || this.whiteboardOptions.size};
           stroke-linejoin: ${this.linejoin || this.whiteboardOptions.linejoin};
           stroke-linecap: ${this.linecap || this.whiteboardOptions.linecap};
           `);
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
            () => {
                active.attr('d', d3Line);
                if (this.undoStack.length < 1) {
                    this.redoStack = [];
                }
                this.undoStack.push({ type: ActionType.Line, line: active.node() });
            }));
        })));
        this.init.emit();
        return svg;
    }
    /**
     * @private
     * @param {?} image
     * @return {?}
     */
    addImage(image) {
        this.drawImage(image);
    }
    /**
     * @private
     * @param {?} svg
     * @return {?}
     */
    eraseSvg(svg) {
        svg.selectAll('*').remove();
        this.undoStack = [];
        this.redoStack = [];
        this.clear.emit();
    }
    /**
     * @private
     * @param {?} name
     * @param {?} format
     * @return {?}
     */
    saveSvg(name, format) {
        /** @type {?} */
        const svgString = this.saveAsSvg(this.selection.clone(true).node());
        if (format === 'svg') {
            this.download('data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString))), name);
        }
        else {
            this.svgString2Image(svgString, Number(this.selection.style('width').replace('px', '')), Number(this.selection.style('height').replace('px', '')), format, (/**
             * @param {?} img
             * @return {?}
             */
            (img) => {
                this.download(img, name);
            }));
        }
        // this.save.emit();
    }
    /**
     * @private
     * @return {?}
     */
    undoDraw() {
        if (!this.undoStack.length) {
            return;
        }
        this.redoStack.push(this.undoStack.pop());
        this.selection.selectAll('.line').remove();
        this.undoStack.forEach((/**
         * @param {?} action
         * @return {?}
         */
        (action) => {
            if (action.type === ActionType.Line) {
                this.drawLine(action.line);
            }
            else if (action.type === ActionType.Image) {
                this.drawLine(action.image);
            }
        }));
        this.undo.emit();
    }
    /**
     * @private
     * @return {?}
     */
    redoDraw() {
        if (!this.redoStack.length) {
            return;
        }
        this.undoStack.push(this.redoStack.pop());
        this.selection.selectAll('.line').remove();
        this.undoStack.forEach((/**
         * @param {?} action
         * @return {?}
         */
        (action) => {
            if (action.type === ActionType.Line) {
                this.drawLine(action.line);
            }
            else if (action.type === ActionType.Image) {
                this.drawLine(action.image);
            }
        }));
        this.redo.emit();
    }
    /**
     * @private
     * @param {?} pathNode
     * @return {?}
     */
    drawLine(pathNode) {
        this.selection.node().appendChild(pathNode);
    }
    /**
     * @private
     * @param {?} image
     * @return {?}
     */
    drawImage(image) {
        /** @type {?} */
        const group = this.selection
            .append('g')
            .data([{ x: 20, y: 20, r: 1, scale: 1 }])
            .attr('x', 0)
            .attr('y', 0)
            .attr('transform', 'translate(0,0)');
        /** @type {?} */
        const tempImg = new Image();
        tempImg.onload = (/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const aspectRatio = tempImg.width / tempImg.height;
            /** @type {?} */
            const height = Number(this.selection.style('height').replace('px', ''));
            // tempImg.height > Number(this.selection.style('height').replace('px', ''))
            //   ? Number(this.selection.style('height').replace('px', '')) - 40
            //   : tempImg.height;
            /** @type {?} */
            const width = Number(this.selection.style('width').replace('px', ''));
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
            (d) => {
                return '#cccccc';
            }))
                .call(drag()
                .subject((/**
             * @return {?}
             */
            () => {
                /** @type {?} */
                const p = [event.x, event.y];
                return [p, p];
            }))
                .on('start', (/**
             * @return {?}
             */
            () => {
                event.on('drag', (/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) {
                    /** @type {?} */
                    const cursor = select(this);
                    /** @type {?} */
                    const cord = mouse(this);
                    d.x += cord[0] - Number(cursor.attr('width')) / 2;
                    d.y += cord[1] - Number(cursor.attr('height')) / 2;
                    select(this.parentNode).attr('transform', (/**
                     * @return {?}
                     */
                    () => {
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
    }
    /**
     * @private
     * @param {?} subscription
     * @return {?}
     */
    _unsubscribe(subscription) {
        if (subscription) {
            subscription.unsubscribe();
        }
    }
    /**
     * @private
     * @param {?} svgString
     * @param {?} width
     * @param {?} height
     * @param {?} format
     * @param {?} callback
     * @return {?}
     */
    svgString2Image(svgString, width, height, format, callback) {
        // set default for format parameter
        format = format || 'png';
        // SVG data URL from SVG string
        /** @type {?} */
        const svgData = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
        // create canvas in memory(not in DOM)
        /** @type {?} */
        const canvas = document.createElement('canvas');
        // get canvas context for drawing on canvas
        /** @type {?} */
        const context = canvas.getContext('2d');
        // set canvas size
        canvas.width = width;
        canvas.height = height;
        // create image in memory(not in DOM)
        /** @type {?} */
        const image = new Image();
        // later when image loads run this
        image.onload = (/**
         * @return {?}
         */
        () => {
            // async (happens later)
            // clear canvas
            context.clearRect(0, 0, width, height);
            // draw image with SVG data to canvas
            context.drawImage(image, 0, 0, width, height);
            // snapshot canvas as png
            /** @type {?} */
            const pngData = canvas.toDataURL('image/' + format);
            // pass png data URL to callback
            callback(pngData);
        }); // end async
        // start loading SVG data into in memory image
        image.src = svgData;
    }
    /**
     * @private
     * @param {?} svgNode
     * @return {?}
     */
    saveAsSvg(svgNode) {
        svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
        /** @type {?} */
        const serializer = new XMLSerializer();
        /** @type {?} */
        let svgString = serializer.serializeToString(svgNode);
        svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
        svgString = svgString.replace(/NS\d+:href/g, 'xlink:href');
        return svgString;
    }
    /**
     * @private
     * @param {?} url
     * @param {?} name
     * @return {?}
     */
    download(url, name) {
        /** @type {?} */
        var file = this.b64toBlob(url);
        this.save.emit(file);
        return file;
    }
}
NgWhiteboardComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line: component-selector
                selector: 'ng-whiteboard-btc',
                template: `
    <svg #svgContainer [style.background-color]="this.backgroundColor || this.whiteboardOptions.backgroundColor"></svg>
  `,
                styles: [":host{width:inherit;height:inherit;min-width:inherit;min-height:inherit;max-width:inherit;max-height:inherit}:host svg{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;width:inherit;height:inherit;min-width:inherit;min-height:inherit;max-width:inherit;max-height:inherit;cursor:url(cursor.svg) 5 5,crosshair;background-size:cover;background-position:50%;background-repeat:no-repeat}:host svg .bg-image{position:relative}:host svg .bg-image .image-cursor{position:absolute;width:10px;height:10px;background-color:#080;top:0;right:0}"]
            }] }
];
/** @nocollapse */
NgWhiteboardComponent.ctorParameters = () => [
    { type: NgWhiteboardService }
];
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

/**
 * @fileoverview added by tsickle
 * Generated from: lib/ng-whiteboard.module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NgWhiteboardModule {
}
NgWhiteboardModule.decorators = [
    { type: NgModule, args: [{
                declarations: [NgWhiteboardComponent],
                imports: [],
                exports: [NgWhiteboardComponent]
            },] }
];

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
