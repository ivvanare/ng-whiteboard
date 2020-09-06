/**
 * @fileoverview added by tsickle
 * Generated from: lib/ng-whiteboard.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
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
    /** @nocollapse */ NgWhiteboardService.ɵprov = i0.ɵɵdefineInjectable({ factory: function NgWhiteboardService_Factory() { return new NgWhiteboardService(); }, token: NgWhiteboardService, providedIn: "root" });
    return NgWhiteboardService;
}());
export { NgWhiteboardService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctd2hpdGVib2FyZC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctd2hpdGVib2FyZC8iLCJzb3VyY2VzIjpbImxpYi9uZy13aGl0ZWJvYXJkLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7O0FBRS9CO0lBQUE7O1FBS1UsNkJBQXdCLEdBQUcsSUFBSSxPQUFPLEVBQU8sQ0FBQztRQUM5Qyw0QkFBdUIsR0FBRyxJQUFJLE9BQU8sRUFBb0QsQ0FBQztRQUMxRiw0QkFBdUIsR0FBRyxJQUFJLE9BQU8sRUFBTyxDQUFDO1FBQzdDLDRCQUF1QixHQUFHLElBQUksT0FBTyxFQUFPLENBQUM7UUFDN0MsNkJBQXdCLEdBQUcsSUFBSSxPQUFPLEVBQXdCLENBQUM7O1FBR3ZFLDBCQUFxQixHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNyRSx5QkFBb0IsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDbkUseUJBQW9CLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ25FLHlCQUFvQixHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNuRSwwQkFBcUIsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsWUFBWSxFQUFFLENBQUM7S0FrQnRFO0lBaEJDLDJCQUEyQjs7Ozs7SUFDcEIsbUNBQUs7Ozs7O0lBQVo7UUFDRSxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDdkMsQ0FBQzs7Ozs7O0lBQ00sa0NBQUk7Ozs7O0lBQVgsVUFBWSxJQUEwQixFQUFFLE1BQXNDO1FBQWxFLHFCQUFBLEVBQUEsa0JBQTBCO1FBQUUsdUJBQUEsRUFBQSxjQUFzQztRQUM1RSxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxNQUFBLEVBQUUsTUFBTSxRQUFBLEVBQUUsQ0FBQyxDQUFDO0lBQ3RELENBQUM7Ozs7SUFDTSxrQ0FBSTs7O0lBQVg7UUFDRSxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDdEMsQ0FBQzs7OztJQUNNLGtDQUFJOzs7SUFBWDtRQUNFLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN0QyxDQUFDOzs7OztJQUNNLHNDQUFROzs7O0lBQWYsVUFBZ0IsS0FBMkI7UUFDekMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1QyxDQUFDOztnQkFqQ0YsVUFBVSxTQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs7OzhCQUxEO0NBcUNDLEFBbENELElBa0NDO1NBL0JZLG1CQUFtQjs7Ozs7O0lBRTlCLHVEQUFzRDs7Ozs7SUFDdEQsc0RBQWtHOzs7OztJQUNsRyxzREFBcUQ7Ozs7O0lBQ3JELHNEQUFxRDs7Ozs7SUFDckQsdURBQXVFOztJQUd2RSxvREFBcUU7O0lBQ3JFLG1EQUFtRTs7SUFDbkUsbURBQW1FOztJQUNuRSxtREFBbUU7O0lBQ25FLG9EQUFxRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTmdXaGl0ZWJvYXJkU2VydmljZSB7XG4gIC8vIE9ic2VydmFibGUgc3RyaW5nIHNvdXJjZXNcbiAgcHJpdmF0ZSBlcmFzZVN2Z01ldGhvZENhbGxTb3VyY2UgPSBuZXcgU3ViamVjdDxhbnk+KCk7XG4gIHByaXZhdGUgc2F2ZVN2Z01ldGhvZENhbGxTb3VyY2UgPSBuZXcgU3ViamVjdDx7IG5hbWU6IHN0cmluZzsgZm9ybWF0OiAncG5nJyB8ICdqcGVnJyB8ICdzdmcnIH0+KCk7XG4gIHByaXZhdGUgdW5kb1N2Z01ldGhvZENhbGxTb3VyY2UgPSBuZXcgU3ViamVjdDxhbnk+KCk7XG4gIHByaXZhdGUgcmVkb1N2Z01ldGhvZENhbGxTb3VyY2UgPSBuZXcgU3ViamVjdDxhbnk+KCk7XG4gIHByaXZhdGUgYWRkSW1hZ2VNZXRob2RDYWxsU291cmNlID0gbmV3IFN1YmplY3Q8c3RyaW5nIHwgQXJyYXlCdWZmZXI+KCk7XG5cbiAgLy8gT2JzZXJ2YWJsZSBzdHJpbmcgc3RyZWFtc1xuICBlcmFzZVN2Z01ldGhvZENhbGxlZCQgPSB0aGlzLmVyYXNlU3ZnTWV0aG9kQ2FsbFNvdXJjZS5hc09ic2VydmFibGUoKTtcbiAgc2F2ZVN2Z01ldGhvZENhbGxlZCQgPSB0aGlzLnNhdmVTdmdNZXRob2RDYWxsU291cmNlLmFzT2JzZXJ2YWJsZSgpO1xuICB1bmRvU3ZnTWV0aG9kQ2FsbGVkJCA9IHRoaXMudW5kb1N2Z01ldGhvZENhbGxTb3VyY2UuYXNPYnNlcnZhYmxlKCk7XG4gIHJlZG9TdmdNZXRob2RDYWxsZWQkID0gdGhpcy5yZWRvU3ZnTWV0aG9kQ2FsbFNvdXJjZS5hc09ic2VydmFibGUoKTtcbiAgYWRkSW1hZ2VNZXRob2RDYWxsZWQkID0gdGhpcy5hZGRJbWFnZU1ldGhvZENhbGxTb3VyY2UuYXNPYnNlcnZhYmxlKCk7XG5cbiAgLy8gU2VydmljZSBtZXNzYWdlIGNvbW1hbmRzXG4gIHB1YmxpYyBlcmFzZSgpOiB2b2lkIHtcbiAgICB0aGlzLmVyYXNlU3ZnTWV0aG9kQ2FsbFNvdXJjZS5uZXh0KCk7XG4gIH1cbiAgcHVibGljIHNhdmUobmFtZTogc3RyaW5nID0gJ05ldyBpbWFnZScsIGZvcm1hdDogJ3BuZycgfCAnanBlZycgfCAnc3ZnJyA9ICdwbmcnKTogdm9pZCB7XG4gICAgdGhpcy5zYXZlU3ZnTWV0aG9kQ2FsbFNvdXJjZS5uZXh0KHsgbmFtZSwgZm9ybWF0IH0pO1xuICB9XG4gIHB1YmxpYyB1bmRvKCk6IHZvaWQge1xuICAgIHRoaXMudW5kb1N2Z01ldGhvZENhbGxTb3VyY2UubmV4dCgpO1xuICB9XG4gIHB1YmxpYyByZWRvKCk6IHZvaWQge1xuICAgIHRoaXMucmVkb1N2Z01ldGhvZENhbGxTb3VyY2UubmV4dCgpO1xuICB9XG4gIHB1YmxpYyBhZGRJbWFnZShpbWFnZTogc3RyaW5nIHwgQXJyYXlCdWZmZXIpOiB2b2lkIHtcbiAgICB0aGlzLmFkZEltYWdlTWV0aG9kQ2FsbFNvdXJjZS5uZXh0KGltYWdlKTtcbiAgfVxufVxuIl19