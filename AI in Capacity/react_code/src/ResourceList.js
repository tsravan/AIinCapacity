import React, { Component } from "react";
import axios from "axios";
import "./UserForm.css";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import EmployeeDetail from "./EmployeeDetail";
// import Accordion from "@material-ui/core/Accordion";
// import AccordionSummary from "@material-ui/core/AccordionSummary";
// import AccordionDetails from "@material-ui/core/AccordionDetails";
// import Typography from "@material-ui/core/Typography";
// import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

class ResourceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      ResponseNameID:"",
      ResponseRequestID:"",
      data: {},
    };
  }

  componentDidMount() {
    let sendData ={
      
      //uniqueid:this.props.ResponseUniqueID
      //uniqueid:"5f4b9b16abecd46408514bb1"
      uniqueid:this.props.ResponseUniqueID
    }
    axios
      .post(`http://localhost:5000/factiva/fitmentResults`,sendData)
      .then((response) => {
        this.setState({ data: response.data });
      });
  }

  handleClick = (nameID,RequestID) => {
    this.setState({
      visible: true,
      ResponseNameID:nameID,
      ResponseRequestID:RequestID
     });
  };

  

  render() {
    let stateData = this.state.data;
    //   let res =this.state.data[0]
    //  var requestKeys = Object.keys(res);
    // console.log(requestKeys);
    //let stateData = this.state.data
    //Object.keys(stateData).map((keyName, i) => console.log(keyName) )
    //console.log(this.state.data);
    //console.log(stateData);
    //console.log(Object.keys(this.state.data))

    // {Object.keys(subjects).map((keyName, i) =>
    //    (<li className="travelcompany-input" key={i}>
    //      <span className="input-label">key: {i} Name: {subjects[keyName]}</span></li>))}
    return (this.state.visible) ? (
      <EmployeeDetail nameID={this.state.ResponseNameID} Uid={this.props.ResponseUniqueID} />
    ) : (
      <>
        {Object.keys(stateData).map((keyName, i) => (
          <div className="table-outer">
            <TableContainer component={Paper}>
              <Table className={makeStyles.Table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" colSpan="4">
                      {keyName}
                    </TableCell>
                    </TableRow>
                    </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Resources
                    </TableCell>
                    <TableCell component="th">Rank</TableCell>
                    <TableCell component="th" colspan='2'>fitment</TableCell>
                  </TableRow>
                  {stateData[keyName].map((item) => (
                    <TableRow key={item.Request}>
                      <TableCell onClick={e => this.handleClick(item.Name_ID,item.Request)}>
                        {item.Name_ID}
                      </TableCell>
                      <TableCell>{item.Rank_y}</TableCell>
                      <TableCell>{item.fitment}</TableCell>
                      <TableCell onClick={e => this.handleClick(item.Name_ID,item.Request)}><em><u>View detail</u></em></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ))}
      </>
    );
  }
}

export default ResourceList;
