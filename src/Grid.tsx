import ResizeObserverPolyfill from 'resize-observer-polyfill';
import * as React from 'react';
import doLayout from './doLayout';

// as for now, ResizeObserver is only supported in chrome
// in other browser, we need polyfill.
const ResizeObserver = (window as any).ResizeObserver || ResizeObserverPolyfill;

const INITIAL_HEIGHT = 1000;

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
  positions: any[];
  wrappedItems: any[];
  gridWidth: number;
  gridHeight: number;
}

export default class PinterestGrid extends React.PureComponent<PinterestGridProps, PinterestGridState> {

  wrappedRefs: any[] = [];

  private resizeObserver = new ResizeObserver((entries: any) => {
    const { wrappedItems } = this.state;
    const { columnWidth, gutterWidth, gutterHeight, columns } = this.props;
    if (this.wrappedRefs.length !== wrappedItems.length) {
      throw new Error('wrapped items not equals container\'s count.');
    }
    // use dom real height to do layout again
    const itemHeights = this.wrappedRefs.map(item => item.clientHeight);
    this.setState(
      doLayout(itemHeights, { columnWidth, gutterWidth, gutterHeight, columns })
    );
  });

  constructor(props: PinterestGridProps) {
    super(props);
    const { columnWidth, gutterWidth, gutterHeight, columns, children } = this.props;
    this.wrappedRefs = [];
    const wrappedItems: any[] = this.createWrappedItems(children!);
    this.state = ({
      wrappedItems,
      ...doLayout(
        // initial height is from props if any
        wrappedItems.map(item => item.props.height), 
        { columnWidth, gutterWidth, gutterHeight, columns }
      )
    } as PinterestGridState)  
  }

  componentWillReceiveProps(nextProps: PinterestGridProps) {
    const { columnWidth, gutterWidth, gutterHeight, columns, children } = nextProps;
    const wrappedItems = this.createWrappedItems(children!);
    this.setState({
      wrappedItems,     
      ...doLayout(
        // initial height is from props if any
        wrappedItems.map(item => item.props.height), 
        { columnWidth, gutterWidth, gutterHeight, columns }
      )
    });
  }

  componentWillUnmount() {
    this.resizeObserver.disconnect();
  }

  createWrappedItems = (children: React.ReactChildren): any[] => {   
    const items = React.Children.toArray(children);
    if (!Array.isArray(items)) {
      return [];
    }  
    const wrappedItems = items.map((item: any, index: number) => {
      // provide a big inital height, in order to make every item
      // showing from bottom to up. 
      const props = {
        height: INITIAL_HEIGHT
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
                transition: 'all 1s ease',
              }
            })
          })
        }
      </div>
    );
    
  }
}

