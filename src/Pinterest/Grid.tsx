import * as React from 'react';
import doLayout from './doLayout';

export interface PinterestGridProps {
  columnWidth: number;
  columns: number;
  gutterWidth: number;
  gutterHeight: number;
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

  wrappedRefs: any = [];

  private resizeObserver = new (window as any).ResizeObserver(entries => {
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


  createWrappedItems = (children) => {   
    const items = React.Children.toArray(children);  
    const wrappedItems = items.map((item: any, index: number) => {
      return (
        <div 
          ref={ (_) => {
            this.wrappedRefs[index] = _ ;
            this.resizeObserver.observe(_);
          }}
          key={item.key}
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
    const { columnWidth } = this.props;
    
    return (
      <div style={{
        position: 'relative',
        width: gridWidth,
        height: gridHeight,
        border: 'solid 5px',
      }}>
        {
          wrappedItems.map((item, index) => {
            return React.cloneElement(item, {
              style: {
                position: 'absolute',
                left: positions[index][0],
                top: positions[index][1],
                border: 'solid 1px red',
                width: columnWidth,
                overflow: 'hidden',
              }
            })
          })
        }
      </div>
    );
    
  }
}

