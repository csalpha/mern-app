// // // libraries import 
// // import  ReactDom from 'react-dom/client'
// // import React from 'react'
// // import './index.css';


// // //Components import
// // import App from './App'

// // // element search with id="root"
// // const root = document.querySelector('#root');

// // // component render in html div with id="root"
// // ReactDom.createRoot(root).render(<App />);

// // // libraries import
// // import React from 'react';
// // import ReactDom from 'react-dom/client';

// // // Components import
// // import App from './App';

// // // vai buscar o elemento com o id root
// // const root = document.querySelector('#root');

// // // REACT 18
// // // Renderização do React component na div com id="root"
// // ReactDom.createRoot(root).render(<App />)

// importação de bibliotecas ( libraries import )
import React from 'react';
// ReactDOM - responsável por fazer a renderização da minha aplicação
// // import ReactDOM from 'react-dom';
// React 18
// // import ReactDOM from 'react-dom/client';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
// importar componente
// './' - ir buscar dentro da mesma pasta onde eu tenho este ficheiro
// importação do componente App dentro da mesma pasta do ficheiro index.js
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
// importar ficheiro index.css que está dentro da mesma pasta que o ficheiro
// alteração do css dos elementos de uma forma global
import './index.css';
import { StoreProvider } from './Store';

// função render recebe 2 argumentos
// 1 arg - O que é que eu quero rendrizar
// 2 arg - Indicar em que elemento é que eu quero que isto seja renderizado
// render - apresentação visual da nossa aplicação
ReactDOM.render(
  // Utilizar React Component
      // 1st arg
      <StoreProvider>
        <HelmetProvider>
          <PayPalScriptProvider deferLoading={true}>
            <App />
          </PayPalScriptProvider>
        </HelmetProvider>
        </StoreProvider>, // 1st arg
  // document - principal ponto de entrada para modificar o conteudo do HTML
  // document.getElementById('root') //2nd arg
  document.querySelector("#root") //2nd arg
);



