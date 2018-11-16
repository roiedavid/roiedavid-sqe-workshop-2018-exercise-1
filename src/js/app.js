import $ from 'jquery';
import {parseCode, extract} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        // let tuples = extract(parsedCode); // array of tuples in the table
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));

    });
});