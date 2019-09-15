import React from 'react'
import "./style.scss"
import './fonts/AmazDooMLeft.ttf'
import './fonts/AmazDooMRight.ttf'
import DoomGuyComponent from './doom-guy'
import SvgAssets from './svg-assets.jsx'

const RonModeComponent = ({ronModeActions, ronModeSelectors, getComponent}) => {
  const enabled = ronModeSelectors.getEnabled()
  const DoomGuy = getComponent('DoomGuy')

  const exitRonMode = function(e) {
    e.preventDefault()
    ronModeActions.setEnabled(false)
  }

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
              <span className="doom-right">E</span>
              {/* <DoomGuy mode="god" scale={0.8}/> */}
              <hr/>
              <b className="enabled">ENABLED</b>
            </span>
          </div>
        </div>
      </div>
      <div onClick={exitRonMode} className='exit-ron-mode'>
        <span  className="doom">Exi</span>
        <span className="doom-right">T</span>
        <DoomGuy mode="idle"/>
      </div>
    </div>
  )
}

export default function RonMode() {
  console.log('hello')
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
      // SvgAssets,
    },

    wrapComponents: {
      BaseLayout: (Ori) => (props) => {
        const RonMode = props.getComponent("RonMode", true)
        const DoomGuy = props.getComponent("DoomGuy")
        const ronModeEnabled = props.ronModeSelectors.getEnabled()
        return (
          <span className={ronModeEnabled ? 'ron-mode' : ''}>
            {/* { ronModeEnabled ? null : ( */}
            {/*   <button onClick={() => props.ronModeActions.setEnabled(true)}>Enable</button> */}
            {/* )} */}
            {/* <DoomGuy /> */}
            <RonMode />
            <Ori {...props}/>
          </span>
        )
      }
    }
  }
}
