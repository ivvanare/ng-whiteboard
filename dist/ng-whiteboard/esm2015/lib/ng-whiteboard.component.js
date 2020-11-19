/**
 * @fileoverview added by tsickle
 * Generated from: lib/ng-whiteboard.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { NgWhiteboardService } from './ng-whiteboard.service';
import { WhiteboardOptions, ActionType } from './ng-whiteboard.types';
import { curveBasis, select, drag, line, event, mouse } from 'd3';
export class NgWhiteboardComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctd2hpdGVib2FyZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy13aGl0ZWJvYXJkLyIsInNvdXJjZXMiOlsibGliL25nLXdoaXRlYm9hcmQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBaUIsU0FBUyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQWEsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN4SCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUU5RCxPQUFPLEVBQUUsaUJBQWlCLEVBQWUsVUFBVSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDbkYsT0FBTyxFQUFvQixVQUFVLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBYSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLElBQUksQ0FBQztBQVUvRixNQUFNLE9BQU8scUJBQXFCOzs7O0lBdUJoQyxZQUFvQixpQkFBc0M7UUFBdEMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFxQjtRQXJCakQsc0JBQWlCLEdBQXNCLElBQUksaUJBQWlCLEVBQUUsQ0FBQztRQU85RCxTQUFJLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUMxQixVQUFLLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUMzQixTQUFJLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUMxQixTQUFJLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUMxQixTQUFJLEdBQXNCLElBQUksWUFBWSxFQUF3QixDQUFDO1FBQ25FLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRWxDLGNBQVMsR0FBNkMsU0FBUyxDQUFDO1FBRWhFLHFCQUFnQixHQUFtQixFQUFFLENBQUM7UUFFdEMsY0FBUyxHQUFrQixFQUFFLENBQUM7UUFDOUIsY0FBUyxHQUFrQixFQUFFLENBQUM7Ozs7Ozs7UUEyUXRDLGNBQVM7Ozs7O1FBQUcsQ0FBQyxVQUFVLEVBQUUsU0FBUyxHQUFDLEdBQUcsRUFBRSxFQUFFOztnQkFDcEMsR0FBRyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDOztnQkFDM0IsV0FBVyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDOztrQkFDdEMsY0FBYyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7O2tCQUM3QixVQUFVLEdBQUcsRUFBRTtZQUVyQixLQUFLLElBQUksTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsY0FBYyxDQUFDLE1BQU0sRUFBRSxNQUFNLElBQUksU0FBUyxFQUFFOztzQkFDbEUsS0FBSyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLE1BQU0sR0FBRyxTQUFTLENBQUM7O3NCQUV4RCxXQUFXLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztnQkFDM0MsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3JDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN0Qzs7c0JBRUssU0FBUyxHQUFHLElBQUksVUFBVSxDQUFDLFdBQVcsQ0FBQztnQkFDN0MsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUM1Qjs7a0JBRUssSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFDLElBQUksRUFBRSxXQUFXLEVBQUMsQ0FBQztZQUN0RCxPQUFPLElBQUksQ0FBQztRQUNkLENBQUMsRUFBQTtJQTdSNEQsQ0FBQzs7OztJQUU5RCxlQUFlO1FBQ2IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FDeEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLHFCQUFxQixDQUFDLFNBQVM7OztRQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFDLENBQzVGLENBQUM7UUFFRixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUN4QixJQUFJLENBQUMsaUJBQWlCLENBQUMsb0JBQW9CLENBQUMsU0FBUzs7OztRQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxFQUFDLENBQ3hHLENBQUM7UUFDRixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTOzs7UUFBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUMsQ0FBQyxDQUFDO1FBQ3pHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLG9CQUFvQixDQUFDLFNBQVM7OztRQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBQyxDQUFDLENBQUM7UUFDekcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMscUJBQXFCLENBQUMsU0FBUzs7OztRQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUVwSCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNqRSxDQUFDOzs7O0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPOzs7O1FBQUMsQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLEVBQUMsQ0FBQztJQUNuRixDQUFDOzs7Ozs7SUFFTyxPQUFPLENBQUMsUUFBMEI7O2NBQ2xDLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDOztjQUNqQyxHQUFHLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FDL0IsSUFBSSxFQUFFO2FBQ0gsU0FBUyxDQUFDLFFBQVEsQ0FBQzthQUNuQixPQUFPOzs7UUFBQyxHQUFHLEVBQUU7O2tCQUNOLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUM1QixPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLENBQUMsRUFBQzthQUNELEVBQUUsQ0FBQyxPQUFPOzs7UUFBRSxHQUFHLEVBQUU7O2tCQUNWLENBQUMsR0FBRyxLQUFLLENBQUMsT0FBTzs7a0JBQ2pCLE1BQU0sR0FBRyxHQUFHO2lCQUNmLE1BQU0sQ0FBQyxNQUFNLENBQUM7aUJBQ2QsS0FBSyxDQUFDLENBQUMsQ0FBQztpQkFDUixJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQztpQkFDckIsSUFBSSxDQUNILE9BQU8sRUFDUDs7cUJBRU8sSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSzsyQkFDcEMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSTs4QkFDckMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUTs2QkFDakQsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTztZQUMvRCxDQUNDO1lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDekIsS0FBSyxDQUFDLEVBQUUsQ0FBQyxNQUFNOzs7WUFBRTtnQkFDZixNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMzQixDQUFDLEVBQUMsQ0FBQztZQUNILEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSzs7O1lBQUUsR0FBRyxFQUFFO2dCQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDekIsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQzdCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO2lCQUNyQjtnQkFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxVQUFVLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3RFLENBQUMsRUFBQyxDQUFDO1FBQ0wsQ0FBQyxFQUFDLENBQ0w7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2pCLE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQzs7Ozs7O0lBRU8sUUFBUSxDQUFDLEtBQTJCO1FBQzFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEIsQ0FBQzs7Ozs7O0lBRU8sUUFBUSxDQUFDLEdBQTZDO1FBQzVELEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNwQixDQUFDOzs7Ozs7O0lBRU8sT0FBTyxDQUFDLElBQUksRUFBRSxNQUE4Qjs7Y0FDNUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbkUsSUFBSSxNQUFNLEtBQUssS0FBSyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsNEJBQTRCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDbkc7YUFBTTtZQUNMLElBQUksQ0FBQyxlQUFlLENBQ2xCLFNBQVMsRUFDVCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUN2RCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUN4RCxNQUFNOzs7O1lBQ04sQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDTixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMzQixDQUFDLEVBQ0YsQ0FBQztTQUNIO1FBRUQsb0JBQW9CO0lBQ3RCLENBQUM7Ozs7O0lBRU8sUUFBUTtRQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRTtZQUMxQixPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPOzs7O1FBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUNoQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssVUFBVSxDQUFDLElBQUksRUFBRTtnQkFDbkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDNUI7aUJBQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLFVBQVUsQ0FBQyxLQUFLLEVBQUU7Z0JBQzNDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQzdCO1FBQ0gsQ0FBQyxFQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ25CLENBQUM7Ozs7O0lBRU8sUUFBUTtRQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRTtZQUMxQixPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPOzs7O1FBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUNoQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssVUFBVSxDQUFDLElBQUksRUFBRTtnQkFDbkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDNUI7aUJBQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLFVBQVUsQ0FBQyxLQUFLLEVBQUU7Z0JBQzNDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQzdCO1FBQ0gsQ0FBQyxFQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ25CLENBQUM7Ozs7OztJQUVPLFFBQVEsQ0FBQyxRQUFzQztRQUNyRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM5QyxDQUFDOzs7Ozs7SUFFTyxTQUFTLENBQUMsS0FBMkI7O2NBQ3JDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUzthQUN6QixNQUFNLENBQUMsR0FBRyxDQUFDO2FBQ1gsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUN4QyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQzthQUNaLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2FBQ1osSUFBSSxDQUFDLFdBQVcsRUFBRSxnQkFBZ0IsQ0FBQzs7Y0FFaEMsT0FBTyxHQUFHLElBQUksS0FBSyxFQUFFO1FBQzNCLE9BQU8sQ0FBQyxNQUFNOzs7UUFBRyxHQUFHLEVBQUU7O2tCQUNkLFdBQVcsR0FBRyxPQUFPLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxNQUFNOztrQkFDNUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7OztrQkFJakUsS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3JFLDJFQUEyRTtZQUMzRSxvRkFBb0Y7WUFDcEYscUJBQXFCO1lBQ3JCLEtBQUs7aUJBQ0YsTUFBTSxDQUFDLE9BQU8sQ0FBQztpQkFDZixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztpQkFDWixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztpQkFDWixJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQztpQkFDdEIsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUM7aUJBQ3BCLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxNQUFNLENBQUM7aUJBQ25DLElBQUksQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFFeEMsS0FBSztpQkFDRixNQUFNLENBQUMsTUFBTSxDQUFDO2lCQUNkLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2lCQUNaLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2lCQUNaLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDO2lCQUNqQixJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQztpQkFDbEIsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7aUJBQ25CLElBQUksQ0FBQyxNQUFNOzs7O1lBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDbEIsT0FBTyxTQUFTLENBQUM7WUFDbkIsQ0FBQyxFQUFDO2lCQUNELElBQUksQ0FDSCxJQUFJLEVBQUU7aUJBQ0gsT0FBTzs7O1lBQUMsR0FBRyxFQUFFOztzQkFDTixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDaEIsQ0FBQyxFQUFDO2lCQUNELEVBQUUsQ0FBQyxPQUFPOzs7WUFBRSxHQUFHLEVBQUU7Z0JBQ2hCLEtBQUssQ0FBQyxFQUFFLENBQUMsTUFBTTs7OztnQkFBRSxVQUFVLENBQUM7OzBCQUNwQixNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQzs7MEJBQ3JCLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO29CQUV4QixDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDbEQsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ25ELE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVc7OztvQkFBRSxHQUFHLEVBQUU7d0JBQzdDLE9BQU8sQ0FDTCxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxXQUFXLEdBQUcsQ0FBQyxHQUFHLG1CQUFtQixHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUNsRyxDQUFDO29CQUNKLENBQUMsRUFBQyxDQUFDO2dCQUNMLENBQUMsRUFBQyxDQUFDO1lBQ0wsQ0FBQyxFQUFDLENBQ0wsQ0FBQztZQUNKLEtBQUs7aUJBQ0YsRUFBRSxDQUFDLFdBQVc7OztZQUFFO2dCQUNmLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNwRCxDQUFDLEVBQUM7aUJBQ0QsRUFBRSxDQUFDLFVBQVU7OztZQUFFO2dCQUNkLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNsRCxDQUFDLEVBQUMsQ0FBQztZQUNMLHdFQUF3RTtRQUMxRSxDQUFDLENBQUEsQ0FBQztRQUNGLE9BQU8sQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2pDLENBQUM7Ozs7OztJQUVPLFlBQVksQ0FBQyxZQUEwQjtRQUM3QyxJQUFJLFlBQVksRUFBRTtZQUNoQixZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDNUI7SUFDSCxDQUFDOzs7Ozs7Ozs7O0lBRU8sZUFBZSxDQUNyQixTQUFpQixFQUNqQixLQUFhLEVBQ2IsTUFBYyxFQUNkLE1BQWMsRUFDZCxRQUErQjtRQUUvQixtQ0FBbUM7UUFDbkMsTUFBTSxHQUFHLE1BQU0sSUFBSSxLQUFLLENBQUM7OztjQUVuQixPQUFPLEdBQUcsNEJBQTRCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDOzs7Y0FFdEYsTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDOzs7Y0FFekMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO1FBQ3ZDLGtCQUFrQjtRQUNsQixNQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNyQixNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7O2NBRWpCLEtBQUssR0FBRyxJQUFJLEtBQUssRUFBRTtRQUN6QixrQ0FBa0M7UUFDbEMsS0FBSyxDQUFDLE1BQU07OztRQUFHLEdBQUcsRUFBRTtZQUNsQix3QkFBd0I7WUFDeEIsZUFBZTtZQUNmLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDdkMscUNBQXFDO1lBQ3JDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDOzs7a0JBRXhDLE9BQU8sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUM7WUFDbkQsZ0NBQWdDO1lBQ2hDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNwQixDQUFDLENBQUEsQ0FBQyxDQUFDLFlBQVk7UUFDZiw4Q0FBOEM7UUFDOUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUM7SUFDdEIsQ0FBQzs7Ozs7O0lBRU8sU0FBUyxDQUFDLE9BQU87UUFDdkIsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsOEJBQThCLENBQUMsQ0FBQzs7Y0FDeEQsVUFBVSxHQUFHLElBQUksYUFBYSxFQUFFOztZQUNsQyxTQUFTLEdBQUcsVUFBVSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQztRQUNyRCxTQUFTLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDLG1DQUFtQztRQUNyRyxTQUFTLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDM0QsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQzs7Ozs7OztJQUVPLFFBQVEsQ0FBQyxHQUFXLEVBQUUsSUFBWTs7WUFDcEMsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDO1FBQzlCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXJCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQzs7O1lBaFNGLFNBQVMsU0FBQzs7Z0JBRVQsUUFBUSxFQUFFLG1CQUFtQjtnQkFDN0IsUUFBUSxFQUFFOztHQUVUOzthQUVGOzs7O1lBWlEsbUJBQW1COzs7MkJBY3pCLFNBQVMsU0FBQyxjQUFjLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO2dDQUMzQyxLQUFLO29CQUNMLEtBQUs7OEJBQ0wsS0FBSzttQkFDTCxLQUFLO3VCQUNMLEtBQUs7c0JBQ0wsS0FBSzttQkFFTCxNQUFNO29CQUNOLE1BQU07bUJBQ04sTUFBTTttQkFDTixNQUFNO21CQUNOLE1BQU07eUJBQ04sTUFBTTs7Ozs7OztJQWJQLDZDQUFpRzs7SUFDakcsa0RBQXdFOztJQUN4RSxzQ0FBdUI7O0lBQ3ZCLGdEQUFpQzs7SUFDakMscUNBQXNCOztJQUN0Qix5Q0FBdUU7O0lBQ3ZFLHdDQUE4Qzs7SUFFOUMscUNBQW9DOztJQUNwQyxzQ0FBcUM7O0lBQ3JDLHFDQUFvQzs7SUFDcEMscUNBQW9DOztJQUNwQyxxQ0FBNkU7O0lBQzdFLDJDQUEwQzs7Ozs7SUFFMUMsMENBQXdFOzs7OztJQUV4RSxpREFBOEM7Ozs7O0lBRTlDLDBDQUFzQzs7Ozs7SUFDdEMsMENBQXNDOzs7Ozs7OztJQTJRdEMsMENBb0JDOzs7OztJQTdSVyxrREFBOEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEFmdGVyVmlld0luaXQsIFZpZXdDaGlsZCwgSW5wdXQsIEVsZW1lbnRSZWYsIE9uRGVzdHJveSwgT3V0cHV0LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTmdXaGl0ZWJvYXJkU2VydmljZSB9IGZyb20gJy4vbmctd2hpdGVib2FyZC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IFdoaXRlYm9hcmRPcHRpb25zLCBBY3Rpb25TdGFjaywgQWN0aW9uVHlwZSB9IGZyb20gJy4vbmctd2hpdGVib2FyZC50eXBlcyc7XHJcbmltcG9ydCB7IENvbnRhaW5lckVsZW1lbnQsIGN1cnZlQmFzaXMsIHNlbGVjdCwgZHJhZywgU2VsZWN0aW9uLCBsaW5lLCBldmVudCwgbW91c2UgfSBmcm9tICdkMyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGNvbXBvbmVudC1zZWxlY3RvclxyXG4gIHNlbGVjdG9yOiAnbmctd2hpdGVib2FyZC1idGMnLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8c3ZnICNzdmdDb250YWluZXIgW3N0eWxlLmJhY2tncm91bmQtY29sb3JdPVwidGhpcy5iYWNrZ3JvdW5kQ29sb3IgfHwgdGhpcy53aGl0ZWJvYXJkT3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3JcIj48L3N2Zz5cclxuICBgLFxyXG4gIHN0eWxlVXJsczogWyduZy13aGl0ZWJvYXJkLmNvbXBvbmVudC5zY3NzJ10sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ1doaXRlYm9hcmRDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xyXG4gIEBWaWV3Q2hpbGQoJ3N2Z0NvbnRhaW5lcicsIHsgc3RhdGljOiBmYWxzZSB9KSBwcml2YXRlIHN2Z0NvbnRhaW5lcjogRWxlbWVudFJlZjxDb250YWluZXJFbGVtZW50PjtcclxuICBASW5wdXQoKSB3aGl0ZWJvYXJkT3B0aW9uczogV2hpdGVib2FyZE9wdGlvbnMgPSBuZXcgV2hpdGVib2FyZE9wdGlvbnMoKTtcclxuICBASW5wdXQoKSBjb2xvcjogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIGJhY2tncm91bmRDb2xvcjogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIHNpemU6IHN0cmluZztcclxuICBASW5wdXQoKSBsaW5lam9pbjogJ21pdGVyJyB8ICdyb3VuZCcgfCAnYmV2ZWwnIHwgJ21pdGVyLWNsaXAnIHwgJ2FyY3MnO1xyXG4gIEBJbnB1dCgpIGxpbmVjYXA6ICdidXR0JyB8ICdzcXVhcmUnIHwgJ3JvdW5kJztcclxuXHJcbiAgQE91dHB1dCgpIGluaXQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIGNsZWFyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSB1bmRvID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSByZWRvID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSBzYXZlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nIHwgQmxvYiB8IEZpbGU+KCk7XHJcbiAgQE91dHB1dCgpIGltYWdlQWRkZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIHByaXZhdGUgc2VsZWN0aW9uOiBTZWxlY3Rpb248YW55LCB1bmtub3duLCBudWxsLCB1bmRlZmluZWQ+ID0gdW5kZWZpbmVkO1xyXG5cclxuICBwcml2YXRlIHN1YnNjcmlwdGlvbkxpc3Q6IFN1YnNjcmlwdGlvbltdID0gW107XHJcblxyXG4gIHByaXZhdGUgdW5kb1N0YWNrOiBBY3Rpb25TdGFja1tdID0gW107XHJcbiAgcHJpdmF0ZSByZWRvU3RhY2s6IEFjdGlvblN0YWNrW10gPSBbXTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSB3aGl0ZWJvYXJkU2VydmljZTogTmdXaGl0ZWJvYXJkU2VydmljZSkge31cclxuXHJcbiAgbmdBZnRlclZpZXdJbml0KCkge1xyXG4gICAgdGhpcy5zdWJzY3JpcHRpb25MaXN0LnB1c2goXHJcbiAgICAgIHRoaXMud2hpdGVib2FyZFNlcnZpY2UuZXJhc2VTdmdNZXRob2RDYWxsZWQkLnN1YnNjcmliZSgoKSA9PiB0aGlzLmVyYXNlU3ZnKHRoaXMuc2VsZWN0aW9uKSlcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5zdWJzY3JpcHRpb25MaXN0LnB1c2goXHJcbiAgICAgIHRoaXMud2hpdGVib2FyZFNlcnZpY2Uuc2F2ZVN2Z01ldGhvZENhbGxlZCQuc3Vic2NyaWJlKCh7IG5hbWUsIGZvcm1hdCB9KSA9PiB0aGlzLnNhdmVTdmcobmFtZSwgZm9ybWF0KSlcclxuICAgICk7XHJcbiAgICB0aGlzLnN1YnNjcmlwdGlvbkxpc3QucHVzaCh0aGlzLndoaXRlYm9hcmRTZXJ2aWNlLnVuZG9TdmdNZXRob2RDYWxsZWQkLnN1YnNjcmliZSgoKSA9PiB0aGlzLnVuZG9EcmF3KCkpKTtcclxuICAgIHRoaXMuc3Vic2NyaXB0aW9uTGlzdC5wdXNoKHRoaXMud2hpdGVib2FyZFNlcnZpY2UucmVkb1N2Z01ldGhvZENhbGxlZCQuc3Vic2NyaWJlKCgpID0+IHRoaXMucmVkb0RyYXcoKSkpO1xyXG4gICAgdGhpcy5zdWJzY3JpcHRpb25MaXN0LnB1c2godGhpcy53aGl0ZWJvYXJkU2VydmljZS5hZGRJbWFnZU1ldGhvZENhbGxlZCQuc3Vic2NyaWJlKChpbWFnZSkgPT4gdGhpcy5hZGRJbWFnZShpbWFnZSkpKTtcclxuXHJcbiAgICB0aGlzLnNlbGVjdGlvbiA9IHRoaXMuaW5pdFN2Zyh0aGlzLnN2Z0NvbnRhaW5lci5uYXRpdmVFbGVtZW50KTtcclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xyXG4gICAgdGhpcy5zdWJzY3JpcHRpb25MaXN0LmZvckVhY2goKHN1YnNjcmlwdGlvbikgPT4gdGhpcy5fdW5zdWJzY3JpYmUoc3Vic2NyaXB0aW9uKSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluaXRTdmcoc2VsZWN0b3I6IENvbnRhaW5lckVsZW1lbnQpIHtcclxuICAgIGNvbnN0IGQzTGluZSA9IGxpbmUoKS5jdXJ2ZShjdXJ2ZUJhc2lzKTtcclxuICAgIGNvbnN0IHN2ZyA9IHNlbGVjdChzZWxlY3RvcikuY2FsbChcclxuICAgICAgZHJhZygpXHJcbiAgICAgICAgLmNvbnRhaW5lcihzZWxlY3RvcilcclxuICAgICAgICAuc3ViamVjdCgoKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBwID0gW2V2ZW50LngsIGV2ZW50LnldO1xyXG4gICAgICAgICAgcmV0dXJuIFtwLCBwXTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5vbignc3RhcnQnLCAoKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBkID0gZXZlbnQuc3ViamVjdDtcclxuICAgICAgICAgIGNvbnN0IGFjdGl2ZSA9IHN2Z1xyXG4gICAgICAgICAgICAuYXBwZW5kKCdwYXRoJylcclxuICAgICAgICAgICAgLmRhdHVtKGQpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdsaW5lJylcclxuICAgICAgICAgICAgLmF0dHIoXHJcbiAgICAgICAgICAgICAgJ3N0eWxlJyxcclxuICAgICAgICAgICAgICBgXHJcbiAgICAgICAgICAgZmlsbDogbm9uZTtcclxuICAgICAgICAgICBzdHJva2U6ICR7dGhpcy5jb2xvciB8fCB0aGlzLndoaXRlYm9hcmRPcHRpb25zLmNvbG9yfTtcclxuICAgICAgICAgICBzdHJva2Utd2lkdGg6ICR7dGhpcy5zaXplIHx8IHRoaXMud2hpdGVib2FyZE9wdGlvbnMuc2l6ZX07XHJcbiAgICAgICAgICAgc3Ryb2tlLWxpbmVqb2luOiAke3RoaXMubGluZWpvaW4gfHwgdGhpcy53aGl0ZWJvYXJkT3B0aW9ucy5saW5lam9pbn07XHJcbiAgICAgICAgICAgc3Ryb2tlLWxpbmVjYXA6ICR7dGhpcy5saW5lY2FwIHx8IHRoaXMud2hpdGVib2FyZE9wdGlvbnMubGluZWNhcH07XHJcbiAgICAgICAgICAgYFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgYWN0aXZlLmF0dHIoJ2QnLCBkM0xpbmUpO1xyXG4gICAgICAgICAgZXZlbnQub24oJ2RyYWcnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGFjdGl2ZS5kYXR1bSgpLnB1c2gobW91c2UodGhpcykpO1xyXG4gICAgICAgICAgICBhY3RpdmUuYXR0cignZCcsIGQzTGluZSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGV2ZW50Lm9uKCdlbmQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGFjdGl2ZS5hdHRyKCdkJywgZDNMaW5lKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMudW5kb1N0YWNrLmxlbmd0aCA8IDEpIHtcclxuICAgICAgICAgICAgICB0aGlzLnJlZG9TdGFjayA9IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudW5kb1N0YWNrLnB1c2goeyB0eXBlOiBBY3Rpb25UeXBlLkxpbmUsIGxpbmU6IGFjdGl2ZS5ub2RlKCkgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KVxyXG4gICAgKTtcclxuICAgIHRoaXMuaW5pdC5lbWl0KCk7XHJcbiAgICByZXR1cm4gc3ZnO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhZGRJbWFnZShpbWFnZTogc3RyaW5nIHwgQXJyYXlCdWZmZXIpIHtcclxuICAgIHRoaXMuZHJhd0ltYWdlKGltYWdlKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZXJhc2VTdmcoc3ZnOiBTZWxlY3Rpb248YW55LCB1bmtub3duLCBudWxsLCB1bmRlZmluZWQ+KSB7XHJcbiAgICBzdmcuc2VsZWN0QWxsKCcqJykucmVtb3ZlKCk7XHJcbiAgICB0aGlzLnVuZG9TdGFjayA9IFtdO1xyXG4gICAgdGhpcy5yZWRvU3RhY2sgPSBbXTtcclxuICAgIHRoaXMuY2xlYXIuZW1pdCgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzYXZlU3ZnKG5hbWUsIGZvcm1hdDogJ3BuZycgfCAnanBlZycgfCAnc3ZnJykge1xyXG4gICAgY29uc3Qgc3ZnU3RyaW5nID0gdGhpcy5zYXZlQXNTdmcodGhpcy5zZWxlY3Rpb24uY2xvbmUodHJ1ZSkubm9kZSgpKTtcclxuICAgIGlmIChmb3JtYXQgPT09ICdzdmcnKSB7XHJcbiAgICAgIHRoaXMuZG93bmxvYWQoJ2RhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsJyArIGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KHN2Z1N0cmluZykpKSwgbmFtZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnN2Z1N0cmluZzJJbWFnZShcclxuICAgICAgICBzdmdTdHJpbmcsXHJcbiAgICAgICAgTnVtYmVyKHRoaXMuc2VsZWN0aW9uLnN0eWxlKCd3aWR0aCcpLnJlcGxhY2UoJ3B4JywgJycpKSxcclxuICAgICAgICBOdW1iZXIodGhpcy5zZWxlY3Rpb24uc3R5bGUoJ2hlaWdodCcpLnJlcGxhY2UoJ3B4JywgJycpKSxcclxuICAgICAgICBmb3JtYXQsXHJcbiAgICAgICAgKGltZykgPT4ge1xyXG4gICAgICAgICAgdGhpcy5kb3dubG9hZChpbWcsIG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB0aGlzLnNhdmUuZW1pdCgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1bmRvRHJhdygpIHtcclxuICAgIGlmICghdGhpcy51bmRvU3RhY2subGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMucmVkb1N0YWNrLnB1c2godGhpcy51bmRvU3RhY2sucG9wKCkpO1xyXG4gICAgdGhpcy5zZWxlY3Rpb24uc2VsZWN0QWxsKCcubGluZScpLnJlbW92ZSgpO1xyXG4gICAgdGhpcy51bmRvU3RhY2suZm9yRWFjaCgoYWN0aW9uKSA9PiB7XHJcbiAgICAgIGlmIChhY3Rpb24udHlwZSA9PT0gQWN0aW9uVHlwZS5MaW5lKSB7XHJcbiAgICAgICAgdGhpcy5kcmF3TGluZShhY3Rpb24ubGluZSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoYWN0aW9uLnR5cGUgPT09IEFjdGlvblR5cGUuSW1hZ2UpIHtcclxuICAgICAgICB0aGlzLmRyYXdMaW5lKGFjdGlvbi5pbWFnZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgdGhpcy51bmRvLmVtaXQoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVkb0RyYXcoKSB7XHJcbiAgICBpZiAoIXRoaXMucmVkb1N0YWNrLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLnVuZG9TdGFjay5wdXNoKHRoaXMucmVkb1N0YWNrLnBvcCgpKTtcclxuICAgIHRoaXMuc2VsZWN0aW9uLnNlbGVjdEFsbCgnLmxpbmUnKS5yZW1vdmUoKTtcclxuICAgIHRoaXMudW5kb1N0YWNrLmZvckVhY2goKGFjdGlvbikgPT4ge1xyXG4gICAgICBpZiAoYWN0aW9uLnR5cGUgPT09IEFjdGlvblR5cGUuTGluZSkge1xyXG4gICAgICAgIHRoaXMuZHJhd0xpbmUoYWN0aW9uLmxpbmUpO1xyXG4gICAgICB9IGVsc2UgaWYgKGFjdGlvbi50eXBlID09PSBBY3Rpb25UeXBlLkltYWdlKSB7XHJcbiAgICAgICAgdGhpcy5kcmF3TGluZShhY3Rpb24uaW1hZ2UpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHRoaXMucmVkby5lbWl0KCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGRyYXdMaW5lKHBhdGhOb2RlOiBTVkdQYXRoRWxlbWVudCB8IFNWR0dFbGVtZW50KSB7XHJcbiAgICB0aGlzLnNlbGVjdGlvbi5ub2RlKCkuYXBwZW5kQ2hpbGQocGF0aE5vZGUpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkcmF3SW1hZ2UoaW1hZ2U6IHN0cmluZyB8IEFycmF5QnVmZmVyKSB7XHJcbiAgICBjb25zdCBncm91cCA9IHRoaXMuc2VsZWN0aW9uXHJcbiAgICAgIC5hcHBlbmQoJ2cnKVxyXG4gICAgICAuZGF0YShbeyB4OiAyMCwgeTogMjAsIHI6IDEsIHNjYWxlOiAxIH1dKVxyXG4gICAgICAuYXR0cigneCcsIDApXHJcbiAgICAgIC5hdHRyKCd5JywgMClcclxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwwKScpO1xyXG5cclxuICAgIGNvbnN0IHRlbXBJbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgIHRlbXBJbWcub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICBjb25zdCBhc3BlY3RSYXRpbyA9IHRlbXBJbWcud2lkdGggLyB0ZW1wSW1nLmhlaWdodDtcclxuICAgICAgY29uc3QgaGVpZ2h0ID0gTnVtYmVyKHRoaXMuc2VsZWN0aW9uLnN0eWxlKCdoZWlnaHQnKS5yZXBsYWNlKCdweCcsICcnKSk7XHJcbiAgICAgIC8vIHRlbXBJbWcuaGVpZ2h0ID4gTnVtYmVyKHRoaXMuc2VsZWN0aW9uLnN0eWxlKCdoZWlnaHQnKS5yZXBsYWNlKCdweCcsICcnKSlcclxuICAgICAgLy8gICA/IE51bWJlcih0aGlzLnNlbGVjdGlvbi5zdHlsZSgnaGVpZ2h0JykucmVwbGFjZSgncHgnLCAnJykpIC0gNDBcclxuICAgICAgLy8gICA6IHRlbXBJbWcuaGVpZ2h0O1xyXG4gICAgICBjb25zdCB3aWR0aCA9IE51bWJlcih0aGlzLnNlbGVjdGlvbi5zdHlsZSgnd2lkdGgnKS5yZXBsYWNlKCdweCcsICcnKSk7XHJcbiAgICAgIC8vIGhlaWdodCA9PT0gTnVtYmVyKHRoaXMuc2VsZWN0aW9uLnN0eWxlKCdoZWlnaHQnKS5yZXBsYWNlKCdweCcsICcnKSkgLSA0MFxyXG4gICAgICAvLyAgID8gKE51bWJlcih0aGlzLnNlbGVjdGlvbi5zdHlsZSgnaGVpZ2h0JykucmVwbGFjZSgncHgnLCAnJykpIC0gNDApICogYXNwZWN0UmF0aW9cclxuICAgICAgLy8gICA6IHRlbXBJbWcud2lkdGg7XHJcbiAgICAgIGdyb3VwXHJcbiAgICAgICAgLmFwcGVuZCgnaW1hZ2UnKVxyXG4gICAgICAgIC5hdHRyKCd4JywgMClcclxuICAgICAgICAuYXR0cigneScsIDApXHJcbiAgICAgICAgLmF0dHIoJ2hlaWdodCcsIGhlaWdodClcclxuICAgICAgICAuYXR0cignd2lkdGgnLCB3aWR0aClcclxuICAgICAgICAuYXR0cigncHJlc2VydmVBc3BlY3RSYXRpbycsICdub25lJylcclxuICAgICAgICAuYXR0cigneGxpbms6aHJlZicsIGltYWdlLnRvU3RyaW5nKCkpO1xyXG5cclxuICAgICAgZ3JvdXBcclxuICAgICAgICAuYXBwZW5kKCdyZWN0JylcclxuICAgICAgICAuYXR0cigneCcsIDApXHJcbiAgICAgICAgLmF0dHIoJ3knLCAwKVxyXG4gICAgICAgIC5hdHRyKCd3aWR0aCcsIDIwKVxyXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCAyMClcclxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxyXG4gICAgICAgIC5hdHRyKCdmaWxsJywgKGQpID0+IHtcclxuICAgICAgICAgIHJldHVybiAnI2NjY2NjYyc7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2FsbChcclxuICAgICAgICAgIGRyYWcoKVxyXG4gICAgICAgICAgICAuc3ViamVjdCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc3QgcCA9IFtldmVudC54LCBldmVudC55XTtcclxuICAgICAgICAgICAgICByZXR1cm4gW3AsIHBdO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAub24oJ3N0YXJ0JywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIGV2ZW50Lm9uKCdkcmFnJywgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnNvciA9IHNlbGVjdCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvcmQgPSBtb3VzZSh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBkLnggKz0gY29yZFswXSAtIE51bWJlcihjdXJzb3IuYXR0cignd2lkdGgnKSkgLyAyO1xyXG4gICAgICAgICAgICAgICAgZC55ICs9IGNvcmRbMV0gLSBOdW1iZXIoY3Vyc29yLmF0dHIoJ2hlaWdodCcpKSAvIDI7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3QodGhpcy5wYXJlbnROb2RlKS5hdHRyKCd0cmFuc2Zvcm0nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgJ3RyYW5zbGF0ZSgnICsgW2QueCwgZC55XSArICcpLHJvdGF0ZSgnICsgMCArICcsMTYwLCAxNjApLHNjYWxlKCcgKyBkLnNjYWxlICsgJywnICsgZC5zY2FsZSArICcpJ1xyXG4gICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgZ3JvdXBcclxuICAgICAgICAub24oJ21vdXNlb3ZlcicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHNlbGVjdCh0aGlzKS5zZWxlY3QoJ3JlY3QnKS5zdHlsZSgnb3BhY2l0eScsIDEuMCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAub24oJ21vdXNlb3V0JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgc2VsZWN0KHRoaXMpLnNlbGVjdCgncmVjdCcpLnN0eWxlKCdvcGFjaXR5JywgMCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIC8vIHRoaXMudW5kb1N0YWNrLnB1c2goeyB0eXBlOiBBY3Rpb25UeXBlLkltYWdlLCBpbWFnZTogZ3JvdXAubm9kZSgpIH0pO1xyXG4gICAgfTtcclxuICAgIHRlbXBJbWcuc3JjID0gaW1hZ2UudG9TdHJpbmcoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX3Vuc3Vic2NyaWJlKHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uKTogdm9pZCB7XHJcbiAgICBpZiAoc3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzdmdTdHJpbmcySW1hZ2UoXHJcbiAgICBzdmdTdHJpbmc6IHN0cmluZyxcclxuICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICBoZWlnaHQ6IG51bWJlcixcclxuICAgIGZvcm1hdDogc3RyaW5nLFxyXG4gICAgY2FsbGJhY2s6IChpbWc6IHN0cmluZykgPT4gdm9pZFxyXG4gICkge1xyXG4gICAgLy8gc2V0IGRlZmF1bHQgZm9yIGZvcm1hdCBwYXJhbWV0ZXJcclxuICAgIGZvcm1hdCA9IGZvcm1hdCB8fCAncG5nJztcclxuICAgIC8vIFNWRyBkYXRhIFVSTCBmcm9tIFNWRyBzdHJpbmdcclxuICAgIGNvbnN0IHN2Z0RhdGEgPSAnZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCwnICsgYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoc3ZnU3RyaW5nKSkpO1xyXG4gICAgLy8gY3JlYXRlIGNhbnZhcyBpbiBtZW1vcnkobm90IGluIERPTSlcclxuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgLy8gZ2V0IGNhbnZhcyBjb250ZXh0IGZvciBkcmF3aW5nIG9uIGNhbnZhc1xyXG4gICAgY29uc3QgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgLy8gc2V0IGNhbnZhcyBzaXplXHJcbiAgICBjYW52YXMud2lkdGggPSB3aWR0aDtcclxuICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAvLyBjcmVhdGUgaW1hZ2UgaW4gbWVtb3J5KG5vdCBpbiBET00pXHJcbiAgICBjb25zdCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgLy8gbGF0ZXIgd2hlbiBpbWFnZSBsb2FkcyBydW4gdGhpc1xyXG4gICAgaW1hZ2Uub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAvLyBhc3luYyAoaGFwcGVucyBsYXRlcilcclxuICAgICAgLy8gY2xlYXIgY2FudmFzXHJcbiAgICAgIGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAvLyBkcmF3IGltYWdlIHdpdGggU1ZHIGRhdGEgdG8gY2FudmFzXHJcbiAgICAgIGNvbnRleHQuZHJhd0ltYWdlKGltYWdlLCAwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgLy8gc25hcHNob3QgY2FudmFzIGFzIHBuZ1xyXG4gICAgICBjb25zdCBwbmdEYXRhID0gY2FudmFzLnRvRGF0YVVSTCgnaW1hZ2UvJyArIGZvcm1hdCk7XHJcbiAgICAgIC8vIHBhc3MgcG5nIGRhdGEgVVJMIHRvIGNhbGxiYWNrXHJcbiAgICAgIGNhbGxiYWNrKHBuZ0RhdGEpO1xyXG4gICAgfTsgLy8gZW5kIGFzeW5jXHJcbiAgICAvLyBzdGFydCBsb2FkaW5nIFNWRyBkYXRhIGludG8gaW4gbWVtb3J5IGltYWdlXHJcbiAgICBpbWFnZS5zcmMgPSBzdmdEYXRhO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzYXZlQXNTdmcoc3ZnTm9kZSk6IHN0cmluZyB7XHJcbiAgICBzdmdOb2RlLnNldEF0dHJpYnV0ZSgneGxpbmsnLCAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycpO1xyXG4gICAgY29uc3Qgc2VyaWFsaXplciA9IG5ldyBYTUxTZXJpYWxpemVyKCk7XHJcbiAgICBsZXQgc3ZnU3RyaW5nID0gc2VyaWFsaXplci5zZXJpYWxpemVUb1N0cmluZyhzdmdOb2RlKTtcclxuICAgIHN2Z1N0cmluZyA9IHN2Z1N0cmluZy5yZXBsYWNlKC8oXFx3Kyk/Oj94bGluaz0vZywgJ3htbG5zOnhsaW5rPScpOyAvLyBGaXggcm9vdCB4bGluayB3aXRob3V0IG5hbWVzcGFjZVxyXG4gICAgc3ZnU3RyaW5nID0gc3ZnU3RyaW5nLnJlcGxhY2UoL05TXFxkKzpocmVmL2csICd4bGluazpocmVmJyk7XHJcbiAgICByZXR1cm4gc3ZnU3RyaW5nO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkb3dubG9hZCh1cmw6IHN0cmluZywgbmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgIHZhciBmaWxlID0gdGhpcy5iNjR0b0Jsb2IodXJsKTtcclxuICAgIHRoaXMuc2F2ZS5lbWl0KGZpbGUpO1xyXG5cclxuICAgIHJldHVybiBmaWxlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogY29udmVydGlyIGJhc2U2NCBhIGJsb2JcclxuICAgKiBAcGFyYW0gYjY0RGF0YVVybCBcclxuICAgKiBAcGFyYW0gY29udGVudFR5cGUgXHJcbiAgICogQHBhcmFtIHNsaWNlU2l6ZSBcclxuICAgKi9cclxuICBiNjR0b0Jsb2IgPSAoYjY0RGF0YVVybCwgc2xpY2VTaXplPTUxMikgPT4ge1xyXG4gICAgdmFyIGFyciA9IGI2NERhdGFVcmwuc3BsaXQoXCIsXCIpO1xyXG4gICAgdmFyIGNvbnRlbnRUeXBlID0gYXJyWzBdLm1hdGNoKC86KC4qPyk7LylbMV1cclxuICAgIGNvbnN0IGJ5dGVDaGFyYWN0ZXJzID0gYXRvYihhcnJbMV0pO1xyXG4gICAgY29uc3QgYnl0ZUFycmF5cyA9IFtdO1xyXG4gIFxyXG4gICAgZm9yIChsZXQgb2Zmc2V0ID0gMDsgb2Zmc2V0IDwgYnl0ZUNoYXJhY3RlcnMubGVuZ3RoOyBvZmZzZXQgKz0gc2xpY2VTaXplKSB7XHJcbiAgICAgIGNvbnN0IHNsaWNlID0gYnl0ZUNoYXJhY3RlcnMuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBzbGljZVNpemUpO1xyXG4gIFxyXG4gICAgICBjb25zdCBieXRlTnVtYmVycyA9IG5ldyBBcnJheShzbGljZS5sZW5ndGgpO1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNsaWNlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgYnl0ZU51bWJlcnNbaV0gPSBzbGljZS5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGNvbnN0IGJ5dGVBcnJheSA9IG5ldyBVaW50OEFycmF5KGJ5dGVOdW1iZXJzKTtcclxuICAgICAgYnl0ZUFycmF5cy5wdXNoKGJ5dGVBcnJheSk7XHJcbiAgICB9XHJcbiAgXHJcbiAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoYnl0ZUFycmF5cywge3R5cGU6IGNvbnRlbnRUeXBlfSk7XHJcbiAgICByZXR1cm4gYmxvYjtcclxuICB9XHJcbn1cclxuIl19