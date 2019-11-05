import React from 'react';
import ReactDOM from 'react-dom';

import ProcessTable from './components/ProcessTable';

class App extends React.Component {
    render() {
        return (
            <ProcessTable />
        );
    }
}

ReactDOM.render(<App />, document.querySelector('#app'));