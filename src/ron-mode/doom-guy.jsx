import React from 'react'
import { Component } from 'react'
import './doom-guy.scss'

const  IDLE_ANIMATION = [
  {frameX: 1},
  ,
  ,
  ,
  {frameX: 0},
  {frameX: 1},
  ,
  ,
  ,
  {frameX: 2},
  {frameX: 1},
]

export default class DoomGuy extends Component {

  pos = {
    left: 0,
    step: 0,
  };

  static defaultProps = {
    cellWidth: 108,
    cellHeight: 136,
    scale: 0.6,
    size: 997,
    mode: 'idle',
    speed: 1000,
  };

  state = {
    idleIndex: 0,
    frameX: 1,
    frameY: 0,
  }

  startIdle = () => {
    this.stopIdle()
    console.log('Start animating...')
    this._cancel = this.requestInterval(this.onAnimate, this.props.speed)
  }

  stopIdle = () => {
    if(this._cancel) {
      console.log('Stop animating...')
      this._cancel()
      this._cancel = null
    }
  }

  componentDidMount() {
    this.changeMode(this.props)
  }

  componentDidUnMount() {
    this.stopIdle()
  }

  componentDidReceiveProps(nextProps) {
    if(nextProps.mode != this.props.mode) {
      this.changeMode(nextProps)
    }
  }

  changeMode(props) {
    if(props.mode == 'idle') {
      this.startIdle()
    } else if (props.mode == 'god') {
      this.setState({ frameX: 8, frameY: 0 })
    }
  }

  setBgRef = ref => this.bgRef = ref

  setContainerRef = ref => this.containerRef = ref

  requestInterval = function (fn, delay) {
    let start = new Date().getTime()
    let instance
    const loop = () => {
      instance = requestAnimationFrame(loop);
      let current = new Date().getTime()
      let delta = current - start
      if (delta >= delay) {
        fn.call();
        start = new Date().getTime();
      }
    }

    instance = requestAnimationFrame(loop);

    // Cancel it
    return () => {
      cancelAnimationFrame(instance)
    }
  }

  onAnimate = () => {
    this.setState(state => {
      const idleObj = IDLE_ANIMATION[state.idleIndex]
      const idleIndex = (state.idleIndex + 1 ) % IDLE_ANIMATION.length

      return {
        ...idleObj,
        idleIndex,
      }
    })
  }

  getFrameStyle = () => {
    const { frameX, frameY } = this.state
    let x = -1 * (frameX * this.cellWidth())
    let y = -1 * (frameY * this.cellHeight())

    const [xPlus, yPlus] = this.specialDoomSpriteMagic(frameX, frameY)

    x += xPlus
    y += yPlus

    return {
      bgRef: {
        backgroundPosition: `${x}px ${y}px`,
        backgroundSize: this.props.scale * this.props.size,
      }
    }
  }

  specialDoomSpriteMagic(frameX, frameY) {
    let x = 0
    let y = 0

    if(frameX == 3) {
      x = -8 * this.props.scale
      y = 2 * this.props.scale
      if(frameY >= 4) {
        x -= 10 * this.props.scale
        y += 2 * this.props.scale
      }
    }

    if(frameX >= 4) {
      x = -16 * this.props.scale
      y = 4 * this.props.scale
      if(frameY >= 4) {
        x -= 20 * this.props.scale
        y += 4 * this.props.scale
      }
    }

    return [x,y]
  }

  cellWidth = () => this.props.cellWidth * this.props.scale
  cellHeight = () => this.props.cellHeight * this.props.scale

  render() {
    const style = {
      width: this.cellWidth(),
      height: this.cellHeight(),
    }

    const { bgRef } = this.getFrameStyle()

    return (
      <div ref={this.setContainerRef} className="doom-guy" style={style}>
        <div ref={this.setBgRef} style={bgRef} className="doom-guy-sprite" />
      </div>
    )
  }
}
