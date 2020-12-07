import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import WebRadio from './webradio'

let preloadedImages:HTMLImageElement[] = []
function preloadSvg(url:string) {
  const img = new Image()
  img.src = url
  preloadedImages.push(img)
}

preloadSvg("/webradio/icons/loading.svg");
preloadSvg("/webradio/icons/stop.svg");
preloadSvg("/webradio/icons/info.svg");

ReactDOM.render(
  <React.StrictMode>
    <WebRadio>my text</WebRadio>
  </React.StrictMode>,
  document.getElementById('root')
);

