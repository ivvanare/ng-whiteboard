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
        var file = this.dataURLtoFile(url, name);
        this.save.emit(file);
        return file;
        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute('visibility', 'hidden');
        // link.download = name || 'new white-board';
        // document.body.appendChild(link);
        // link.click();
    }
    /**
     * transformar base64
     * @param {?} dataurl string base64
     * @param {?} filename nombre para el File
     * @return {?}
     */
    dataURLtoFile(dataurl, filename) {
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
     * @type {?}
     * @private
     */
    NgWhiteboardComponent.prototype.whiteboardService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctd2hpdGVib2FyZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy13aGl0ZWJvYXJkLyIsInNvdXJjZXMiOlsibGliL25nLXdoaXRlYm9hcmQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBaUIsU0FBUyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQWEsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN4SCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUU5RCxPQUFPLEVBQUUsaUJBQWlCLEVBQWUsVUFBVSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDbkYsT0FBTyxFQUFvQixVQUFVLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBYSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLElBQUksQ0FBQztBQVUvRixNQUFNLE9BQU8scUJBQXFCOzs7O0lBdUJoQyxZQUFvQixpQkFBc0M7UUFBdEMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFxQjtRQXJCakQsc0JBQWlCLEdBQXNCLElBQUksaUJBQWlCLEVBQUUsQ0FBQztRQU85RCxTQUFJLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUMxQixVQUFLLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUMzQixTQUFJLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUMxQixTQUFJLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUMxQixTQUFJLEdBQXNCLElBQUksWUFBWSxFQUF3QixDQUFDO1FBQ25FLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRWxDLGNBQVMsR0FBNkMsU0FBUyxDQUFDO1FBRWhFLHFCQUFnQixHQUFtQixFQUFFLENBQUM7UUFFdEMsY0FBUyxHQUFrQixFQUFFLENBQUM7UUFDOUIsY0FBUyxHQUFrQixFQUFFLENBQUM7SUFFdUIsQ0FBQzs7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RUQsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3JELENBQUM7OztZQTFURixTQUFTLFNBQUM7O2dCQUVULFFBQVEsRUFBRSxtQkFBbUI7Z0JBQzdCLFFBQVEsRUFBRTs7R0FFVDs7YUFFRjs7OztZQVpRLG1CQUFtQjs7OzJCQWN6QixTQUFTLFNBQUMsY0FBYyxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtnQ0FDM0MsS0FBSztvQkFDTCxLQUFLOzhCQUNMLEtBQUs7bUJBQ0wsS0FBSzt1QkFDTCxLQUFLO3NCQUNMLEtBQUs7bUJBRUwsTUFBTTtvQkFDTixNQUFNO21CQUNOLE1BQU07bUJBQ04sTUFBTTttQkFDTixNQUFNO3lCQUNOLE1BQU07Ozs7Ozs7SUFiUCw2Q0FBaUc7O0lBQ2pHLGtEQUF3RTs7SUFDeEUsc0NBQXVCOztJQUN2QixnREFBaUM7O0lBQ2pDLHFDQUFzQjs7SUFDdEIseUNBQXVFOztJQUN2RSx3Q0FBOEM7O0lBRTlDLHFDQUFvQzs7SUFDcEMsc0NBQXFDOztJQUNyQyxxQ0FBb0M7O0lBQ3BDLHFDQUFvQzs7SUFDcEMscUNBQTZFOztJQUM3RSwyQ0FBMEM7Ozs7O0lBRTFDLDBDQUF3RTs7Ozs7SUFFeEUsaURBQThDOzs7OztJQUU5QywwQ0FBc0M7Ozs7O0lBQ3RDLDBDQUFzQzs7Ozs7SUFFMUIsa0RBQThDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBBZnRlclZpZXdJbml0LCBWaWV3Q2hpbGQsIElucHV0LCBFbGVtZW50UmVmLCBPbkRlc3Ryb3ksIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZ1doaXRlYm9hcmRTZXJ2aWNlIH0gZnJvbSAnLi9uZy13aGl0ZWJvYXJkLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBXaGl0ZWJvYXJkT3B0aW9ucywgQWN0aW9uU3RhY2ssIEFjdGlvblR5cGUgfSBmcm9tICcuL25nLXdoaXRlYm9hcmQudHlwZXMnO1xuaW1wb3J0IHsgQ29udGFpbmVyRWxlbWVudCwgY3VydmVCYXNpcywgc2VsZWN0LCBkcmFnLCBTZWxlY3Rpb24sIGxpbmUsIGV2ZW50LCBtb3VzZSB9IGZyb20gJ2QzJztcblxuQENvbXBvbmVudCh7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogY29tcG9uZW50LXNlbGVjdG9yXG4gIHNlbGVjdG9yOiAnbmctd2hpdGVib2FyZC1idGMnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxzdmcgI3N2Z0NvbnRhaW5lciBbc3R5bGUuYmFja2dyb3VuZC1jb2xvcl09XCJ0aGlzLmJhY2tncm91bmRDb2xvciB8fCB0aGlzLndoaXRlYm9hcmRPcHRpb25zLmJhY2tncm91bmRDb2xvclwiPjwvc3ZnPlxuICBgLFxuICBzdHlsZVVybHM6IFsnbmctd2hpdGVib2FyZC5jb21wb25lbnQuc2NzcyddLFxufSlcbmV4cG9ydCBjbGFzcyBOZ1doaXRlYm9hcmRDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICBAVmlld0NoaWxkKCdzdmdDb250YWluZXInLCB7IHN0YXRpYzogZmFsc2UgfSkgcHJpdmF0ZSBzdmdDb250YWluZXI6IEVsZW1lbnRSZWY8Q29udGFpbmVyRWxlbWVudD47XG4gIEBJbnB1dCgpIHdoaXRlYm9hcmRPcHRpb25zOiBXaGl0ZWJvYXJkT3B0aW9ucyA9IG5ldyBXaGl0ZWJvYXJkT3B0aW9ucygpO1xuICBASW5wdXQoKSBjb2xvcjogc3RyaW5nO1xuICBASW5wdXQoKSBiYWNrZ3JvdW5kQ29sb3I6IHN0cmluZztcbiAgQElucHV0KCkgc2l6ZTogc3RyaW5nO1xuICBASW5wdXQoKSBsaW5lam9pbjogJ21pdGVyJyB8ICdyb3VuZCcgfCAnYmV2ZWwnIHwgJ21pdGVyLWNsaXAnIHwgJ2FyY3MnO1xuICBASW5wdXQoKSBsaW5lY2FwOiAnYnV0dCcgfCAnc3F1YXJlJyB8ICdyb3VuZCc7XG5cbiAgQE91dHB1dCgpIGluaXQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBjbGVhciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHVuZG8gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSByZWRvID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgc2F2ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZyB8IEJsb2IgfCBGaWxlPigpO1xuICBAT3V0cHV0KCkgaW1hZ2VBZGRlZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBwcml2YXRlIHNlbGVjdGlvbjogU2VsZWN0aW9uPGFueSwgdW5rbm93biwgbnVsbCwgdW5kZWZpbmVkPiA9IHVuZGVmaW5lZDtcblxuICBwcml2YXRlIHN1YnNjcmlwdGlvbkxpc3Q6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgcHJpdmF0ZSB1bmRvU3RhY2s6IEFjdGlvblN0YWNrW10gPSBbXTtcbiAgcHJpdmF0ZSByZWRvU3RhY2s6IEFjdGlvblN0YWNrW10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHdoaXRlYm9hcmRTZXJ2aWNlOiBOZ1doaXRlYm9hcmRTZXJ2aWNlKSB7fVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbkxpc3QucHVzaChcbiAgICAgIHRoaXMud2hpdGVib2FyZFNlcnZpY2UuZXJhc2VTdmdNZXRob2RDYWxsZWQkLnN1YnNjcmliZSgoKSA9PiB0aGlzLmVyYXNlU3ZnKHRoaXMuc2VsZWN0aW9uKSlcbiAgICApO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25MaXN0LnB1c2goXG4gICAgICB0aGlzLndoaXRlYm9hcmRTZXJ2aWNlLnNhdmVTdmdNZXRob2RDYWxsZWQkLnN1YnNjcmliZSgoeyBuYW1lLCBmb3JtYXQgfSkgPT4gdGhpcy5zYXZlU3ZnKG5hbWUsIGZvcm1hdCkpXG4gICAgKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbkxpc3QucHVzaCh0aGlzLndoaXRlYm9hcmRTZXJ2aWNlLnVuZG9TdmdNZXRob2RDYWxsZWQkLnN1YnNjcmliZSgoKSA9PiB0aGlzLnVuZG9EcmF3KCkpKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbkxpc3QucHVzaCh0aGlzLndoaXRlYm9hcmRTZXJ2aWNlLnJlZG9TdmdNZXRob2RDYWxsZWQkLnN1YnNjcmliZSgoKSA9PiB0aGlzLnJlZG9EcmF3KCkpKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbkxpc3QucHVzaCh0aGlzLndoaXRlYm9hcmRTZXJ2aWNlLmFkZEltYWdlTWV0aG9kQ2FsbGVkJC5zdWJzY3JpYmUoKGltYWdlKSA9PiB0aGlzLmFkZEltYWdlKGltYWdlKSkpO1xuXG4gICAgdGhpcy5zZWxlY3Rpb24gPSB0aGlzLmluaXRTdmcodGhpcy5zdmdDb250YWluZXIubmF0aXZlRWxlbWVudCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbkxpc3QuZm9yRWFjaCgoc3Vic2NyaXB0aW9uKSA9PiB0aGlzLl91bnN1YnNjcmliZShzdWJzY3JpcHRpb24pKTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdFN2ZyhzZWxlY3RvcjogQ29udGFpbmVyRWxlbWVudCkge1xuICAgIGNvbnN0IGQzTGluZSA9IGxpbmUoKS5jdXJ2ZShjdXJ2ZUJhc2lzKTtcbiAgICBjb25zdCBzdmcgPSBzZWxlY3Qoc2VsZWN0b3IpLmNhbGwoXG4gICAgICBkcmFnKClcbiAgICAgICAgLmNvbnRhaW5lcihzZWxlY3RvcilcbiAgICAgICAgLnN1YmplY3QoKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHAgPSBbZXZlbnQueCwgZXZlbnQueV07XG4gICAgICAgICAgcmV0dXJuIFtwLCBwXTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdzdGFydCcsICgpID0+IHtcbiAgICAgICAgICBjb25zdCBkID0gZXZlbnQuc3ViamVjdDtcbiAgICAgICAgICBjb25zdCBhY3RpdmUgPSBzdmdcbiAgICAgICAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgICAgICAgLmRhdHVtKGQpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbGluZScpXG4gICAgICAgICAgICAuYXR0cihcbiAgICAgICAgICAgICAgJ3N0eWxlJyxcbiAgICAgICAgICAgICAgYFxuICAgICAgICAgICBmaWxsOiBub25lO1xuICAgICAgICAgICBzdHJva2U6ICR7dGhpcy5jb2xvciB8fCB0aGlzLndoaXRlYm9hcmRPcHRpb25zLmNvbG9yfTtcbiAgICAgICAgICAgc3Ryb2tlLXdpZHRoOiAke3RoaXMuc2l6ZSB8fCB0aGlzLndoaXRlYm9hcmRPcHRpb25zLnNpemV9O1xuICAgICAgICAgICBzdHJva2UtbGluZWpvaW46ICR7dGhpcy5saW5lam9pbiB8fCB0aGlzLndoaXRlYm9hcmRPcHRpb25zLmxpbmVqb2lufTtcbiAgICAgICAgICAgc3Ryb2tlLWxpbmVjYXA6ICR7dGhpcy5saW5lY2FwIHx8IHRoaXMud2hpdGVib2FyZE9wdGlvbnMubGluZWNhcH07XG4gICAgICAgICAgIGBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgYWN0aXZlLmF0dHIoJ2QnLCBkM0xpbmUpO1xuICAgICAgICAgIGV2ZW50Lm9uKCdkcmFnJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYWN0aXZlLmRhdHVtKCkucHVzaChtb3VzZSh0aGlzKSk7XG4gICAgICAgICAgICBhY3RpdmUuYXR0cignZCcsIGQzTGluZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZXZlbnQub24oJ2VuZCcsICgpID0+IHtcbiAgICAgICAgICAgIGFjdGl2ZS5hdHRyKCdkJywgZDNMaW5lKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnVuZG9TdGFjay5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICAgIHRoaXMucmVkb1N0YWNrID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnVuZG9TdGFjay5wdXNoKHsgdHlwZTogQWN0aW9uVHlwZS5MaW5lLCBsaW5lOiBhY3RpdmUubm9kZSgpIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgICk7XG4gICAgdGhpcy5pbml0LmVtaXQoKTtcbiAgICByZXR1cm4gc3ZnO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRJbWFnZShpbWFnZTogc3RyaW5nIHwgQXJyYXlCdWZmZXIpIHtcbiAgICB0aGlzLmRyYXdJbWFnZShpbWFnZSk7XG4gIH1cblxuICBwcml2YXRlIGVyYXNlU3ZnKHN2ZzogU2VsZWN0aW9uPGFueSwgdW5rbm93biwgbnVsbCwgdW5kZWZpbmVkPikge1xuICAgIHN2Zy5zZWxlY3RBbGwoJyonKS5yZW1vdmUoKTtcbiAgICB0aGlzLnVuZG9TdGFjayA9IFtdO1xuICAgIHRoaXMucmVkb1N0YWNrID0gW107XG4gICAgdGhpcy5jbGVhci5lbWl0KCk7XG4gIH1cblxuICBwcml2YXRlIHNhdmVTdmcobmFtZSwgZm9ybWF0OiAncG5nJyB8ICdqcGVnJyB8ICdzdmcnKSB7XG4gICAgY29uc3Qgc3ZnU3RyaW5nID0gdGhpcy5zYXZlQXNTdmcodGhpcy5zZWxlY3Rpb24uY2xvbmUodHJ1ZSkubm9kZSgpKTtcbiAgICBpZiAoZm9ybWF0ID09PSAnc3ZnJykge1xuICAgICAgdGhpcy5kb3dubG9hZCgnZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCwnICsgYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoc3ZnU3RyaW5nKSkpLCBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdmdTdHJpbmcySW1hZ2UoXG4gICAgICAgIHN2Z1N0cmluZyxcbiAgICAgICAgTnVtYmVyKHRoaXMuc2VsZWN0aW9uLnN0eWxlKCd3aWR0aCcpLnJlcGxhY2UoJ3B4JywgJycpKSxcbiAgICAgICAgTnVtYmVyKHRoaXMuc2VsZWN0aW9uLnN0eWxlKCdoZWlnaHQnKS5yZXBsYWNlKCdweCcsICcnKSksXG4gICAgICAgIGZvcm1hdCxcbiAgICAgICAgKGltZykgPT4ge1xuICAgICAgICAgIHRoaXMuZG93bmxvYWQoaW1nLCBuYW1lKTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyB0aGlzLnNhdmUuZW1pdCgpO1xuICB9XG5cbiAgcHJpdmF0ZSB1bmRvRHJhdygpIHtcbiAgICBpZiAoIXRoaXMudW5kb1N0YWNrLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnJlZG9TdGFjay5wdXNoKHRoaXMudW5kb1N0YWNrLnBvcCgpKTtcbiAgICB0aGlzLnNlbGVjdGlvbi5zZWxlY3RBbGwoJy5saW5lJykucmVtb3ZlKCk7XG4gICAgdGhpcy51bmRvU3RhY2suZm9yRWFjaCgoYWN0aW9uKSA9PiB7XG4gICAgICBpZiAoYWN0aW9uLnR5cGUgPT09IEFjdGlvblR5cGUuTGluZSkge1xuICAgICAgICB0aGlzLmRyYXdMaW5lKGFjdGlvbi5saW5lKTtcbiAgICAgIH0gZWxzZSBpZiAoYWN0aW9uLnR5cGUgPT09IEFjdGlvblR5cGUuSW1hZ2UpIHtcbiAgICAgICAgdGhpcy5kcmF3TGluZShhY3Rpb24uaW1hZ2UpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMudW5kby5lbWl0KCk7XG4gIH1cblxuICBwcml2YXRlIHJlZG9EcmF3KCkge1xuICAgIGlmICghdGhpcy5yZWRvU3RhY2subGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMudW5kb1N0YWNrLnB1c2godGhpcy5yZWRvU3RhY2sucG9wKCkpO1xuICAgIHRoaXMuc2VsZWN0aW9uLnNlbGVjdEFsbCgnLmxpbmUnKS5yZW1vdmUoKTtcbiAgICB0aGlzLnVuZG9TdGFjay5mb3JFYWNoKChhY3Rpb24pID0+IHtcbiAgICAgIGlmIChhY3Rpb24udHlwZSA9PT0gQWN0aW9uVHlwZS5MaW5lKSB7XG4gICAgICAgIHRoaXMuZHJhd0xpbmUoYWN0aW9uLmxpbmUpO1xuICAgICAgfSBlbHNlIGlmIChhY3Rpb24udHlwZSA9PT0gQWN0aW9uVHlwZS5JbWFnZSkge1xuICAgICAgICB0aGlzLmRyYXdMaW5lKGFjdGlvbi5pbWFnZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5yZWRvLmVtaXQoKTtcbiAgfVxuXG4gIHByaXZhdGUgZHJhd0xpbmUocGF0aE5vZGU6IFNWR1BhdGhFbGVtZW50IHwgU1ZHR0VsZW1lbnQpIHtcbiAgICB0aGlzLnNlbGVjdGlvbi5ub2RlKCkuYXBwZW5kQ2hpbGQocGF0aE5vZGUpO1xuICB9XG5cbiAgcHJpdmF0ZSBkcmF3SW1hZ2UoaW1hZ2U6IHN0cmluZyB8IEFycmF5QnVmZmVyKSB7XG4gICAgY29uc3QgZ3JvdXAgPSB0aGlzLnNlbGVjdGlvblxuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuZGF0YShbeyB4OiAyMCwgeTogMjAsIHI6IDEsIHNjYWxlOiAxIH1dKVxuICAgICAgLmF0dHIoJ3gnLCAwKVxuICAgICAgLmF0dHIoJ3knLCAwKVxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwwKScpO1xuXG4gICAgY29uc3QgdGVtcEltZyA9IG5ldyBJbWFnZSgpO1xuICAgIHRlbXBJbWcub25sb2FkID0gKCkgPT4ge1xuICAgICAgY29uc3QgYXNwZWN0UmF0aW8gPSB0ZW1wSW1nLndpZHRoIC8gdGVtcEltZy5oZWlnaHQ7XG4gICAgICBjb25zdCBoZWlnaHQgPSBOdW1iZXIodGhpcy5zZWxlY3Rpb24uc3R5bGUoJ2hlaWdodCcpLnJlcGxhY2UoJ3B4JywgJycpKTtcbiAgICAgIC8vIHRlbXBJbWcuaGVpZ2h0ID4gTnVtYmVyKHRoaXMuc2VsZWN0aW9uLnN0eWxlKCdoZWlnaHQnKS5yZXBsYWNlKCdweCcsICcnKSlcbiAgICAgIC8vICAgPyBOdW1iZXIodGhpcy5zZWxlY3Rpb24uc3R5bGUoJ2hlaWdodCcpLnJlcGxhY2UoJ3B4JywgJycpKSAtIDQwXG4gICAgICAvLyAgIDogdGVtcEltZy5oZWlnaHQ7XG4gICAgICBjb25zdCB3aWR0aCA9IE51bWJlcih0aGlzLnNlbGVjdGlvbi5zdHlsZSgnd2lkdGgnKS5yZXBsYWNlKCdweCcsICcnKSk7XG4gICAgICAvLyBoZWlnaHQgPT09IE51bWJlcih0aGlzLnNlbGVjdGlvbi5zdHlsZSgnaGVpZ2h0JykucmVwbGFjZSgncHgnLCAnJykpIC0gNDBcbiAgICAgIC8vICAgPyAoTnVtYmVyKHRoaXMuc2VsZWN0aW9uLnN0eWxlKCdoZWlnaHQnKS5yZXBsYWNlKCdweCcsICcnKSkgLSA0MCkgKiBhc3BlY3RSYXRpb1xuICAgICAgLy8gICA6IHRlbXBJbWcud2lkdGg7XG4gICAgICBncm91cFxuICAgICAgICAuYXBwZW5kKCdpbWFnZScpXG4gICAgICAgIC5hdHRyKCd4JywgMClcbiAgICAgICAgLmF0dHIoJ3knLCAwKVxuICAgICAgICAuYXR0cignaGVpZ2h0JywgaGVpZ2h0KVxuICAgICAgICAuYXR0cignd2lkdGgnLCB3aWR0aClcbiAgICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAnbm9uZScpXG4gICAgICAgIC5hdHRyKCd4bGluazpocmVmJywgaW1hZ2UudG9TdHJpbmcoKSk7XG5cbiAgICAgIGdyb3VwXG4gICAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAuYXR0cigneCcsIDApXG4gICAgICAgIC5hdHRyKCd5JywgMClcbiAgICAgICAgLmF0dHIoJ3dpZHRoJywgMjApXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCAyMClcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgICAgLmF0dHIoJ2ZpbGwnLCAoZCkgPT4ge1xuICAgICAgICAgIHJldHVybiAnI2NjY2NjYyc7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYWxsKFxuICAgICAgICAgIGRyYWcoKVxuICAgICAgICAgICAgLnN1YmplY3QoKCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBwID0gW2V2ZW50LngsIGV2ZW50LnldO1xuICAgICAgICAgICAgICByZXR1cm4gW3AsIHBdO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5vbignc3RhcnQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgIGV2ZW50Lm9uKCdkcmFnJywgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJzb3IgPSBzZWxlY3QodGhpcyk7XG4gICAgICAgICAgICAgICAgY29uc3QgY29yZCA9IG1vdXNlKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgZC54ICs9IGNvcmRbMF0gLSBOdW1iZXIoY3Vyc29yLmF0dHIoJ3dpZHRoJykpIC8gMjtcbiAgICAgICAgICAgICAgICBkLnkgKz0gY29yZFsxXSAtIE51bWJlcihjdXJzb3IuYXR0cignaGVpZ2h0JykpIC8gMjtcbiAgICAgICAgICAgICAgICBzZWxlY3QodGhpcy5wYXJlbnROb2RlKS5hdHRyKCd0cmFuc2Zvcm0nLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAndHJhbnNsYXRlKCcgKyBbZC54LCBkLnldICsgJykscm90YXRlKCcgKyAwICsgJywxNjAsIDE2MCksc2NhbGUoJyArIGQuc2NhbGUgKyAnLCcgKyBkLnNjYWxlICsgJyknXG4gICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICBncm91cFxuICAgICAgICAub24oJ21vdXNlb3ZlcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxlY3QodGhpcykuc2VsZWN0KCdyZWN0Jykuc3R5bGUoJ29wYWNpdHknLCAxLjApO1xuICAgICAgICB9KVxuICAgICAgICAub24oJ21vdXNlb3V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGVjdCh0aGlzKS5zZWxlY3QoJ3JlY3QnKS5zdHlsZSgnb3BhY2l0eScsIDApO1xuICAgICAgICB9KTtcbiAgICAgIC8vIHRoaXMudW5kb1N0YWNrLnB1c2goeyB0eXBlOiBBY3Rpb25UeXBlLkltYWdlLCBpbWFnZTogZ3JvdXAubm9kZSgpIH0pO1xuICAgIH07XG4gICAgdGVtcEltZy5zcmMgPSBpbWFnZS50b1N0cmluZygpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdW5zdWJzY3JpYmUoc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24pOiB2b2lkIHtcbiAgICBpZiAoc3Vic2NyaXB0aW9uKSB7XG4gICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHN2Z1N0cmluZzJJbWFnZShcbiAgICBzdmdTdHJpbmc6IHN0cmluZyxcbiAgICB3aWR0aDogbnVtYmVyLFxuICAgIGhlaWdodDogbnVtYmVyLFxuICAgIGZvcm1hdDogc3RyaW5nLFxuICAgIGNhbGxiYWNrOiAoaW1nOiBzdHJpbmcpID0+IHZvaWRcbiAgKSB7XG4gICAgLy8gc2V0IGRlZmF1bHQgZm9yIGZvcm1hdCBwYXJhbWV0ZXJcbiAgICBmb3JtYXQgPSBmb3JtYXQgfHwgJ3BuZyc7XG4gICAgLy8gU1ZHIGRhdGEgVVJMIGZyb20gU1ZHIHN0cmluZ1xuICAgIGNvbnN0IHN2Z0RhdGEgPSAnZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCwnICsgYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoc3ZnU3RyaW5nKSkpO1xuICAgIC8vIGNyZWF0ZSBjYW52YXMgaW4gbWVtb3J5KG5vdCBpbiBET00pXG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgLy8gZ2V0IGNhbnZhcyBjb250ZXh0IGZvciBkcmF3aW5nIG9uIGNhbnZhc1xuICAgIGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAvLyBzZXQgY2FudmFzIHNpemVcbiAgICBjYW52YXMud2lkdGggPSB3aWR0aDtcbiAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgIC8vIGNyZWF0ZSBpbWFnZSBpbiBtZW1vcnkobm90IGluIERPTSlcbiAgICBjb25zdCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgIC8vIGxhdGVyIHdoZW4gaW1hZ2UgbG9hZHMgcnVuIHRoaXNcbiAgICBpbWFnZS5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAvLyBhc3luYyAoaGFwcGVucyBsYXRlcilcbiAgICAgIC8vIGNsZWFyIGNhbnZhc1xuICAgICAgY29udGV4dC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAvLyBkcmF3IGltYWdlIHdpdGggU1ZHIGRhdGEgdG8gY2FudmFzXG4gICAgICBjb250ZXh0LmRyYXdJbWFnZShpbWFnZSwgMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAvLyBzbmFwc2hvdCBjYW52YXMgYXMgcG5nXG4gICAgICBjb25zdCBwbmdEYXRhID0gY2FudmFzLnRvRGF0YVVSTCgnaW1hZ2UvJyArIGZvcm1hdCk7XG4gICAgICAvLyBwYXNzIHBuZyBkYXRhIFVSTCB0byBjYWxsYmFja1xuICAgICAgY2FsbGJhY2socG5nRGF0YSk7XG4gICAgfTsgLy8gZW5kIGFzeW5jXG4gICAgLy8gc3RhcnQgbG9hZGluZyBTVkcgZGF0YSBpbnRvIGluIG1lbW9yeSBpbWFnZVxuICAgIGltYWdlLnNyYyA9IHN2Z0RhdGE7XG4gIH1cblxuICBwcml2YXRlIHNhdmVBc1N2ZyhzdmdOb2RlKTogc3RyaW5nIHtcbiAgICBzdmdOb2RlLnNldEF0dHJpYnV0ZSgneGxpbmsnLCAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycpO1xuICAgIGNvbnN0IHNlcmlhbGl6ZXIgPSBuZXcgWE1MU2VyaWFsaXplcigpO1xuICAgIGxldCBzdmdTdHJpbmcgPSBzZXJpYWxpemVyLnNlcmlhbGl6ZVRvU3RyaW5nKHN2Z05vZGUpO1xuICAgIHN2Z1N0cmluZyA9IHN2Z1N0cmluZy5yZXBsYWNlKC8oXFx3Kyk/Oj94bGluaz0vZywgJ3htbG5zOnhsaW5rPScpOyAvLyBGaXggcm9vdCB4bGluayB3aXRob3V0IG5hbWVzcGFjZVxuICAgIHN2Z1N0cmluZyA9IHN2Z1N0cmluZy5yZXBsYWNlKC9OU1xcZCs6aHJlZi9nLCAneGxpbms6aHJlZicpO1xuICAgIHJldHVybiBzdmdTdHJpbmc7XG4gIH1cblxuICBwcml2YXRlIGRvd25sb2FkKHVybDogc3RyaW5nLCBuYW1lOiBzdHJpbmcpOiBGaWxlIHtcbiAgICB2YXIgZmlsZSA9IHRoaXMuZGF0YVVSTHRvRmlsZSh1cmwsIG5hbWUpO1xuXG4gICAgdGhpcy5zYXZlLmVtaXQoZmlsZSk7XG5cbiAgICByZXR1cm4gZmlsZTtcbiAgICAvLyBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIC8vIGxpbmsuaHJlZiA9IHVybDtcbiAgICAvLyBsaW5rLnNldEF0dHJpYnV0ZSgndmlzaWJpbGl0eScsICdoaWRkZW4nKTtcbiAgICAvLyBsaW5rLmRvd25sb2FkID0gbmFtZSB8fCAnbmV3IHdoaXRlLWJvYXJkJztcbiAgICAvLyBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xuICAgIC8vIGxpbmsuY2xpY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0cmFuc2Zvcm1hciBiYXNlNjRcbiAgICogQHBhcmFtIGRhdGF1cmwgc3RyaW5nIGJhc2U2NFxuICAgKiBAcGFyYW0gZmlsZW5hbWUgbm9tYnJlIHBhcmEgZWwgRmlsZVxuICAgKi9cbiAgZGF0YVVSTHRvRmlsZShkYXRhdXJsLCBmaWxlbmFtZSkge1xuICAgIHZhciBhcnIgPSBkYXRhdXJsLnNwbGl0KCcsJyksXG4gICAgICBtaW1lID0gYXJyWzBdLm1hdGNoKC86KC4qPyk7LylbMV0sXG4gICAgICBic3RyID0gYXRvYihhcnJbMV0pLFxuICAgICAgbiA9IGJzdHIubGVuZ3RoLFxuICAgICAgdThhcnIgPSBuZXcgVWludDhBcnJheShuKTtcblxuICAgIHdoaWxlIChuLS0pIHtcbiAgICAgIHU4YXJyW25dID0gYnN0ci5jaGFyQ29kZUF0KG4pO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgRmlsZShbdThhcnJdLCBmaWxlbmFtZSwgeyB0eXBlOiBtaW1lIH0pO1xuICB9XG59XG4iXX0=