import React from 'react'
import "./style.scss"
import RonModePng from "./ron-mode.png"

const RonModeComponent = ({ronModeActions, ronModeSelectors, getComponent}) => {
  const enabled = ronModeSelectors.getEnabled()
  const Row = getComponent('Row')
  const Col = getComponent('Col')

  const exitRonMode = function(e) {
    e.preventDefault()
    ronModeActions.setEnabled(false)
  }

  if(!enabled)
    return null

  return (
    <div className="ron-mode-indicator">
      <div className="ron-mode-indicator-wrapper fadeOutLeftBig animated">
        <Row className='block' >
          <Col mobile={12}>
            <h2>
              Ron Mode <b>Enabled</b>
              <img alt="Ron Mode" src={RonModePng}/>
            </h2>
          </Col>
        </Row>
      </div>
      <div className='exit-ron-mode'>
        <a href="#" onClick={exitRonMode}>
          Exit Ron Mode
          <img alt="Ron Mode" src={RonModePng}/>
        </a>
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
      RonMode: RonModeComponent
    },
    wrapComponents: {
      BaseLayout: (Ori) => (props) => {
        const RonMode = props.getComponent("RonMode", true)
        const ronModeEnabled = props.ronModeSelectors.getEnabled()
        return (
          <span className={ronModeEnabled ? 'ron-mode' : ''}>
            { ronModeEnabled ? null : (
              <button onClick={() => props.ronModeActions.setEnabled(true)}>Enable</button>
            )}
            <RonMode />
            <Ori {...props}/>
          </span>
        )
      }
    }
  }
}
