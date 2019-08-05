const defaultHeight = 200;

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
  // create an array to record each column's total height.
  const columnHeights = Array.from(new Float32Array(columns));
  
  const positions: any[] = itemsHeight.map((itemHeight) => {
    const index = columnHeights.indexOf(Math.min.apply(null, columnHeights));
    // if height is not provided, use default height.
    const height = itemHeight || defaultHeight;
    const x = index * columnWidth + index * gutterWidth;
    const y = columnHeights[index];
    columnHeights[index] += Math.round(height) + gutterHeight;
    return [x, y];
  });

  const gridWidth: number = columns * columnWidth + (columns - 1) * gutterWidth;
  const gridHeight: number = Math.max.apply(null, columnHeights) - gutterHeight;

  return { positions, gridWidth, gridHeight };
}
