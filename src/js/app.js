import $ from 'jquery';
import {parseCode, extract} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        clearTable();
        showTable(extract(parsedCode));
    });
});

function showTable(tuplesArray) {
    let body = document.getElementsByTagName('body')[0] , table = document.createElement('table'), tableBody = document.createElement('table_body'),
        caption = document.createElement('caption');
    table.style.width = '50%';
    table.setAttribute('border', '20');
    table.setAttribute('id', 'resultTable');
    caption.appendChild(document.createTextNode('Result'));
    caption.setAttribute('style', 'font:arial; font-size:200% ; font-weight: bold;');
    tableBody.setAttribute('style', 'font-family: arial; font-size:130%;');
    tableBody.appendChild(initTitles());
    for (let i = 0; i < tuplesArray.length; i++)
        tableBody.appendChild(addTuple(tuplesArray[i]));
    table.appendChild(caption);
    table.appendChild(tableBody);
    body.appendChild(table);
}

function initTitles() {
    let tr = document.createElement('tr');
    let th1 = document.createElement('th'), th2 = document.createElement('th'), th3 = document.createElement('th'), th4 = document.createElement('th'),
        th5 = document.createElement('th');

    th1.appendChild(document.createTextNode('line'));
    th2.appendChild(document.createTextNode('type'));
    th3.appendChild(document.createTextNode('name'));
    th4.appendChild(document.createTextNode('condition'));
    th5.appendChild(document.createTextNode('value'));

    appendChildren(tr,[th1,th2,th3,th4,th5]);
    th1.setAttribute('style', 'padding: 8px;');
    return tr;
}

function addTuple(tuple){
    let tr = document.createElement('tr'), td1 = document.createElement('td'), td2 = document.createElement('td'), td3 = document.createElement('td'),
        td4 = document.createElement('td'), td5 = document.createElement('td');

    td1.appendChild(document.createTextNode(tuple.line));
    td2.appendChild(document.createTextNode(tuple.type));
    td3.appendChild(document.createTextNode(tuple.name));
    td4.appendChild(document.createTextNode(tuple.condition));
    td5.appendChild(document.createTextNode(tuple.value));

    setAttributes([td1,td2,td3,td4,td5],'style','padding:0 50px 0 5 0px;');
    appendChildren(tr,[td1,td2,td3,td4,td5]);
    return tr;
}

function appendChildren(father,childrenArray) {
    for (let i = 0 ; i < childrenArray.length ; i++)
        father.appendChild(childrenArray[i]);
}

function setAttributes(arr,qualifiedName,value) {
    for (let i = 0 ; i < arr.length ; i++)
        arr[i].setAttribute(qualifiedName,value);
}

function clearTable() {
    let table = document.getElementById('resultTable');
    if(table!==null)
        table.remove();
}