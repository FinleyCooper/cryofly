import React from "react";

import Loading from "@components/Loading"

import "./index.css"


export default class Timetable extends React.Component {
  constructor(props) {
    super(props)

    this.changeWeek = this.changeWeek.bind(this);

    this.state = {
      lessons: [],
      error: null,
      nextWeek: false
    }
  }

  changeWeek() {
    this.setState((prevState) => ({ nextWeek: !prevState.nextWeek}));
  }

  componentDidMount() {
    fetch("/api/lessons")
      .then((resp) => resp.json())
      .then((data) => {
        if (data.error === true) {
          this.setState({
            error: data.message
          });
        }
        else {
          this.setState({
            lessons: data.content,
            dataLoaded: true
          });
        }
      })
    .catch(e => {
      this.setState({
        error: e
      })
    })
  }

  render() {
    if (this.state.lessons.length === 0) {
      return (
        <Loading />
      )
    }

    const dayOffset = this.state.nextWeek ? 5 : 0;

    return (
      <div className="timetable-page">
        <div className="timetable-container">
          <div className="day-column">
            <div className="day">
              Monday
            </div>
            <div className="day">
              Tuesday
            </div>
            <div className="day">
              Wednesday
            </div>
            <div className="day">
              Thursday
            </div>
            <div className="day">
              Friday
            </div>
          </div>
          <div className="timetable">
            <div className="period-row">
              <div className="period">
                Period 1
              </div>
              <div className="period">
                Period 2
              </div>
              <div className="period">
                Period 3
              </div>
              <div className="period">
                Period 4
              </div>
              <div className="period">
                Period 5
              </div>
              <div className="period">
                Period 6
              </div>
            </div>
            {Array.from({ length: 5 }, (_, i) => (
              <div className="timetable-day" key={i + dayOffset}>
                <ol className="lessons">
                  {Array.from({ length: 6 }, (_, j) => (
                    <li className={"lesson " + this.state.lessons[i + dayOffset][j].subject?.toLowerCase()?.replace(/ /g, "-")} key={j}>
                      <div className="subject">
                        {this.state.lessons[i + dayOffset][j].subject}
                      </div>
                      <div className="teacher">
                        {this.state.lessons[i + dayOffset][j].teacher}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
          <div>
            <button onClick={this.changeWeek} className="week-changer">Next Week</button>
          </div>
        </div>
      </div>

    )
  }
}