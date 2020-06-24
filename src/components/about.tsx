import React from 'react'

export default class About extends React.Component<{className:string}> {
    render() {
        return <div className={"about " + this.props.className} >
            <h2>About webradio</h2>
            <p>
                Open source webradio implementation using React. 
            </p>
            <p>
                Uses the api provided by <a target="blank" href="http://www.radio-browser.info">www.radio-browser.info</a>
            </p>
            <p>
                If you find any issues, or have feature requests please report them at the project's github page: <a href="https://github.com/bxantus/webradio" target="blank">github.com/bxantus/webradio</a>
            </p>
            <a href="https://bxantus.github.io/webradio/index.html">
                <img className="qr-code" src="/webradio/address_qr.png"></img>
            </a>
            <h4>Link for mobile devices:</h4>
            <p className="small-margin">
                Scan the code to the right on a mobile phone to open webradio on it!
            </p>
        </div>
    }
}