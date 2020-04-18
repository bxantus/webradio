import React from 'react';

export default class Search extends React.Component {
    render() {
        return (
            <div className="search">
                <input defaultValue="Search for"></input>
                <div className="results" >Search results</div>  {/* todo: replace with StationList  */}
            </div>
        )
    }
}