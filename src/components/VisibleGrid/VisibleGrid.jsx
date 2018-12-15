import * as React from 'react'

import './VisibleGrid.css'

export class VisibleGrid extends React.PureComponent {
  state = {
    selection: {},
    lastSelected: null
  }

  getRange = (start, end) => {
    if(start > end){
      return {start: end, end: start}
    }else{
      return {start, end}
    }
  }

  handleSelect = (e, columnIndex, rowIndex) => {
    if(this.state.lastSelected && (e.ctrlKey || e.altKey)){
      const newSelection = {...this.state.selection};
      const xRange = this.getRange(this.state.lastSelected.columnIndex, columnIndex);
      const yRange = this.getRange(this.state.lastSelected.rowIndex, rowIndex);
      for(let i = xRange.start; i <= xRange.end; i++){
        for(let j = yRange.start; j <= yRange.end; j++){
          newSelection[`${i},${j}`] = e.ctrlKey ? true : false
        }
      }
      this.setState({
        selection: newSelection,
        lastSelected: null
      });
    }else{
      this.setState({
        selection: {
          ...this.state.selection,
          [`${columnIndex},${rowIndex}`]: e.ctrlKey ? true : e.altKey ? false : !this.state.selection[`${columnIndex},${rowIndex}`]
        },
        lastSelected: {
          columnIndex,
          rowIndex
        }
      });
    }
  }

  cell = (cropData, columnIndex, rowIndex, selected, key) => {
    return (
      <div
        key={key}
        className={`grid-cell ${selected ? 'grid-cell-selected ' : ''} ${cropData.diseased ? 'grid-cell-diseased ' : ''}`}
        style={{
          width: `${this.props.cellWidth}px`,
          height: `${this.props.cellHeight}px`,
        }}
        onClick={(e)=>this.handleSelect(e, columnIndex, rowIndex)}
      >
      </div>
    )
  }

  render () {
    const { xIndex, yIndex, rows, columns, cellWidth, cellHeight, borderSize, cropData } = this.props;
    const cells = [];
    for(let i = 0; i < rows; i++){
      for(let j = 0; j < columns; j++){
        const rowIndex = yIndex + i;
        const columnIndex = xIndex + j;
        const selected = this.state.selection[`${columnIndex},${rowIndex}`];
        const key = `${i},${j}`;
        /*const key = `${rowIndex},${columnIndex}`*/;
        cells.push(this.cell(cropData[`${rowIndex},${columnIndex}`], columnIndex, rowIndex, selected, key));
      }
    }
    return (
      <div
        className='visible-grid'
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, rgb(0,0,0) 0px, rgb(0,0,0) ${borderSize}px, transparent ${borderSize}px, transparent ${cellWidth - borderSize}px, rgb(0,0,0) ${cellWidth - borderSize}px, rgb(0,0,0) ${cellWidth}px), repeating-linear-gradient(90deg, rgb(0,0,0) 0px, rgb(0,0,0) ${borderSize}px, transparent ${borderSize}px, transparent ${cellHeight - borderSize}px, rgb(0,0,0) ${cellHeight - borderSize}px, rgb(0,0,0) ${cellHeight}px)`,
          left: `${xIndex * cellWidth}px`,
          top: `${yIndex * cellHeight}px`,
          width: `${columns * cellWidth}px`,
          height: `${rows * cellHeight}px`,
        }}
      >
        {cells}
      </div>
    )
  }
}