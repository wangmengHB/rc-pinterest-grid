export const defaultHeight = 200;

export interface layoutProps {
  columns: number;
  columnWidth: number;
  gutterWidth: number;
  gutterHeight: number;
}

export default function doLayout(itemsHeight: number[], props: layoutProps) {
  const {
    columns, columnWidth, gutterWidth, gutterHeight
  } = props;

  const columnHeights: number[] = [];
  for (let i = 0; i < columns; i++) {
    columnHeights.push(0);
  }

  
  const positions = itemsHeight.map((itemHeight) => {
    const column = columnHeights.indexOf(Math.min.apply(null, columnHeights));

    // height maybe need to be lazy calculated.
    const height = itemHeight || defaultHeight;
    
  
    if (!(height && typeof height === 'number')) {
      throw new Error('item height must be a number.');
    }

    const x = column * columnWidth + column * gutterWidth;
    const y = columnHeights[column];

    columnHeights[column] += Math.round(height) + gutterHeight;

    return [x, y];
  });

  const gridWidth = columns * columnWidth + (columns - 1) * gutterWidth;
  const gridHeight = Math.max.apply(null, columnHeights) - gutterHeight;

  return { positions, gridWidth, gridHeight };
}
