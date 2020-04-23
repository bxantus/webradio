import React from 'react'

export default class About extends React.Component {
    render() {
        return <div className="about">
            <h2>About</h2>
            <p>
                Open source webradio implementation. 
            </p>
            <p>
                Uses the api provided by <a href="http://www.radio-browser.info">http://www.radio-browser.info</a>
            </p>
            <p>
                If you find any issues, or have feature requests please report them at the project's github page:
                <a href="https://github.com/bxantus/webradio">https://github.com/bxantus/webradio</a>
            </p>
        </div>
    }
}