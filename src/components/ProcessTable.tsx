import React from 'react';
import styled from 'styled-components';
import { AlgorithmType } from '../definition';

export default class ProcessTable extends React.Component<{}, any> {
    state = {
        processes: new Map(),
    };

    componentDidMount() {
        setInterval(() => this.setState({
            processes: window.store.processes,
        }), 100);
    }

    isShowPriority() {
        return window.store?.algorithm === AlgorithmType.DynamicPSA;
    }

    renderProcesses() {
        return Array.from(this.state.processes.values()).map(({
            name = '',
            priorityNumber = '',
            arrivedTime = '',
            servedTime = '',
            startTime = '',
            finishTime = '',
            turnAroundTime = '',
        }) => (
            <tr>
                <th>{ name }</th>
                { this.isShowPriority() ? <th>{ priorityNumber }</th> : null }
                <th>{ arrivedTime }</th>
                <th>{ servedTime }</th>
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
                        { this.isShowPriority() ? <th>Priority Number<sup>*</sup></th> : null }
                        <th>Arrived Time</th>
                        <th>Served Time</th>
                        <th>Start Time</th>
                        <th>Finish Time</th>
                        <th>Turnaround Time</th>
                    </tr>
                </thead>
                <tbody>
                    { this.renderProcesses() }
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