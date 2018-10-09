/**
 * Created by prentice on 2016/11/24.
 */
var __CurrRegion = "";
function dataConfig() {
    this.idens = "";
    this.flag = false;
    this.setIdens = setIdens;
    this.getIdens = getIdens;
    this.data = {};
    this.currRegion = "";
    this.setData = setData;
    this.getData = getData;
    this.setCurrRegion = setCurrRegion;
    this.getCurrRegion = getCurrRegion;
    this.currYear = "";
    this.setCurrYear = setCurrYear;
    this.getCurrYear = getCurrYear;
    this.matId = "";
    this.setMatId = setMatId;
    this.getMatId = getMatId;
}
function setIdens(idens) {
    this.idens = idens;
}

function getIdens() {
    return this.idens;
}

function getCurrYear() {
    return this.currYear;
}

function setCurrRegion(region) {
    this.currRegion = region;
}

function getCurrRegion() {
    return this.currRegion;
}
function setData(data) {
    this.data = data;
}

function getData() {
    return this.data;
}
function setCurrYear(year) {
    this.currYear = year;
}

function setMatId(matId) {
    this.matId = matId;
}

function getMatId() {
    return this.matId;
}