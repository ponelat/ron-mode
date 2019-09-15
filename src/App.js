import React from 'react';
import './App.css';

import SwaggerUI from 'swagger-ui'
import SwaggerUIStandalone from 'swagger-ui/dist/swagger-ui-standalone-preset'
import 'swagger-ui/dist/swagger-ui.css'
import RonMode from './ron-mode'
import Mousetrap from 'mousetrap'

const ui = SwaggerUI({
  plugins: [SwaggerUIStandalone, RonMode],
  url: "https://petstore.swagger.io/v2/swagger.json",
  layout: 'StandaloneLayout',
})

window.ui = ui


Mousetrap.bind('up up down down left right left right b a', function() {
  ui.ronModeActions.setEnabled()
})

const App = ui.getComponent('App', 'root')

// function App() {

//   return (
//     <SwaggerUIRoot />
//   )
// }

export default App;
