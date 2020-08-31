import axios from 'axios';
export const  postapi = (URL,postData) =>
{
    //first API bulk upload and form -  response: ID

    //http://localhost:5000/factiva/updateAppData

    //second post API for status of process - response: boolean

    //third get API for fetch records - parameters: ID

    //4th API for profile details - parameters: 
    axios.post(URL,postData).then(response => console.log(response.data))
            .catch(error => {console.error('There was an error!', error)})
    

};