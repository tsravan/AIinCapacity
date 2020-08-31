import React, { Component } from "react";
import "./UserForm.css";
import { postapi } from "./Common";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

class MatchCriteria extends Component {
  constructor(props) {
    super(props);
    this.state = {
      empLocation: "",
      experiance: "",
      rank: "",
      benchAgeing: "",
      technicalSkill: "",
      functionalSkill: "",
      processSkill: "",
    };
  }

  // async function makeGetRequest(URL) {

  //     let res = await axios.get(URL);

  //     let data = res.data;
  //     console.log(data);
  //   }

  //makeGetRequest(props.URL);
  handleSubmit = (event) => {
    event.preventDefault();

    const userPostData = {
      technicalSkill: this.state.technicalSkill,
      functionalSkill: this.state.functionalSkill,
      processSkill: this.state.processSkill,
      empLocation: this.state.empLocation,
      rank: this.state.rank,
      experiance: this.state.experiance,
      benchAgeing: this.state.benchAgeing,
    };
    const URL = "";

    //Post API Call
    postapi(URL, userPostData);
    document.getElementById("btnSubmit").style.display = "none";
  };
  render() {
    return (
      
        <form className='serviceform' onSubmit={this.handleSubmit}>
        <div className="table-outer">
          <TableContainer component={Paper}>
            <Table className={makeStyles.Table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan="3">
                    Service Line1
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell rowSpan="3" component="th" scope="row">
                    Skills
                  </TableCell>
                  <TableCell>Technical skill</TableCell>
                  <TableCell>
                    <input
                      type="text"
                      value={this.state.technicalSkill}
                      onChange={(e) =>
                        this.setState({ technicalSkill: e.target.value })
                      }
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Functional skill</TableCell>
                  <TableCell>
                    <input
                      type="text"
                      value={this.state.functionalSkill}
                      onChange={(e) =>
                        this.setState({ functionalSkill: e.target.value })
                      }
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Process skill</TableCell>
                  <TableCell>
                    <input
                      type="text"
                      value={this.state.processSkill}
                      onChange={(e) =>
                        this.setState({ processSkill: e.target.value })
                      }
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">Location</TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <input
                      type="text"
                      value={this.state.empLocation}
                      onChange={(e) =>
                        this.setState({ empLocation: e.target.value })
                      }
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">Experiance</TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <input
                      type="text"
                      value={this.state.experiance}
                      onChange={(e) =>
                        this.setState({ experiance: e.target.value })
                      }
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">Rank</TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <input
                      type="text"
                      value={this.state.rank}
                      onChange={(e) => this.setState({ rank: e.target.value })}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">Bench Ageing</TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <input
                      type="text"
                      value={this.state.benchAgeingbenchAgeing}
                      onChange={(e) =>
                        this.setState({ benchAgeing: e.target.value })
                      }
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          </div>
          <div>
            <button type="submit" id="btnSubmit">
              Submit
            </button>
          </div>
        </form>
      
    );
  }
}
export default MatchCriteria;
