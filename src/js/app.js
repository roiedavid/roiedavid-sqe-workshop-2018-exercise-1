import $ from 'jquery';
import {parseCode} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let tuples = extract(parsedCode); // array of tuples (tuple is map of row in the table)
        console.log(tuples);
        console.log('done');
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
});

function extract(element) {
    switch (element.type) {
    case 'Program':
        console.log('program case');
        extractProgram(element);
        break;
    // case 'FunctionDeclaration':
    //     extractFunctionDeclaration(element);
    //     break;
    }
}

function extractProgram(program) {
    console.log('in extractProgram');
    let tuples = []; //array maps. every element is map of (Line Type Name(optional) Condition(optional) Value(optional))
    let body = program.body;
    for (let i = 0 ; i < body.length; i++) {
        tuples.concat(extract(body[i]));
        console.log(`I is ${i}`);
    }
    return tuples;
}

// function extractFunctionDeclaration(functionDeclaration) {
//
// }

