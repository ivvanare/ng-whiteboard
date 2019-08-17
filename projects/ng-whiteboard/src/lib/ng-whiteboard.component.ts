import { Component, AfterViewInit, ViewChild, Input, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { svgAsPngUri } from 'save-svg-as-png';
import { WhiteboardOptions, NgWhiteboardService } from './ng-whiteboard.service';
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ng-whiteboard',
  template: `
    <svg #svgContainer></svg>
  `,
  styleUrls: ['ng-whiteboard.component.scss']
})
export class NgWhiteboardComponent implements AfterViewInit {
  @ViewChild('svgContainer', { static: false })
  private svgContainer: ElementRef;
  @Input() whiteboardOptions: WhiteboardOptions = new WhiteboardOptions();
  @Input() color: string;
  @Input() size: string;
  @Input() linejoin: 'miter' | 'round' | 'bevel' | 'miter-clip' | 'arcs';
  @Input() linecap: 'butt' | 'square' | 'round';
  selection = undefined;
  constructor(private _whiteboardService: NgWhiteboardService) {}

  ngAfterViewInit() {
    this.selection = this.init(this.svgContainer.nativeElement);
    this._whiteboardService.eraseSvgMethodCalled$.subscribe(() => {
      this.eraseSvg(this.selection);
    });
    this._whiteboardService.saveSvgMethodCalled$.subscribe(() => {
      this.save(this.svgContainer.nativeElement);
    });
  }

  init(selector) {
    const line = d3.line().curve(d3.curveBasis);
    const svg = d3
      .select(selector)
      .attr('style', 'background: #fff;')
      .call(
        d3
          .drag()
          .container(selector)
          .subject(() => {
            const p = [d3.event.x, d3.event.y];
            return [p, p];
          })
          .on('start', () => {
            const d = d3.event.subject;
            const active = svg
              .append('path')
              .datum(d)
              .attr('class', 'line')
              .attr(
                'style',
                `
           fill: none;
           stroke: ${this.color || this.whiteboardOptions.color};
           stroke-width: ${this.size || this.whiteboardOptions.size};
           stroke-linejoin: ${this.linejoin || this.whiteboardOptions.linejoin};
           stroke-linecap: ${this.linecap || this.whiteboardOptions.linecap};
           `
              );
            d3.event.on('drag', function() {
              active.datum().push(d3.mouse(this));
              active.attr('d', line);
            });
            active.attr('d', line);
          })
      );
    return svg;
  }
  eraseSvg(svg) {
    svg.html('');
  }
  save(el) {
    svgAsPngUri(el, {}, uri => {
      if (navigator.msSaveBlob) {
        const filename = 'new white-board';
        navigator.msSaveBlob(uri, filename);
      } else {
        const link = document.createElement('a');

        link.href = uri;

        link.setAttribute('visibility', 'hidden');
        link.download = 'new white-board';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  }
}