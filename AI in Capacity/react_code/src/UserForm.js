import React, { Component } from "react";
import axios from "axios";
import "./UserForm.css";
//import { postapi } from "./Common";
import * as XLSX from "xlsx";
import InputTag from "./InputTag";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

class Userform extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uniqueID: "",
      requestor: "",
      requestor_service_line: "",
      requestor_subservice_line: "",
      requestor_smu: "",
      job_title: "",
      rank: "",
      no_of_resource_required: "",
      country: "",
      location: "",
      alternate_location: "",
      Technical_Skill: [],
      Business_Skill: [],
      Management_Skill: [],
      Process_Skill: [],
      Finance_Skill: [],
      Basic_Skill: [],
      Years_of_Experience: "",
      onsubmitclick: false,
      onsubmitdata: {},
      tags: [],
      skillHeading: [],
      Technical_Skill_Weightage: 0,
      Business_Skill_Weightage: 0,
      Management_Skill_Weightage: 0,
      Process_Skill_Weightage: 0,
      Finance_Skill_Weightage: 0,
      Basic_Skill_Weightage: 0,
      Rank_Weightage: 0,
      Bench_Ageing_Weightage: 0,
      Years_of_Experience_Weightage: 0,
      Location_Weightage: 0,
      skill: "Select Skill",
      NewpageId: "userForm",
      WiightageTotal:0
      
    };
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.parentPageId !== this.props.parentPageId) {
      let Skillsheadings = [];
      if (
        this.state.Technical_Skill.length !== 0 &&
        this.state.Technical_Skill !== undefined
      ) {
        Skillsheadings = [...Skillsheadings, "Technology Skills"];
      }
      if (
        this.state.Business_Skill.length !== 0 &&
        this.state.Business_Skill !== undefined
      ) {
        Skillsheadings = [...Skillsheadings, "Business Analysis Skills"];
      }
      if (
        this.state.Management_Skill.length !== 0 &&
        this.state.Management_Skill !== undefined
      ) {
        Skillsheadings = [...Skillsheadings, "Management Skills"];
      }
      if (
        this.state.Process_Skill.length !== 0 &&
        this.state.Process_Skill !== undefined
      ) {
        Skillsheadings = [...Skillsheadings, "Process Skills"];
      }
      if (
        this.state.Finance_Skill.length !== 0 &&
        this.state.Finance_Skill !== undefined
      ) {
        Skillsheadings = [...Skillsheadings, "Finance Skills"];
      }
      if (
        this.state.Basic_Skill.length !== 0 &&
        this.state.Basic_Skill !== undefined
      ) {
        Skillsheadings = [...Skillsheadings, "Basic Skills"];
      }


      // if(this.state.requestor!=="" && (this.state.Technical_Skill!==""||this.state.Business_Skill!==""||this.state.Management_Skill!==""||this.state.Process_Skill!=="" ||this.state.Finance_Skill!==""||this.state.Basic_Skill!=="")){
      //   alert("Please select at least one skill")
      // }
      this.setState({
        NewpageId: this.props.parentPageId,
        skillHeading: Skillsheadings,
      });

      

    }
  };

  CheckWeigtageTotal=()=>{
    let A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0;
    A= this.state.Technical_Skill_Weightage;
    B= this.state.Business_Skill_Weightage;
    C= this.state.Management_Skill_Weightage;
    D= this.state.Process_Skill_Weightage;
    E= this.state.Finance_Skill_Weightage;
    F= this.state.Basic_Skill_Weightage;
    G= this.state.Rank_Weightage;
    H= this.state.Bench_Ageing_Weightage;
    I= this.state.Location_Weightage;
    J= this.state.Years_of_Experience_Weightage;

    let sum = (+A) + (+B) +(+C) + (+D) +(+E) + (+F) +(+G) + (+H) +(+I) + (+J);
   //alert(sum)
   //alert(`A${A},B${A},C${C},D${D},E${E},F${F},G${G},H${H},I${I},J${J}`)
    if (sum !== 100){
      alert('Sum of all fields Weightage should be 100')
      return
    }

  }
  
  intervalCheck = (id) =>{
    let myInterval = setInterval(() => {
      axios
  .post('http://localhost:5000/factiva/giveStatus', {uniqueid:this.state.uniqueID.toString()})
  .then((response) => {
    console.log(response.data[0].Status)
        
          if (response.data[0].Status === 'C') {
            setTimeout(() => {
              this.props.getUniqueID(id);
            }, 5000);
            clearInterval(myInterval);
          } else {
            console.log(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }, 5000);

    // setInterval(() => {
    //   this.ProgressChecking
    // }, 5000)
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.CheckWeigtageTotal();
    const userPostData = {
      requestor: this.state.requestor,
      requestor_service_line: this.state.requestor_service_line,
      requestor_subservice_line: this.state.requestor_subservice_line,
      requestor_smu: this.state.requestor_smu,
      job_title: this.state.job_title,
      rank: this.state.rank,
      no_of_resource_required: this.state.no_of_resource_required,
      country: this.state.country,
      location: this.state.location,
      alternate_location: this.state.alternate_location,
      Technical_Skill: this.state.Technical_Skill,
      Business_Skill: this.state.Business_Skill,
      Management_Skill: this.state.Management_Skill,
      Process_Skill: this.state.Process_Skill,
      Finance_Skill: this.state.Finance_Skill,
      Basic_Skill: this.state.Basic_Skill,
      Years_of_Experience: this.state.Years_of_Experience,
      Technical_Skill_Weightage: this.state.Technical_Skill_Weightage,
      Business_Skill_Weightage: this.state.Business_Skill_Weightage,
      Management_Skill_Weightage: this.state.Management_Skill_Weightage,
      Process_Skill_Weightage: this.state.Process_Skill_Weightage,
      Finance_Skill_Weightage: this.state.Finance_Skill_Weightage,
      Basic_Skill_Weightage: this.state.Basic_Skill_Weightage,
      Rank_Weightage: this.state.Rank_Weightage,
      Bench_Ageing_Weightage: this.state.Bench_Ageing_Weightage,
      Location_Weightage: this.state.Location_Weightage,
      Years_of_Experience_Weightage: this.state.Years_of_Experience_Weightage,
    };
       



    // this.setState({
    //   onsubmitclick: true,
    //   onsubmitdata: userPostData,
    // });

    const URL = "http://localhost:5000/factiva/updateAppData";

    //Post API Call  .then(setInterval(() => this.ProgressChecking, 5000))
    // postapi(URL, userPostData);
    axios
      .post(URL, userPostData)
      .then((response) => {
      console.log(response.data.message.insertedIds[0])
      this.setState({ uniqueID: response.data.message.insertedIds[0]},
        ()=>this.intervalCheck(response.data.message.insertedIds[0]))})

      .catch((error) => {
        console.error("There was an error!", error)});
       
    //document.getElementById("btnSubmit").style.display = "none";
    
  };

  
  updateUniqueID=()=>{
    if (this.state.uniqueID !== "") {
      this.props.getUniqueID(this.state.uniqueID);
    }

  }

  

  ProgressChecking=()=>{
    axios
    .post('http://localhost:5000/factiva/giveStatus', this.state.uniqueID)
    .then((response) => {
      console.log(response.data.Status)
      if(response.data.Status === "C") {
         this.updateUniqueID()
        clearInterval()
      } 
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });
  }

  

  upload = (e) => {
    e.preventDefault();
    let rowObject='';
    let files = e.target.files,
      f = files[0];
    let reader = new FileReader();
    reader.onload = function (e) {
      var data = e.target.result;
      let readedData = XLSX.read(data, { type: "binary" });
      //const wsname = readedData.SheetNames[0];
      //const ws = readedData.Sheets[wsname];
      /* Convert array to json*/
       readedData.SheetNames.forEach(sheet => 
         rowObject = XLSX.utils.sheet_to_json(readedData.Sheets.Sheet1, {header:1}));
     const dataParse = JSON.stringify(rowObject);
     axios
      .post('http://localhost:5000/factiva/updateAppData', dataParse)
      .then((response) => this.setState({ uniqueID: response.data.message.insertedIds[0] }))
      .then(setInterval(() => this.ProgressCheckin(), 5000)
      )
      .catch((error) => {
        console.error("There was an error!", error);
      });
    //   console.log(dataParse)
    //   postapi("http://localhost:5000/factiva/updateAppData", dataParse)
    //   .then((response) =>
    //   this.setState({ uniqueID: response.data.message.insertedIds[0] })
    // )
    // .catch((error) => {
    //   console.error("There was an error!", error);
    // });
      // console.log(dataParse);
      //alert(`data read sucessfully`);
    };
    reader.readAsBinaryString(f);
  };

  skillHandler = (e) => {
    const value = e.target.value;
    this.setState({ skill: value });
    if (value === "Technology") {
      document.getElementById("Technology").style.display = "block";
    } else if (value === "BusinessAnalysis") {
      document.getElementById("BusinessAnalysis").style.display = "block";
    } else if (value === "Management") {
      document.getElementById("Management").style.display = "block";
    } else if (value === "Process") {
      document.getElementById("Process").style.display = "block";
    } else if (value === "Finance") {
      document.getElementById("Finance").style.display = "block";
    } else if (value === "Basic") {
      document.getElementById("Basic").style.display = "block";
    } else {
      alert("please select one of skill area");
    }
  };

  updateSelectedValueToState = (tagValue, tagID) => {
    let TechnicalTags = [],
      BusinessTags = [],
      ManagementTags = [],
      ProcessTags = [],
      FinanceTags = [],
      BasicTags = [];
    if (tagID === "Technology") {
      tagValue.map((tag) => (TechnicalTags = [...TechnicalTags, tag.name]));
      this.setState({ Technical_Skill: TechnicalTags });
    } else if (tagID === "BusinessAnalysis") {
      tagValue.map((tag) => (BusinessTags = [...BusinessTags, tag.name]));
      this.setState({ Business_Skill: BusinessTags });
    } else if (tagID === "Management") {
      tagValue.map((tag) => (ManagementTags = [...ManagementTags, tag.name]));
      this.setState({ Management_Skill: ManagementTags });
    } else if (tagID === "Process") {
      tagValue.map((tag) => (ProcessTags = [...ProcessTags, tag.name]));
      this.setState({ Process_Skill: ProcessTags });
    } else if (tagID === "Finance") {
      tagValue.map((tag) => (FinanceTags = [...FinanceTags, tag.name]));
      this.setState({ Finance_Skill: FinanceTags });
    } else if (tagID === "Basic") {
      tagValue.map((tag) => (BasicTags = [...BasicTags, tag.name]));
      this.setState({ Basic_Skill: BasicTags });
    } else {
    }
  };
  handleSkillInput = (event, skillvalue) => {
    if (skillvalue === "Technology Skills") {
      this.setState({ Technical_Skill_Weightage: event.target.value });
    } else if (skillvalue === "Business Analysis Skills") {
      this.setState({ Business_Skill_Weightage: event.target.value });
    } else if (skillvalue === "Management Skills") {
      this.setState({ Management_Skill_Weightage: event.target.value });
    } else if (skillvalue === "Process Skills") {
      this.setState({ Process_Skill_Weightage: event.target.value });
    } else if (skillvalue === "Finance Skills") {
      this.setState({ Finance_Skill_Weightage: event.target.value });
    } else if (skillvalue === "Basic Skills") {
      this.setState({ Basic_Skill_Weightage: event.target.value });
    } else {
    }
  };

  // download = (e) => {
  //   e.preventDefault();
  //   alert("downloading file");
  // };

  render() {
    return (
      <div className="form-outer">
        <form className="themeform" onSubmit={this.handleSubmit}>
          {this.state.NewpageId === "userForm" ? (
            <>
              <div className="full-length">
                <label>Bulk Upload:</label>
                <input
                  type="file"
                  id="input"
                  accept=".xls,.xlsx"
                  onChange={this.upload}
                />
                
                <p className="or">
                  <span>OR</span>
                </p>
              </div>
              <div>
                <label>Requestor:</label>
                <input
                  type="text"
                  value={this.state.requestor}
                  onChange={(e) => this.setState({ requestor: e.target.value })}
                />
              </div>
              <div>
                <label>Requestor Service Line:</label>
                <select
                  value={this.state.requestor_service_line}
                  onChange={(e) =>
                    this.setState({ requestor_service_line: e.target.value })
                  }
                >
                  <option value="">Select Service Line</option>
                  <option>Service Line 1</option>
                  <option>Service Line 2</option>
                  <option>Service Line 3</option>
                </select>
              </div>
              <div>
                <label>Requestor Sub-Service Line:</label>
                <select
                  value={this.state.requestor_subservice_line}
                  onChange={(e) =>
                    this.setState({ requestor_subservice_line: e.target.value })
                  }
                >
                  <option value="">Select Sub-Service Line</option>
                  <option>Sub-Service Line 1</option>
                  <option>Sub-Service Line 2</option>
                  <option>Sub-Service Line 3</option>
                </select>
              </div>
              <div>
                <label>Requestor SMU:</label>
                <select
                  value={this.state.requestor_smu}
                  onChange={(e) =>
                    this.setState({ requestor_smu: e.target.value })
                  }
                >
                  <option value="">Select SMU</option>
                  <option>SMU 1</option>
                  <option>SMU 2</option>
                  <option>SMU 3</option>
                </select>
              </div>
              <div>
                <label>Job Title:</label>
                <input
                  type="text"
                  value={this.state.job_title}
                  onChange={(e) => this.setState({ job_title: e.target.value })}
                />
              </div>
              <div>
                <label>Rank:</label>
                <select
                  onChange={(e) => this.setState({ rank: e.target.value })}
                >
                  <option value="">Select Rank</option>
                  <option>Rank 1</option>
                  <option>Rank 2</option>
                  <option>Rank 3</option>
                </select>
              </div>
              <div>
                <label>No of Resource Required:</label>
                <input
                  type="text"
                  value={this.state.no_of_resource_required}
                  onChange={(e) =>
                    this.setState({ no_of_resource_required: e.target.value })
                  }
                />
              </div>
              <div>
                <label>Min Experiance:</label>
                <input
                  type="text"
                  value={this.state.Years_of_Experience}
                  onChange={(e) =>
                    this.setState({ Years_of_Experience: e.target.value })
                  }
                />
              </div>
              <div className="full-length">
                <div>
                  <label>Country:</label>
                  <select
                    onChange={(e) => this.setState({ country: e.target.value })}
                  >
                    <option value="">Select Country</option>
                    <option>Country 1</option>
                    <option>Country 2</option>
                  </select>
                </div>
                <div>
                  <label>Location</label>
                  <select
                    value={this.state.location}
                    onChange={(e) =>
                      this.setState({ location: e.target.value })
                    }
                  >
                    <option value="">Select Location</option>
                    <option>Location 2</option>
                    <option>Location 3</option>
                  </select>
                </div>
                <div>
                  <label>Alternate Location</label>
                  <input
                    type="text"
                    placeholder="Alternate location"
                    value={this.state.alternate_location}
                    onChange={(e) =>
                      this.setState({ alternate_location: e.target.value })
                    }
                  />
                </div>
              </div>
              <div style={{ display: "block" }}>
                <label>Select Skill Area:</label>
                <select onChange={this.skillHandler}>
                  <option value="">Skill Area</option>
                  <option>Technology</option>
                  <option>BusinessAnalysis</option>
                  <option>Management</option>
                  <option>Process</option>
                  <option>Finance</option>
                  <option>Basic</option>
                </select>
              </div>
              <div id="Technology" className="show-skill">
                <label>Technology :</label>
                {this.state.skill === "" ? (
                  <div></div>
                ) : (
                  <InputTag
                    onSelectedValue={this.updateSelectedValueToState}
                    tagID={this.state.skill}
                  />
                )}
              </div>
              <div id="BusinessAnalysis" className="show-skill">
                <label>Business Analysis :</label>
                {this.state.skill === "" ? (
                  <div></div>
                ) : (
                  <InputTag
                    onSelectedValue={this.updateSelectedValueToState}
                    tagID={this.state.skill}
                  />
                )}
              </div>
              <div id="Management" className="show-skill">
                <label>Management Skills:</label>
                {this.state.skill === "" ? (
                  <div></div>
                ) : (
                  <InputTag
                    onSelectedValue={this.updateSelectedValueToState}
                    tagID={this.state.skill}
                  />
                )}
              </div>
              <div id="Process" className="show-skill">
                <label>Process Skills:</label>
                {this.state.skill === "" ? (
                  <div></div>
                ) : (
                  <InputTag
                    onSelectedValue={this.updateSelectedValueToState}
                    tagID={this.state.skill}
                  />
                )}
              </div>
              <div id="Finance" className="show-skill">
                <label>Finance :</label>
                {this.state.skill === "" ? (
                  <div></div>
                ) : (
                  <InputTag
                    onSelectedValue={this.updateSelectedValueToState}
                    tagID={this.state.skill}
                  />
                )}
              </div>
              <div id="Basic" className="show-skill">
                <label>Basic:</label>
                {this.state.skill === "" ? (
                  <div></div>
                ) : (
                  <InputTag
                    onSelectedValue={this.updateSelectedValueToState}
                    tagID={this.state.skill}
                  />
                )}
              </div>
            </>
          ) : (
            <div id="matchCriteria" className="table-outer serviceform">
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
                      <TableCell component="th" scope="row">
                        Skills
                      </TableCell>
                      <TableCell colSpan="2" class="no-space">
                        <Table>
                          {this.state.skillHeading.map((skillheadingValue) => (
                            <TableRow>
                              <TableCell>{skillheadingValue}</TableCell>
                              <TableCell>
                                <input
                                  type="text"
                                  onChange={(e) =>
                                    this.handleSkillInput(e, skillheadingValue)
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </Table>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">Location</TableCell>
                      <TableCell>
                        <input
                          type="text"
                          value={this.state.Location_Weightage}
                          onChange={(e) =>
                            this.setState({
                              Location_Weightage: e.target.value,
                            })
                          }
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">Rank</TableCell>
                      <TableCell>
                        <input
                          type="text"
                          value={this.state.Rank_Weightage}
                          onChange={(e) =>
                            this.setState({ Rank_Weightage: e.target.value })
                          }
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">Years of Experience</TableCell>
                      <TableCell>
                        <input
                          type="text"
                          value={this.state.Years_of_Experience_Weightage}
                          onChange={(e) =>
                            this.setState({
                              Years_of_Experience_Weightage: e.target.value,
                            })
                          }
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">Bench Ageing</TableCell>
                      <TableCell>
                        <input
                          type="text"
                          value={this.state.Bench_Ageing_Weightage}
                          onChange={(e) =>
                            this.setState({
                              Bench_Ageing_Weightage: e.target.value,
                            })
                          }
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <button type="submit" id="btnSubmit">
                Submit
              </button>
            </div>
          )}
        </form>
      </div>
    );
  }
}
export default Userform;
