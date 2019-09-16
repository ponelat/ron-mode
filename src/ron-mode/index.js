import React from 'react'
import "./style.scss"
import './fonts/AmazDooMLeft.ttf'
import './fonts/AmazDooMRight.ttf'
import DoomGuyComponent from './doom-guy'
import SvgAssets from './svg-assets.jsx'
import TopBarComponent from "./topbar"

class RonModeComponent extends React.Component {

  state = {
    mode: 'idle',
  }

  exitRonMode = () => {
    this.setState({ mode: 'grin'})
    setTimeout(() => {
      this.props.ronModeActions.setEnabled(false)
      setTimeout(() => this.setState({ mode: 'idle'}), 0)
    }, 300)
  }

  render() {
    const { ronModeSelectors, getComponent} = this.props
    const enabled = ronModeSelectors.getEnabled()
    const DoomGuy = getComponent('DoomGuy')

    if(!enabled)
      return null

    return (
      <div className="ron-mode-indicator">
        <SvgAssets/>
        <div className="ron-mode-indicator-wrapper fadeOutDownBig animated">
          <div className="block">
            <div className="block-floating">
              <span className="ron-mode-enabled">
                <span className="doom">RonMod</span>
                <span className="doom doom-right">E</span>
                {/* <DoomGuy mode="god" scale={0.8}/> */}
                <hr/>
                <b className="enabled">ENABLED</b>
              </span>
            </div>
          </div>
        </div>
        <div onClick={this.exitRonMode} className='exit-ron-mode'>
          <span  className="doom">Exi</span>
          <span className="doom doom-right">T</span>
          <DoomGuy mode={ this.state.mode }/>
        </div>
      </div>
    )
  }
}

export default function RonMode() {
  return {
    initialState: {
      ronMode: {
        enabled: true
      }
    },
    statePlugins: {
      spec: {
        wrapActions: {
          updateUrl: (ori, system) => (url) => {
            if(url == 'ronmode') {
              url = system.specSelectors.url()
              system.ronModeActions.setEnabled()
            }
            ori(url)
          },
          download: (ori, system) => (url) => {
            if(url == 'ronmode') {
              return
            }
            ori(url)
          }
        }
      },
      editor: {
        wrapActions: {
          onLoad: (ori, system) => (obj) => {
            ori(obj)
            obj.editor.setTheme('ace/theme/monokai')
          }
        }
      },
      ronMode: {
        actions: {
          setEnabled(enabled=true) {
            return {
              type: "ron_mode_enabled",
              payload: !!enabled
            }
          }
        },
        selectors: {
          getEnabled(state) {
            return state.get('enabled')
          }
        },
        reducers: {
          ['ron_mode_enabled'](state, action) {
            return state.set('enabled', action.payload)
          }
        }
      }
    },
    components: {
      RonMode: RonModeComponent,
      DoomGuy: DoomGuyComponent,
      TopbarRonMode: TopBarComponent,
      // SvgAssets,
    },

    wrapComponents: {
      Topbar: (Ori) => (props) => {
        const TopbarRonMode = props.getComponent("TopbarRonMode", true)
        if(props.ronModeSelectors.getEnabled())
          return <TopbarRonMode {...props} />
        return <Ori {...props}/>
      },
      BaseLayout: (Ori) => (props) => {
        const RonMode = props.getComponent("RonMode", true)
        const DoomGuy = props.getComponent("DoomGuy")
        const ronModeEnabled = props.ronModeSelectors.getEnabled()
        return (
          <span className={ronModeEnabled ? 'ron-mode' : ''}>
            {/* { ronModeEnabled ? null : ( */}
            {/*   <button onClick={() => props.ronModeActions.setEnabled(true)}>Enable</button> */}
            {/* )} */}
            <RonMode />
            <Ori {...props}/>
          </span>
        )
      }
    }
  }
}
