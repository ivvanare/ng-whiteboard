export declare class NgWhiteboardService {
    private eraseSvgMethodCallSource;
    private saveSvgMethodCallSource;
    private undoSvgMethodCallSource;
    private redoSvgMethodCallSource;
    private addImageMethodCallSource;
    eraseSvgMethodCalled$: import("rxjs").Observable<any>;
    saveSvgMethodCalled$: import("rxjs").Observable<{
        name: string;
        format: "svg" | "png" | "jpeg";
    }>;
    undoSvgMethodCalled$: import("rxjs").Observable<any>;
    redoSvgMethodCalled$: import("rxjs").Observable<any>;
    addImageMethodCalled$: import("rxjs").Observable<string | ArrayBuffer>;
    erase(): void;
    save(name?: string, format?: 'png' | 'jpeg' | 'svg'): void;
    undo(): void;
    redo(): void;
    addImage(image: string | ArrayBuffer): void;
}
