import React from 'react';
import styled from 'styled-components';
import { store } from '../';

export default class ProcessTable extends React.Component<{}, any> {
    render() {
        return (
            <StyledTable id='process-table'>
                <thead>
                    <tr>
                        <th>Process Name</th>
                        <th>Priority Number<sup>*</sup></th>
                        <th>Arrived Time</th>
                        <th>Served Time</th>
                        <th>Start Time</th>
                        <th>Finish Time</th>
                        <th>Turnaround Time</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Process Name</td>
                        <td>Priority Number<sup>*</sup></td>
                        <td>Arrived Time</td>
                        <td>Served Time</td>
                        <td>Start Time</td>
                        <td>Finish Time</td>
                        <td>Turnaround Time</td>
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