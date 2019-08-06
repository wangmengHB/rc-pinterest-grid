import ResizeObserverPolyfill from 'resize-observer-polyfill';
import * as React from 'react';
import doLayout, { Position } from './layout';

// as for now, ResizeObserver is only supported in chrome
// in other browser, we need polyfill.
const ResizeObserver = (window as any).ResizeObserver || ResizeObserverPolyfill;

const INITIAL_HEIGHT = 700;
const CSS_TRANSITION = 
  'left 300ms cubic-bezier(0.215, 0.61, 0.355, 1) 0s,' + 
  'top 800ms cubic-bezier(0.215, 0.61, 0.355, 1) 0s';

export interface PinterestGridProps {
  columnWidth: number;
  columns: number;
  gutterWidth: number;
  gutterHeight: number;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactChildren;
}

interface PinterestGridState {
  positions: Position[];
  wrappedItems: any[];
  gridWidth: number;
  gridHeight: number;
}

export default class PinterestGrid extends React.PureComponent<PinterestGridProps, PinterestGridState> {

  wrappedRefs: any[] = [];

  state = {
    positions: [],
    wrappedItems: [],
    gridWidth: 0,
    gridHeight: 0,
  }

  private resizeObserver = new ResizeObserver((entries: any) => {
    const { wrappedItems } = this.state;
    const { columnWidth, gutterWidth, gutterHeight, columns } = this.props;
    if (this.wrappedRefs.length !== wrappedItems.length) {
      throw new Error('wrapped items not equals container\'s count.');
    }
    // block DOM size change, need to do layout
    this.doLayout(null, { columnWidth, gutterWidth, gutterHeight, columns });
  });

  componentDidMount() {
    const { columnWidth, gutterWidth, gutterHeight, columns, children } = this.props;
    const wrappedItems: any[] = this.createWrappedItems(children!);
    this.doLayout(wrappedItems, { columnWidth, gutterWidth, gutterHeight, columns });
  }

  componentDidUpdate(prevProps: PinterestGridProps) {
    const { columnWidth, gutterWidth, gutterHeight, columns, children } = this.props;
    if (children !== prevProps.children) {
      const wrappedItems = this.createWrappedItems(children!);
      this.doLayout(wrappedItems, { columnWidth, gutterWidth, gutterHeight, columns });
    } 
    if ( columnWidth !== prevProps.columnWidth ||
      gutterHeight !== prevProps.gutterHeight ||
      gutterWidth !== prevProps.gutterWidth ||
      columns !== prevProps.columns
    ) {
      this.doLayout(null, { columnWidth, gutterWidth, gutterHeight, columns });
    }   
  }

  componentWillUnmount() {
    this.resizeObserver.disconnect();
  }

  createWrappedItems = (children: React.ReactChildren): any[] => {
    this.wrappedRefs = [];   
    const items = React.Children.toArray(children);
    if (!Array.isArray(items)) {
      return [];
    }  
    const wrappedItems = items.map((item: any, index: number) => {
      // provide a big inital height, in order to make every item
      // showing from bottom to up. 
      const props = {
        height: item.props.height || INITIAL_HEIGHT
      }
      return (
        <div 
          ref={ (_) => {
            if (_) {
              this.wrappedRefs[index] = _ ;
              this.resizeObserver.observe(_);
            }
          }}
          key={item.key || `pinterest-${index}`}
          {...props}
        >
          {item}
        </div>
      )
    });
    return wrappedItems;
  }


  doLayout = (wrappedItems: any[] | null, {columnWidth, gutterWidth, gutterHeight, columns}: PinterestGridProps) => {
    let nextWrappedItems: any[] = this.state.wrappedItems;
    if (Array.isArray(wrappedItems)) {
      nextWrappedItems = wrappedItems;
    }
    this.setState({
      wrappedItems: nextWrappedItems,           
      ...doLayout(
        nextWrappedItems.map((item, index: number) => 
          this.wrappedRefs[index]
            ? this.wrappedRefs[index].clientHeight 
            : item.props.height || INITIAL_HEIGHT
        ), 
        { columnWidth, gutterWidth, gutterHeight, columns }
      )
    });
  }

  render() {    
    const { gridWidth, gridHeight, positions, wrappedItems } = this.state;
    const { columnWidth, style, className } = this.props;
    return (
      <div 
        style={{
          ...style,
          position: 'relative',
          width: gridWidth,
          height: gridHeight,
          boxSizing: 'content-box',        
        }}
        className={className}
      >
        {
          wrappedItems.map((item, index) => {
            return React.cloneElement(item, {
              style: {
                position: 'absolute',
                left: positions[index][0],
                top: positions[index][1],
                width: columnWidth,
                transition: CSS_TRANSITION,
                boxSizing: 'border-box',              
              }
            })
          })
        }
      </div>
    );
    
  }
}

