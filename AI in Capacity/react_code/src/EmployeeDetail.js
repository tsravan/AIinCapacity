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
import Rating from "@material-ui/lab/Rating";
import Modal from "react-awesome-modal";
//import { keys } from "@material-ui/core/styles/createBreakpoints";

class EmployeeDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      open: false,
      employeeData_collection: {},
      employeeEngagements_collection: {},
      fitmentResults_collection: {},
      data: {},
    };
  }

  componentDidMount = () => {
    let sendData ={
      
      uniqueid:this.props.Uid,
      name_ID:this.props.nameID
  
  }
    axios
      .post('http://localhost:5000/factiva/apiCollectionFour',sendData)
      .then((response) => {
        this.setState({
          data: response.data,
          employeeData_collection: response.data.employeeData_collection,
          employeeEngagements_collection:
            response.data.employeeEngagements_collection,
          fitmentResults_collection: response.data.fitmentResults_collection,
        });
      });
  };

  handleClick = (e,reviewVal) => {
    this.setState({ visible: true,reviewValue:reviewVal });
  };

  handleClose = () => {
    this.setState({ visible: false });
  };

  render() {

    
   
    let EmployeeName ='',Rank=''
    let employeeData_collectionData = this.state.employeeData_collection;
    let employeeEngagements_collectionData = this.state.employeeEngagements_collection;
    let fitmentResults_collectionData = this.state.fitmentResults_collection;
    Object.keys(employeeData_collectionData).map(keyName=> EmployeeName = employeeData_collectionData[keyName][0].Name_ID)
    Object.keys(employeeData_collectionData).map(keyName=> Rank = employeeData_collectionData[keyName][0].Rank)  
    //console.log(fitmentResults_collectionData[0].Reviews)
    let fitmentKeyname=[]
    Object.keys(fitmentResults_collectionData).map((keyName, i) => fitmentKeyname = fitmentResults_collectionData[keyName].Reviews )
    

    return (
      <>
        <div className="table-outer">
          <TableContainer component={Paper}>
            <Table className={makeStyles} aria-label="simple table">
              <TableHead>
                <TableRow className={makeStyles.root}>
                  <TableCell align="center" colSpan="5">
                    Profile Details
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th">Employee Name :</TableCell>
                  <TableCell component="td" colspan="3">{EmployeeName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">Rank : </TableCell>
                  <TableCell component="td"colspan="3">{Rank}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th">Skill Set : </TableCell>
                  <TableCell colspan='3' className='no-space'>
                    <Table>
                    {Object.keys(employeeData_collectionData).map(
                    (keyName, i) => (
                      <TableRow>
                      <TableCell component="th">
                      {keyName} Rating
                      </TableCell>
                      
                             <TableCell className='no-space'>
                               <Table>
                                <TableRow>
                                  <TableCell component="th">Skill</TableCell>
                                  <TableCell component="th"> Rating</TableCell>
                                </TableRow>  
                                {employeeData_collectionData[keyName].map((item) => (
                                <TableRow>
                                  <TableCell component="td">{item.Skill}</TableCell>
                                
                                  <TableCell component="td">{item.Skill_Level}
                                  </TableCell>
                              
                                </TableRow>
                                 ))}
                               </Table>
                               
                               </TableCell>
                              
                              
                                
                                </TableRow>
                    )
                  )}
                    </Table>
            
                  </TableCell>
                </TableRow>
                
                  
                <TableRow>
                      <TableCell  component="th">
                        Engagement <br></br>Worked on :
                      </TableCell>  
                
                    <TableCell className='no-space'> 
                      <Table>
                      {Object.keys(employeeEngagements_collectionData).map(
                  (keyName, i) => (
                      <TableRow>
                      <TableCell component="th">
                              {employeeEngagements_collectionData[keyName].EngagementName}
                      </TableCell>
                      <TableCell>
                            {fitmentKeyname.map(item=> item.EngagementName === employeeEngagements_collectionData[keyName].EngagementName?
                              <Rating
                                max={3}
                                name="read-only"
                                size="small"
                                value={item.Rating}
                                readOnly
                              />
                              :"")}
                      </TableCell>
                      <TableCell>
                              <button onClick={(event) => this.handleClick(event,employeeEngagements_collectionData[keyName].Review)}>
                                Reviews
                              </button>
                              <Modal
                                className=""
                                visible={this.state.visible}
                                width="702px"
                                effect="fadeInUp"
                                color="#000"
                                onClickAway={this.handleClose}
                              >
                                <div className='model-color'>
                                <h2>Comments</h2>
                                <p>{this.state.reviewValue}</p>
                                </div>
                              </Modal>
                      </TableCell>
                    </TableRow>
                       
                  )
                  )}
                    </Table>
                    </TableCell>
                
                 </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </>
    );
  }
}

export default EmployeeDetail;
