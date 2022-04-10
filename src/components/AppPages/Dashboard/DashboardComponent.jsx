import React, { Component } from 'react';
import {DashboardStyle} from './DashboardComponent.style';
import DailySummaryComponent from './DailySummaryComponent';
import SumCards from './SumCards';

export class DashboardComponent extends Component {
  render() {
    return (
      <DashboardStyle visible={this.props.visibility}>
          <DailySummaryComponent />
          <div className="dashboard-content">
            <div className="dashboard-main">
              <SumCards />
            </div>
            <div className="dashboard-side"></div>
          </div>
      </DashboardStyle>
    )
  }
}

export default DashboardComponent