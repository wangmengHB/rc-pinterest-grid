import * as React from 'react';
import PinterestGrid, { PinterestGridProps, BreakPoint } from './grid'
const enquire = require('enquire.js');

const MAX_WIDTH = 5000;
const MIN_PADDING = 100;

function createDefaultBreakPoints(
  columnWidth: number, 
  gutterWidth: number, 
  minPadding: number = MIN_PADDING, 
  maxWidth: number = MAX_WIDTH
): BreakPoint[] {
  const breakpoints: BreakPoint[] = [];
  const NUM = Math.ceil((maxWidth - minPadding) / (columnWidth + gutterWidth));
  for (let i = 0; i < NUM; i++) {
    const min = i === 0? 0: (columnWidth + gutterWidth) * (i + 1) + minPadding;
    const max = i === NUM? Infinity:(columnWidth + gutterWidth) * (i + 2) + minPadding;
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
      const { columnWidth, gutterWidth, columns, responsive } = this.props;
      let breakPoints: BreakPoint[];
      let minPadding = MIN_PADDING, maxWidth = MAX_WIDTH;
      if (responsive && typeof responsive === 'object') {
        minPadding = typeof responsive.minPadding === 'number'? responsive.minPadding: minPadding;
        maxWidth = typeof responsive.maxWidth === 'number'? responsive.maxWidth: maxWidth;
      }

      // false or undefined
      if (!responsive) {
        breakPoints = [];
      } else if ( 
        responsive && 
        typeof responsive === 'object' && 
        Array.isArray(responsive.customBreakPoints)
      ) {
        breakPoints = responsive.customBreakPoints;
      } else {
        breakPoints = createDefaultBreakPoints(columnWidth, gutterWidth, minPadding, maxWidth);
      }
      
      this.breakpoints = breakPoints.map((brk: BreakPoint) => {
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

      const currentBrk = getCurrentPoint(breakPoints);
      
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

