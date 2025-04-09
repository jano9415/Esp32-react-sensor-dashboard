import axios from "axios";

const API_URL = "http://192.168.0.37:8080/";

//Adat lekérése
const getData = () => {
    return axios.get(API_URL + "temperature");
}

const turnLed = () => {
    return axios.get(API_URL + "turnled");
}

const DataService = {
    getData,
    turnLed

};

export default DataService;