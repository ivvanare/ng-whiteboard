export declare class WhiteboardOptions {
    color: string;
    backgroundColor: string;
    size: string;
    linejoin: 'miter' | 'round' | 'bevel' | 'miter-clip' | 'arcs';
    linecap: 'butt' | 'square' | 'round';
}
export interface ActionStack {
    type: ActionType;
    line?: SVGPathElement;
    image?: SVGGElement;
}
export declare enum ActionType {
    Line = 0,
    Image = 1
}
