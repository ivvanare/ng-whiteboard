/**
 * @fileoverview added by tsickle
 * Generated from: lib/ng-whiteboard.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export class NgWhiteboardService {
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
/** @nocollapse */ NgWhiteboardService.ɵprov = i0.ɵɵdefineInjectable({ factory: function NgWhiteboardService_Factory() { return new NgWhiteboardService(); }, token: NgWhiteboardService, providedIn: "root" });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctd2hpdGVib2FyZC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctd2hpdGVib2FyZC8iLCJzb3VyY2VzIjpbImxpYi9uZy13aGl0ZWJvYXJkLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7O0FBSy9CLE1BQU0sT0FBTyxtQkFBbUI7SUFIaEM7O1FBS1UsNkJBQXdCLEdBQUcsSUFBSSxPQUFPLEVBQU8sQ0FBQztRQUM5Qyw0QkFBdUIsR0FBRyxJQUFJLE9BQU8sRUFBb0QsQ0FBQztRQUMxRiw0QkFBdUIsR0FBRyxJQUFJLE9BQU8sRUFBTyxDQUFDO1FBQzdDLDRCQUF1QixHQUFHLElBQUksT0FBTyxFQUFPLENBQUM7UUFDN0MsNkJBQXdCLEdBQUcsSUFBSSxPQUFPLEVBQXdCLENBQUM7O1FBR3ZFLDBCQUFxQixHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNyRSx5QkFBb0IsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDbkUseUJBQW9CLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ25FLHlCQUFvQixHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNuRSwwQkFBcUIsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsWUFBWSxFQUFFLENBQUM7S0FrQnRFOzs7OztJQWZRLEtBQUs7UUFDVixJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDdkMsQ0FBQzs7Ozs7O0lBQ00sSUFBSSxDQUFDLE9BQWUsV0FBVyxFQUFFLFNBQWlDLEtBQUs7UUFDNUUsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ3RELENBQUM7Ozs7SUFDTSxJQUFJO1FBQ1QsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3RDLENBQUM7Ozs7SUFDTSxJQUFJO1FBQ1QsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3RDLENBQUM7Ozs7O0lBQ00sUUFBUSxDQUFDLEtBQTJCO1FBQ3pDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUMsQ0FBQzs7O1lBakNGLFVBQVUsU0FBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQjs7Ozs7Ozs7SUFHQyx1REFBc0Q7Ozs7O0lBQ3RELHNEQUFrRzs7Ozs7SUFDbEcsc0RBQXFEOzs7OztJQUNyRCxzREFBcUQ7Ozs7O0lBQ3JELHVEQUF1RTs7SUFHdkUsb0RBQXFFOztJQUNyRSxtREFBbUU7O0lBQ25FLG1EQUFtRTs7SUFDbkUsbURBQW1FOztJQUNuRSxvREFBcUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIE5nV2hpdGVib2FyZFNlcnZpY2Uge1xyXG4gIC8vIE9ic2VydmFibGUgc3RyaW5nIHNvdXJjZXNcclxuICBwcml2YXRlIGVyYXNlU3ZnTWV0aG9kQ2FsbFNvdXJjZSA9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuICBwcml2YXRlIHNhdmVTdmdNZXRob2RDYWxsU291cmNlID0gbmV3IFN1YmplY3Q8eyBuYW1lOiBzdHJpbmc7IGZvcm1hdDogJ3BuZycgfCAnanBlZycgfCAnc3ZnJyB9PigpO1xyXG4gIHByaXZhdGUgdW5kb1N2Z01ldGhvZENhbGxTb3VyY2UgPSBuZXcgU3ViamVjdDxhbnk+KCk7XHJcbiAgcHJpdmF0ZSByZWRvU3ZnTWV0aG9kQ2FsbFNvdXJjZSA9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuICBwcml2YXRlIGFkZEltYWdlTWV0aG9kQ2FsbFNvdXJjZSA9IG5ldyBTdWJqZWN0PHN0cmluZyB8IEFycmF5QnVmZmVyPigpO1xyXG5cclxuICAvLyBPYnNlcnZhYmxlIHN0cmluZyBzdHJlYW1zXHJcbiAgZXJhc2VTdmdNZXRob2RDYWxsZWQkID0gdGhpcy5lcmFzZVN2Z01ldGhvZENhbGxTb3VyY2UuYXNPYnNlcnZhYmxlKCk7XHJcbiAgc2F2ZVN2Z01ldGhvZENhbGxlZCQgPSB0aGlzLnNhdmVTdmdNZXRob2RDYWxsU291cmNlLmFzT2JzZXJ2YWJsZSgpO1xyXG4gIHVuZG9TdmdNZXRob2RDYWxsZWQkID0gdGhpcy51bmRvU3ZnTWV0aG9kQ2FsbFNvdXJjZS5hc09ic2VydmFibGUoKTtcclxuICByZWRvU3ZnTWV0aG9kQ2FsbGVkJCA9IHRoaXMucmVkb1N2Z01ldGhvZENhbGxTb3VyY2UuYXNPYnNlcnZhYmxlKCk7XHJcbiAgYWRkSW1hZ2VNZXRob2RDYWxsZWQkID0gdGhpcy5hZGRJbWFnZU1ldGhvZENhbGxTb3VyY2UuYXNPYnNlcnZhYmxlKCk7XHJcblxyXG4gIC8vIFNlcnZpY2UgbWVzc2FnZSBjb21tYW5kc1xyXG4gIHB1YmxpYyBlcmFzZSgpOiB2b2lkIHtcclxuICAgIHRoaXMuZXJhc2VTdmdNZXRob2RDYWxsU291cmNlLm5leHQoKTtcclxuICB9XHJcbiAgcHVibGljIHNhdmUobmFtZTogc3RyaW5nID0gJ05ldyBpbWFnZScsIGZvcm1hdDogJ3BuZycgfCAnanBlZycgfCAnc3ZnJyA9ICdwbmcnKTogdm9pZCB7XHJcbiAgICB0aGlzLnNhdmVTdmdNZXRob2RDYWxsU291cmNlLm5leHQoeyBuYW1lLCBmb3JtYXQgfSk7XHJcbiAgfVxyXG4gIHB1YmxpYyB1bmRvKCk6IHZvaWQge1xyXG4gICAgdGhpcy51bmRvU3ZnTWV0aG9kQ2FsbFNvdXJjZS5uZXh0KCk7XHJcbiAgfVxyXG4gIHB1YmxpYyByZWRvKCk6IHZvaWQge1xyXG4gICAgdGhpcy5yZWRvU3ZnTWV0aG9kQ2FsbFNvdXJjZS5uZXh0KCk7XHJcbiAgfVxyXG4gIHB1YmxpYyBhZGRJbWFnZShpbWFnZTogc3RyaW5nIHwgQXJyYXlCdWZmZXIpOiB2b2lkIHtcclxuICAgIHRoaXMuYWRkSW1hZ2VNZXRob2RDYWxsU291cmNlLm5leHQoaW1hZ2UpO1xyXG4gIH1cclxufVxyXG4iXX0=