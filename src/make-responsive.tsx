import * as React from 'react';
const enquire = require('enquire.js');
import PinterestGrid, { PinterestGridProps, BreakPoint } from './grid'

const MAX_WIDTH = 5000;
const MIN_PADDING = 100;


function createDefaultBreakPoints(columnWidth: number, gutterWidth: number): BreakPoint[] {
  const breakpoints: BreakPoint[] = [];
  const NUM = Math.ceil((MAX_WIDTH - MIN_PADDING) / (columnWidth + gutterWidth));
  for (let i = 0; i < NUM; i++) {
    const min = i === 0? 0: (columnWidth + gutterWidth) * (i + 1) + MIN_PADDING;
    const max = i === NUM? Infinity:(columnWidth + gutterWidth) * (i + 2) + MIN_PADDING;
    const columns = i + 1;
    breakpoints.push({
      minScreenWidth: min,
      maxScreenWidth: max,
      columnWidth,
      columns
    });
  }
  return breakpoints;
}

function getCurrentPoint(breakpoints: BreakPoint[]): BreakPoint | undefined {
  const current  = document.body.clientWidth;
  return breakpoints.find(brk => current > brk.minScreenWidth && current <= brk.maxScreenWidth);
}


export default function makeResponsive (
  Grid: typeof PinterestGrid,
): any {
  return class extends React.PureComponent<PinterestGridProps> {
    
    breakpoints: any[] = [];

    constructor(props: PinterestGridProps) {
      super(props);
      const { columnWidth, gutterWidth, columns, responsive, breakPoints } = this.props;
      let brkPoints: BreakPoint[];

      if (responsive) {
        if (Array.isArray(breakPoints) && breakPoints.length > 0) {
          brkPoints = breakPoints
        } else {
          brkPoints = createDefaultBreakPoints(columnWidth, gutterWidth);;
        }
      } else {
        brkPoints = [];
      }

      this.breakpoints = brkPoints.map((brk: BreakPoint) => {
        const {columns, columnWidth, minScreenWidth, maxScreenWidth} = brk;   
        const breakpoint = [
          'screen', 
          minScreenWidth === 0? null: `(min-width: ${minScreenWidth}px)` , 
          isFinite(maxScreenWidth)?`(max-width: ${maxScreenWidth}px)`: null,
        ].filter(Boolean).join(' and ');
      
        return {
          breakpoint,
          handler: () => this.setState({columns, columnWidth})
        }
      })
      
      this.breakpoints.forEach(({ breakpoint, handler }) => {
        enquire.register(breakpoint, { match: handler });
      });

      const currentBrk = getCurrentPoint(brkPoints);
      
      this.state = {
        columns: currentBrk? currentBrk!.columns: columns,
        columnWidth: currentBrk? currentBrk!.columnWidth: columnWidth,
      };
             
    }

    componentWillUnmount() {
      this.breakpoints.forEach(({ breakpoint, handler }) =>
        enquire.unregister(breakpoint, handler));
    }

    render() {
      return <Grid {...this.props} {...this.state} />;
    }
  }
};

