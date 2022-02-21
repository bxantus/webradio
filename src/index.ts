// import './index.css';

// import WebRadio from './webradio.tsx'

let preloadedImages:HTMLImageElement[] = []
function preloadSvg(url:string) {
  const img = new Image()
  img.src = url
  preloadedImages.push(img)
}

preloadSvg("/webradio/icons/loading.svg");
preloadSvg("/webradio/icons/stop.svg");
preloadSvg("/webradio/icons/info.svg");

window.onload = () => {
  document.getElementById('root')
}


