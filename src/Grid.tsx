import ResizeObserverPolyfill from 'resize-observer-polyfill';
import * as React from 'react';
import doLayout, { Position } from './layout';

// as for now, ResizeObserver is only supported in chrome
// in other browser, we need polyfill.
const ResizeObserver = (window as any).ResizeObserver || ResizeObserverPolyfill;

const INITIAL_HEIGHT = 500;
const CSS_TRANSITION = 
  'left 500ms cubic-bezier(0.215, 0.61, 0.355, 1) 0s,' + 
  'top 700ms cubic-bezier(0.215, 0.61, 0.355, 1) 0s';

const DEFAULT_COLUMNS = 4;
const DEFAULT_COLUMN_WIDTH = 200;
const DEFAULT_GUTTER = 10; 

export interface BreakPoint{
  minScreenWidth: number;
  maxScreenWidth: number;
  columnWidth: number;
  columns: number;
}

export interface PinterestGridProps {
  columnWidth: number;
  columns: number;
  gutterWidth: number;
  gutterHeight: number;
  responsive?: boolean | ResponsiveConfigObject;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactChildren;
}

export interface ResponsiveConfigObject {
  minPadding?: number;
  maxWidth?: number;
  customBreakPoints?: BreakPoint[];
}

interface PinterestGridState {
  positions: Position[];
  wrappedItems: any[];
  gridWidth: number;
  gridHeight: number;
}

export default class PinterestGrid extends React.PureComponent<PinterestGridProps, PinterestGridState> {

  static defaultProps = {
    columns: DEFAULT_COLUMNS,
    columnWidth: DEFAULT_COLUMN_WIDTH,
    gutterWidth: DEFAULT_GUTTER,
    gutterHeight: DEFAULT_GUTTER,
  }

  wrappedRefs: any[] = [];

  state = {
    positions: [],
    wrappedItems: [],
    gridWidth: 0,
    gridHeight: 0,
  }

  private resizeObserver = new ResizeObserver((entries: any) => {
    this.doLayout();
  });

  componentWillMount() {
    const { children } = this.props;
    const wrappedItems: any[] = this.createWrappedItems(children!);
    this.doLayout(wrappedItems);
  }

  componentDidMount() {
    this.observeChildren();
  }

  componentDidUpdate(prevProps: PinterestGridProps) {
    const { columnWidth, gutterWidth, gutterHeight, columns, children } = this.props;
    // children list count change
    if (children !== prevProps.children) {
      const wrappedItems = this.createWrappedItems(children!);
      this.doLayout(wrappedItems);
      setTimeout(this.observeChildren)
    } 
    if ( columnWidth !== prevProps.columnWidth ||
      gutterHeight !== prevProps.gutterHeight ||
      gutterWidth !== prevProps.gutterWidth ||
      columns !== prevProps.columns
    ) {
      this.doLayout();
    }   
  }

  componentWillUnmount() {
    this.unobserveChildren();
  }

  observeChildren = () => {
    const container: any = this.refs.container;
    let len = 0;
    if (container && container.children && container.children.length) {
      len = container.children.length;
    }
    for (let i = 0; i < len; i++) {
      this.resizeObserver.observe(container.children[i]);
    }
  }

  unobserveChildren = () => {
    const container: any = this.refs.container;
    let len = 0;
    if (container && container.children && container.children.length) {
      len = container.children.length;
    }
    for (let i = 0; i < len; i++) {
      this.resizeObserver.unobserve(container.children[i]);
    }
    this.resizeObserver.disconnect();
  }



  createWrappedItems = (children: React.ReactChildren): any[] => {
    this.wrappedRefs = [];   
    const items = React.Children.toArray(children);
    if (!Array.isArray(items)) {
      return [];
    }  
    const wrappedItems = items.map((item: any, index: number) => {      
      return (
        <div key={item.key || `pinterest-${index}`}>
          {item}
        </div>
      )
    });
    return wrappedItems;
  }


  doLayout = (wrappedItems?: any[]) => {
    const { columnWidth, gutterWidth, gutterHeight, columns } = this.props;
    const container: any = this.refs.container;
    let nextWrappedItems: any[] = this.state.wrappedItems;
    if (Array.isArray(wrappedItems)) {
      nextWrappedItems = wrappedItems;
    }
    const itemHeights = nextWrappedItems.map((item, index) => {
      if (container && container.children && container.children[index]) {
        return container.children[index].clientHeight;
      }
      return INITIAL_HEIGHT;
    })

    this.setState({
      wrappedItems: nextWrappedItems,           
      ...doLayout(
        itemHeights, 
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
        ref="container"
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

