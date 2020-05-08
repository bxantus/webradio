import React from 'react'

export default class About extends React.Component<{className:string}> {
    render() {
        return <div className={"about " + this.props.className} >
            <h2>About</h2>
            <p>
                Open source webradio implementation using React. 
            </p>
            <p>
                Uses the api provided by <a href="http://www.radio-browser.info">http://www.radio-browser.info</a>
            </p>
            <p>
                If you find any issues, or have feature requests please report them at the project's github page: <a href="https://github.com/bxantus/webradio">https://github.com/bxantus/webradio</a>
            </p>
            <hr></hr>
            <h3>Link for mobile devices:</h3>
            <img src="/webradio/address_qr.png"></img>
        </div>
    }
}