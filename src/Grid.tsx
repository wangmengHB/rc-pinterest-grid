import ResizeObserverPolyfill from 'resize-observer-polyfill';
import * as React from 'react';
import doLayout from './doLayout';

// as for now, ResizeObserver is only supported in chrome
// in other browser, we need polyfill.
const ResizeObserver = (window as any).ResizeObserver || ResizeObserverPolyfill;


export interface PinterestGridProps {
  columnWidth: number;
  columns: number;
  gutterWidth: number;
  gutterHeight: number;
  style?: React.CSSProperties;
  className?: string;
}

interface PinterestGridState {
  positions: any[];
  wrappedItems: any[];
  gridWidth: number;
  gridHeight: number;
}

export default class PinterestGrid extends React.PureComponent<PinterestGridProps, PinterestGridState> {

  state = {
    positions: [],
    wrappedItems: [],
    gridWidth: 0,
    gridHeight: 0,
  }

  wrappedRefs: any[] = [];

  private resizeObserver = new ResizeObserver(entries => {
    const { wrappedItems } = this.state;
    const { columnWidth, gutterWidth, gutterHeight, columns } = this.props;
    if (this.wrappedRefs.length !== wrappedItems.length) {
      console.error('error');
      return;
    }
    const itemHeights = this.wrappedRefs.map(item => item.clientHeight);
    this.setState(
      doLayout(itemHeights, { columnWidth, gutterWidth, gutterHeight, columns })
    );
  });

  constructor(props: PinterestGridProps) {
    super(props);
    const { columnWidth, gutterWidth, gutterHeight, columns, children } = this.props;
    this.wrappedRefs = [];
    const wrappedItems = this.createWrappedItems(children);
    this.state = {
      wrappedItems,
      // initial height is using child item's props if it has any
      ...doLayout(
        wrappedItems.map(item => item.props.height),
        { columnWidth, gutterWidth, gutterHeight, columns }
      )
    }  
  }

  componentWillReceiveProps(nextProps) {
    const { columnWidth, gutterWidth, gutterHeight, columns, children } = nextProps;
    const wrappedItems = this.createWrappedItems(children);
    this.setState({
      wrappedItems,
      // initial height is using props if any
      ...doLayout(
        wrappedItems.map(item => item.props.height),
        { columnWidth, gutterWidth, gutterHeight, columns }
      )
    });
  }

  componentWillUnmount() {
    this.resizeObserver.disconnect();
  }


  createWrappedItems = (children) => {   
    const items = React.Children.toArray(children);  
    const wrappedItems = items.map((item: any, index: number) => {
      console.log(item.props);
      return (
        <div 
          ref={ (_) => {
            if (_) {
              this.wrappedRefs[index] = _ ;
              this.resizeObserver.observe(_);
            }
          }}
          key={item.key || `pinterest-${index}`}
          {...item.props} 
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

