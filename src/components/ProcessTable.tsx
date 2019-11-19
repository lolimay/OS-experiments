import React from 'react';
import styled from 'styled-components';
import { AlgorithmType } from '../definition';

export default class ProcessTable extends React.Component<{}, any> {
    state = {
        processes: new Map(),
        averageTurnAroundTime: ''
    };

    componentDidMount() {
        setInterval(() => this.setState({
            processes: window.store.processes,
            averageTurnAroundTime: (() => {
                const processes = Array.from(window.store.processes).map(({ turnAroundTime }) => parseInt(turnAroundTime));
                const averageTurnAroundTime = processes.reduce((sum, value) => sum + value) / processes.length;

                return averageTurnAroundTime !== NaN ? averageTurnAroundTime : '';
            })(),
        }), 100);
    }

    isDynamicPSA() {
        return window.store?.algorithm === AlgorithmType.DynamicPSA;
    }

    renderProcesses() {
        return Array.from(this.state.processes.values()).map(({
            name = '',
            priority = '',
            arrivedTime = '',
            servedTime = '',
            startTime = '',
            finishTime = '',
            turnAroundTime = '',
        }) => (
            <tr>
                <th>{ name  }</th>
                { this.isDynamicPSA() ? <th>{ priority }</th> : null }
                <th>{ arrivedTime }</th>
                { !this.isDynamicPSA() ? <th>{ servedTime }</th> : null }
                <th>{ startTime }</th>
                <th>{ finishTime }</th>
                <th>{ turnAroundTime }</th>
            </tr>
        ));
    }

    render() {
        return (
            <StyledTable id='process-table'>
                <thead>
                    <tr>
                        <th>Process Name</th>
                        { this.isDynamicPSA() ? <th>Priority Number<sup>*</sup></th> : null }
                        <th>Arrived Time</th>
                        { !this.isDynamicPSA() ? <th>Served Time</th> : null }
                        <th>Start Time</th>
                        <th>Finish Time</th>
                        <th>Turnaround Time</th>
                    </tr>
                </thead>
                <tbody>
                    { this.renderProcesses() }
                    <tr>
                        <th>Average Turnaround Time</th>
                        <th colSpan={ 5 }>{ this.state.averageTurnAroundTime }</th>
                    </tr>
                </tbody>
            </StyledTable>
        );
    }
}

const StyledTable = styled.table`
    background: transparent;
    border-collapse: collapse;
    border-spacing: 0;

    tr th, tr td {
        color: white;
        border: 1px white solid;
        padding: 5px 10px;
    }
`;