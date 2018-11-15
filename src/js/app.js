import $ from 'jquery';
import {parseCode} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let tuples = extract(parsedCode); // array of tuples in the table
        for (let i = 0 ; i<tuples.length; i++)
            console.log(JSON.stringify(tuples[i]));
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
});

function extract(element) {
    let types_map = {Program: extractProgramHandler, FunctionDeclaration: extractFunctionDeclarationHandler,
        Identifier: extractIdentifierHandler, BlockStatement: extractBlockStatementHandler,
        ReturnStatement: extractReturnStatementHandler, BinaryExpression: extractBinaryExpressionHandler,
        Literal: extractLiteralHandler, IfStatement: extractIfStatementHandler,
        WhileStatement:extractWhileStatementHandler, ExpressionStatement: extractExpressionStatementHandler,
        VariableDeclaration: extractVariableDeclarationHandler, VariableDeclarator: extractVariableDeclaratorHandler};
    let func = types_map[element.type];
    return func ? func(element) : null;
}

function extractProgramHandler(program) {
    let tuples = []; //array of maps. every element is map of (Line Type Name(optional) Condition(optional) Value(optional))
    let body = program.body;
    for (let i = 0 ; i < body.length; i++)
        tuples = tuples.concat(extract(body[i]));
    return tuples;
}

function extractFunctionDeclarationHandler(fun) {
    let tuples = [{line : fun.loc.start.line , type :'function declaration' , name :fun.id.name, condition:'', value: ''}];
    let params = fun.params;
    for (let i = 0 ; i<params.length; i++)
        tuples = tuples.concat(extract(params[i]));
    tuples = tuples.concat(extract(fun.body));// fun.body it's a map , not array
    return tuples;
}

function extractIdentifierHandler(identifier) {
    return [{line : identifier.loc.start.line , type :'Identifier' , name :identifier.name, condition:'', value: ''}];
}

function extractBlockStatementHandler(blockStatement) {
    let tuples = [];
    let body = blockStatement.body;
    for (let i = 0 ; i<body.length; i++)
        tuples = tuples.concat(extract(body[i]));
    return tuples;
}

function extractReturnStatementHandler(returnStatement) {
    return [{line : returnStatement.loc.start.line , type :'return statement' , name :'', condition:'', value: ''}];
}

function extractBinaryExpressionHandler(binaryExpression) {
    return [];
}

function extractLiteralHandler(literal) {
    return [{line : literal.loc.start.line , type :'Literal' , name :'', condition:'', value: literal.value}];
}

function extractIfStatementHandler(ifStatement) {
    let cond = '';
    return [{line : ifStatement.loc.start.line , type :'if statement' , name :'', condition:cond, value: ''}];
}

function extractWhileStatementHandler(whileStatement) {
    let cond = '';
    return [{line : whileStatement.loc.start.line , type :'while statement' , name :'', condition:cond, value: ''}];
}

function extractExpressionStatementHandler(expressionStatement) {
    return [{line : expressionStatement.loc.start.line , type :'expression statement' , name :'', condition:'', value: ''}];
}

function extractVariableDeclarationHandler(variableDeclaration) {
    return [{line : variableDeclaration.loc.start.line , type :'expression statement' , name :'', condition:'', value: ''}];
}
function extractVariableDeclaratorHandler(variableDeclarator) {
    return [{line : variableDeclarator.loc.start.line , type :'expression statement' , name :'', condition:'', value: ''}];
}