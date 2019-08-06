import * as React from 'react';
const enquire = require('enquire.js');
import PinterestGrid, { PinterestGridProps } from './grid'

const MAX_WIDTH = 5000;

export interface ResponsiveProps {
  maxWidth?: number;
  minPadding?: number;
  defaultColumns?: number;
}

export default function makeResponsive (
  Grid: typeof PinterestGrid, 
  { 
    maxWidth = MAX_WIDTH, 
    minPadding = 100, 
    defaultColumns = 4 
  }: ResponsiveProps = {}
): any {
  return class extends React.PureComponent<PinterestGridProps> {
    static defaultProps = {
      gutterWidth: 200,
    };

    state = {
      columns: defaultColumns
    };

    breakpoints: any[] = [];

    componentDidMount() {
      const { columnWidth, gutterWidth } = this.props;

      const breakpoints: any[] = [];
      const getWidth = (i: number) =>
        i * (columnWidth + gutterWidth) - gutterWidth + minPadding;

      for ( let i = 2; getWidth(i) <= maxWidth + columnWidth + gutterWidth; i++) {
        breakpoints.push(getWidth(i));
      }

      this.breakpoints = breakpoints
        .map((width, i, arr) =>
          [
            'screen',
            i > 0 && `(min-width: ${arr[i - 1]}px)`,
            i < arr.length - 1 && `(max-width: ${width}px)`
          ]
            .filter(Boolean)
            .join(' and '))
        .map((breakpoint, i) => ({
          breakpoint,
          handler: () => this.setState({ columns: i + 1 })
        }));

      this.breakpoints.forEach(({ breakpoint, handler }) =>
        enquire.register(breakpoint, { match: handler }));
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

