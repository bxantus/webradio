// todo: move css to build or public
// import './index.css';

import WebRadio from './webradio.ts'

let preloadedImages:HTMLImageElement[] = []
function preloadSvg(url:string) {
  const img = new Image()
  img.src = url
  preloadedImages.push(img)
}

preloadSvg("/icons/loading.svg");
preloadSvg("/icons/stop.svg");
preloadSvg("/icons/info.svg");

window.onload = () => {
  const rootEl = document.getElementById('root')!
  rootEl.innerHTML = ""
  const webRadio = new WebRadio
  rootEl.append(webRadio.element)
}


