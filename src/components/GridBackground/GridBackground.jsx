import * as React from 'react'

import './GridBackground.css'

export class GridBackground extends React.PureComponent {
  render () {
    const { rows, columns, cellWidth, cellHeight, borderSize } = this.props;
    const backgroundStyle = {
      width: columns * cellWidth,
      height: rows * cellHeight,
      backgroundImage: `repeating-linear-gradient(0deg, rgb(0,0,0) 0px, rgb(0,0,0) ${borderSize}px, transparent ${borderSize}px, transparent ${cellWidth - borderSize}px, rgb(0,0,0) ${cellWidth - borderSize}px, rgb(0,0,0) ${cellWidth}px), repeating-linear-gradient(90deg, rgb(0,0,0) 0px, rgb(0,0,0) ${borderSize}px, transparent ${borderSize}px, transparent ${cellHeight - borderSize}px, rgb(0,0,0) ${cellHeight - borderSize}px, rgb(0,0,0) ${cellHeight}px)`,
    }
    return (
      <div className='grid-background' style={backgroundStyle} />
    )
  }
}