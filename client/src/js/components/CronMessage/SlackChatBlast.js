import React from 'react';
import moment from 'moment';

export default class SlackChatBlast extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: '',
      month: '',
      day: '',
      hour: '09',
      minute: '00',
      message: '',
      url: '',
    };
    this.changeHandler = this.changeHandler.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
  }
  changeHandler(obj) {
    this.setState({ [obj.target.name]: obj.target.value })
  }

  clickHandler() {
    let cronJob = {
      url: this.state.url,
      message: this.state.message,
      date: `${this.state.year}-${this.state.month}-${this.state.day}T${this.state.hour}:${this.state.minute}.999Z`
    }
    this.props.callback(cronJob)
    this.setState({message: '', url: '', minute: '00', hour: '09'})
  }

  componentDidMount() {
    let date = moment()
    let year = date.format('Y')
    let month = date.format('MM')
    let day = date.format('DD')
    this.setState({year: year, month: month, day: day})
  }

  render () {
    
    let hours = ['07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
    let hourOptions = hours.map((i, index) =>
    <option key={index} value={i}>{i}</option>
    );
    let minute = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']
    let minuteOptions = minute.map((i, index) => 
    <option key={index} value={i}>{i}</option>
    );
    
    return(

      <div className='acc-partner-window' onClick={this.props.closeWindow()}>
        <div className='acc-partner-container'>
        <h3 className='acc-partner-header'>Send Slack-Bot Message</h3>
          <div className='slack-blast-row-textarea'>
            <p>Message</p>
            <textarea name='message' onChange={this.changeHandler} value={this.state.message}></textarea>
          </div>
          <div className='slack-blast-row'>
            <p>Link</p>
            <input className='input' name='url' onChange={this.changeHandler} value={this.state.url}></input>
          </div>
          <div className='slack-blast-row'>
            <p>Year</p>
            <input className='input-time' name='year' onChange={this.changeHandler} value={this.state.year} type='number'></input>
          </div>
          <div className='slack-blast-row'>
            <p>Month</p>
            <input className='input-time' name='month' onChange={this.changeHandler} value={this.state.month} type='number'></input>
          </div>
          <div className='slack-blast-row'>
            <p>Day</p>
            <input className='input-time' name='day' onChange={this.changeHandler} value={this.state.day} type='number'></input>
          </div>
          <div className='slack-blast-row'>
            <p>Hours</p>
            <select className='edit-button-mobile' name='hour' value={this.state.hour} onChange={this.changeHandler}>
            {hourOptions}
            </select>
          </div>
          <div className='slack-blast-row'>
            <p>Minute</p>
            <select className='edit-button-mobile' name='minute' value={this.state.minute} onChange={this.changeHandler}>
              {minuteOptions}
            </select>
          </div>
          <div className='acc-partner-row'>
            <button className='edit-button-mobile' onClick={this.clickHandler}>Submit</button>
          </div>
          <div className='acc-partner-row'>
            <button className='return-btn' onClick={this.props.closeWindow()}>Return</button>
          </div>
        </div>
      </div>
    );
  }
}
