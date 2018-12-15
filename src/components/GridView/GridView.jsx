import * as React from 'react'

import throttle from 'lodash.throttle'

import { GridBackground } from '../GridBackground'

import { VisibleGrid } from '../VisibleGrid'

import { normalizedCropData } from '../../data/cropData'

import './GridView.css'

const settings = {
  cellWidth: 20,
  cellHeight: 20,
  maxScale: 10,
  minScale: 1,
  scaleStep: 0.5,
  defaultScale: 5,
  defaultThrottle: 100, //The throttle setting to prevent multiple re-rendering during scroll or resize
  buffer: 5, //The buffer is the number of cells to load around the visible area to make loading additional cells smoother
}

export class GridView extends React.PureComponent {

  state = {
    width: null,
    height: null,
    scrollX: null,
    scrollY: null,
    scale: settings.defaultScale
  }

  componentDidMount(){
    this.updateDimensions();
    this.updateScroll();
    window.addEventListener('resize', this.throttledUpdateDimensions());
    window.addEventListener('scroll', this.throttledUpdateScroll());
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.throttledUpdateDimensions());
    window.removeEventListener('scroll', this.throttledUpdateScroll());
  }

  calculateThrottle = () => {
    return this.state.scale <= 3 ? settings.defaultThrottle * 2 : settings.defaultThrottle;
  }

  throttledUpdateDimensions = () => throttle(this.updateDimensions, this.calculateThrottle(), {trailing: true})

  updateDimensions = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  throttledUpdateScroll = () => throttle(this.updateScroll, this.calculateThrottle(), {trailing: true})

  updateScroll = () => {
    this.setState({
      scrollX: window.scrollX,
      scrollY: window.scrollY
    });
  }

  calculateVisible = (index, visible, total) => {
    const remaining = total - index;
    return visible > remaining ? remaining : visible;
  }

  limitValue = (value, min, max) => Math.max(Math.min(value, max), min);

  increaseScale = () => {
    const scale = this.state.scale + settings.scaleStep;
    if(scale <= settings.maxScale){
      this.setState({
        scale
      });
    }
  }

  decreaseScale = () => {
    const scale = this.state.scale - + settings.scaleStep;
    if(scale >= settings.minScale){
      this.setState({
        scale
      });
    }
  }

  render () {
    const rows = normalizedCropData.rows;
    const columns = normalizedCropData.columns;
    const { width, height, scrollX, scrollY, scale } = this.state;
    const cellWidth = Math.round(settings.cellWidth * scale);
    const cellHeight = Math.round(settings.cellHeight  * scale);
    const fitX = Math.ceil(width / cellWidth) + settings.buffer * 2;
    const fitY = Math.ceil(height / cellHeight) + settings.buffer * 2
    const xIndex = this.limitValue(Math.floor(scrollX / cellWidth) - settings.buffer, 0, columns - fitX);
    const yIndex = this.limitValue(Math.floor(scrollY / cellHeight) - settings.buffer, 0, rows - fitY);
    const visibleColumns = this.calculateVisible(xIndex, fitX, columns);
    const visibleRows = this.calculateVisible(yIndex, fitY, rows);
    const borderSize = scale > 10 ? 2 : scale < 3 ? 0.5 : 1;
    return (
      <div className='grid-view'>
        <GridBackground
          rows={rows}
          columns={columns}
          cellWidth={cellWidth}
          cellHeight={cellHeight}
          borderSize={borderSize}
        />
        {width !== null && height !== null && scrollX !== null && scrollY !== null ? (
          <VisibleGrid
            totalRows={rows}
            totalColumns={columns}
            xIndex={xIndex}
            yIndex={yIndex}
            rows={visibleRows}
            columns={visibleColumns}
            cellWidth={cellWidth}
            cellHeight={cellHeight}
            borderSize={borderSize}
            cropData={normalizedCropData.crops}
          />
        ) : null }
        <div className='grid-controls'>
          <button className='grid-control-plus' onClick={this.increaseScale}>
            +
          </button>
          <button className='grid-control-minux' onClick={this.decreaseScale}>
            &ndash;
          </button>
        </div>
      </div>
    )
  }
}