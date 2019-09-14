import React from 'react';
import './App.css';

import SwaggerUI from 'swagger-ui'
import 'swagger-ui/dist/swagger-ui.css'
import RonMode from './ron-mode'

const ui = SwaggerUI({
  plugins: RonMode,
  url: "https://petstore.swagger.io/v2/swagger.json",
})

window.ui = ui

const App = ui.getComponent('App', 'root')

// function App() {

//   return (
//     <SwaggerUIRoot />
//   )
// }

export default App;
