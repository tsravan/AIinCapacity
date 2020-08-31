import React from "react";
import { Multiselect } from "multiselect-react-dropdown";
import "./UserForm.css";
class InputTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      skill: "",
      tags: [],
      options: [
        { name: "React", id: 1 },
        { name: ".net", id: 2 },
      ],
    };
  }
  componentWillReceiveProps=(nextProps)=>{
    
    this.updateAndNotify(nextProps);
  }
  // componentDidMount=()=>{
  //   alert('in component did mount');
  //   console.log(this.props.tagID)
  //   this.updateAndNotify();
  // }
 
  updateAndNotify = (nextProps) => {
    let optionsValues = [];
    if (nextProps.tagID === "Technology") {
      optionsValues = [
        { name: "Operations", id: 1 },
        { name: "SAP BO", id: 2 },
        { name: "Solution Design", id: 3 },
        { name: "Machine Learning", id: 4 },
        { name: "Methodologies", id: 5 },
        { name: "RPA", id: 6 },
        { name: "Angular", id: 7 },
        { name: "React", id: 8 },
        { name: "Java", id: 9 },
        { name: "Scripting", id: 10 },
        { name: "Solution Architecture", id: 11 },
        { name: "Data Architecture", id: 12 },
        { name: "Python", id: 13 },
        { name: "Data Visualisation", id: 14 },
        { name: "IT Governance", id: 15 },
        { name: "Power Shell", id: 16 },
        { name: "SDLC", id: 17 },
        { name: "Iterative", id: 18 },
        { name: "Power BI", id: 19 },
        { name: "Cloud", id: 20 },
        { name: "C#.net", id: 21 },
        { name: "SAP HANA", id: 21 },
        { name: "Deep Learning", id: 23 },
        { name: "Predictive Analytics", id: 24 },
        { name: "ITIL", id: 25 },
        { name: "Windows Servers", id: 26 },
        { name: "Agile", id: 27 },
        { name: "AWS", id: 28 },
        { name: "Azure", id: 29 },
        { name: "Execution", id: 30 },
        { name: "Cloud", id: 31 },
        { name: "Web development", id: 32 },
        { name: "Emerging Trends", id: 33 },
        { name: "Data Warehousing", id: 34 },
        { name: "Web Technologies", id: 35 },
        { name: "Service Delivery", id: 36 }, 
        { name: "Business Intelligence", id: 37 }, 
      ];
      this.setState({ options: optionsValues });
    } else if (nextProps.tagID === "BusinessAnalysis") {
      optionsValues = [
        { name: "Business process analysis", id: 1 },
        { name: "Problem Solving", id: 2 },
        { name: "Requirement Analysis", id: 3 }, 
        { name: "Critical Analysis", id: 4 }, 
      ];
      this.setState({ options: optionsValues });
    } else if (nextProps.tagID === "Management") {
      optionsValues = [
        { name: "Relationship Management", id: 1 },
        { name: "Programme Delivery", id: 2 },
        { name: "Programme Leadership", id: 3 },
        { name: "Change Strategy", id: 4 },
        { name: "Estimating", id: 5 },
        { name: "Stake Holder Management", id: 6 },
        { name: "Budget Preparation", id: 7 },
        { name: "Business Development", id: 8 },
        { name: "Budget Management", id: 9 },
        { name: "Business Transformation", id: 10 },
        { name: "Budget Analysis", id: 11 },
        { name: "Change Management", id: 12 },
      ];
      this.setState({ options: optionsValues });
    } else if (nextProps.tagID === "Process") {
      optionsValues = [
        { name: "Effective Communication", id: 1 },
        { name: "Analytics", id: 2 }, 
        { name: "Emerging Trends", id: 3 }, 
      ];
      this.setState({ options: optionsValues });
    } else if (nextProps.tagID === "Finance") {
      optionsValues = [
        { name: "Finance operational reporting", id: 1 },
        { name: "Advanced Excel", id: 2 },
        { name: "Management Reporting", id: 3 },
        { name: "Microsoft Office", id: 4 },
        { name: "Data Analysis", id: 5 },
        { name: "Cash Flow analysis", id: 6 },
        { name: "SQL", id: 7 },
        { name: "Accounting", id: 8 },
        { name: "Reporting", id: 9 },
        { name: "Enterprise Risk Analysis", id: 10 },
        { name: "Forecasting", id: 11 },
        { name: "Analysis", id: 12 },
        { name: "Operations", id: 13 },
        { name: "Assessment", id: 14 },
        { name: "Process", id: 15 },
      ];
      this.setState({ options: optionsValues });
    } else if (nextProps.tagID === "Basic") {
      optionsValues = [
        { name: "BaPresentation Skills", id: 1 },
        { name: "Effective Communication", id: 2 },
        { name: "Soft Skills", id: 3 },
      ];
      this.setState({ options: optionsValues });
    }else {
      optionsValues = [{}];
    }
  };

  onSelect = (selectedList, selectedItem) => {
    this.props.onSelectedValue(selectedList, this.props.tagID);
  };
  onRemove = (selectedList, removedItem) => {
    this.props.onSelectedValue(selectedList, this.props.tagID);
  }; //<input id="txtSkill" type="text" onKeyDown={this.inputKeyDown} ref={c => { this.tagInput = c; }} />
  render() {
    const { tags } = this.state;
    return (
      <div className="input-tag">
        <ul className="input-tag__tags">
          <li className="input-tag__tags__input">
            <Multiselect
              options={this.state.options} // Options to display in the dropdown
              selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
              onSelect={this.onSelect} // Function will trigger on select event
              onRemove={this.onRemove} // Function will trigger on remove event
              displayValue="name" // Property name to display in the dropdown options
            />
            </li>
          {tags.map((tag, i) => (
            <li key={tag}>
            <div className="tagsList">{tag}</div>
            <button type="button" onClick={() => {this.removeTag(i);}}>+</button>
            </li>
          ))}
          </ul>
              
      </div>
    );
  }
}
export default InputTag;
