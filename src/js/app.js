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
    const typesHandlersMap = {Program: extractProgramHandler, FunctionDeclaration: extractFunctionDeclarationHandler,
        Identifier: extractIdentifierHandler, BlockStatement: extractBlockStatementHandler,
        ReturnStatement: extractReturnStatementHandler, BinaryExpression: extractBinaryExpressionHandler,
        Literal: extractLiteralHandler, IfStatement: extractIfStatementHandler,
        WhileStatement:extractWhileStatementHandler, ExpressionStatement: extractExpressionStatementHandler,
        VariableDeclaration: extractVariableDeclarationHandler, VariableDeclarator: extractVariableDeclaratorHandler,
        AssignmentExpression: extractAssignmentExpressionHandler, CallExpression: extractCallExpressionHandler};
    let func = typesHandlersMap[element.type];
    return func ? func(element) : null;
}

function extractProgramHandler(program) {
    let tuples = []; //array of maps. every element is map of (Line Type Name(optional) Condition(optional) Value(optional))
    let body = program.body;
    for (let i = 0 ; i < body.length; i++)
        tuples = tuples.concat(extract(body[i]));
    return tuples;
}

function extractFunctionDeclarationHandler(functionDeclaration) {
    let tuples = [{line : functionDeclaration.loc.start.line , type :'function declaration' , name :functionDeclaration.id.name, condition:'', value: ''}];
    let params = functionDeclaration.params;
    for (let i = 0 ; i< params.length; i++) {
        let nextParam = extract(params[i]); //expecting array of one element (a map)
        if (nextParam[0].type) // not null or undefined or [] or false...
            nextParam[0].type = 'variable declaration';
        else
            continue;
        tuples = tuples.concat(nextParam);
    }
    tuples = tuples.concat(extract(functionDeclaration.body)); // functionDeclaration.body it's a map , not array
    return tuples;
}

function extractIdentifierHandler(identifier) {
    return [{line : identifier.loc.start.line , type :'identifier' , name :identifier.name, condition:'', value: ''}];
}

function extractBlockStatementHandler(blockStatement) {
    let tuples = [];
    let body = blockStatement.body;
    for (let i = 0 ; i<body.length; i++)
        tuples = tuples.concat(extract(body[i]));
    return tuples;
}

function extractReturnStatementHandler(returnStatement) {
    let value = arrayOfOneMapToString(extract(returnStatement.argument));
    return [{line : returnStatement.loc.start.line , type :'return statement' , name :'', condition:'', value: value}];
}

function extractBinaryExpressionHandler(binaryExpression) {
    return arrayOfOneMapToString(extract(binaryExpression.left)) + '' + binaryExpression.operator + '' + arrayOfOneMapToString(extract(binaryExpression.right));
}

function extractLiteralHandler(literal) {
    return [{line : literal.loc.start.line , type :'literal' , name :'', condition:'', value: literal.value}];
}

function extractIfStatementHandler(ifStatement) {
    console.log(`in extractIfStatementHandler add support for then and alt tuples`);
    let cond = arrayOfOneMapToString(extract(ifStatement.test));
    return [{line : ifStatement.loc.start.line , type :'if statement' , name :'', condition:cond, value: ''}];
}

function extractWhileStatementHandler(whileStatement) {
    let cond = '';
    return [{line : whileStatement.loc.start.line , type :'while statement' , name :'', condition:cond, value: ''}];
}

function extractExpressionStatementHandler(expressionStatement) {
    return extract(expressionStatement.expression);
}

function extractVariableDeclarationHandler(variableDeclaration) {
    let tuples = [];
    let declarations = variableDeclaration.declarations;
    for (let i = 0 ; i<declarations.length; i++)
        tuples = tuples.concat(extract(declarations[i]));
    return tuples;
}
function extractVariableDeclaratorHandler(variableDeclarator) {
    let name = arrayOfOneMapToString(extract(variableDeclarator.id));
    let value = variableDeclarator.init ?  extract(variableDeclarator.init): null;
    return [{line : variableDeclarator.loc.start.line , type :'variable declaration', name: name, condition: '', value:value}];
}

function extractAssignmentExpressionHandler(assignmentExpression) {
    let name =  assignmentExpression.left.name ;
    let value = arrayOfOneMapToString(extract(assignmentExpression.right));
    return [{line : assignmentExpression.loc.start.line , type :'assignment expression', name: name, condition: '', value: value}];
}

function extractCallExpressionHandler(callExpression) {
    let value = '';
    return [{line : callExpression.loc.start.line , type :'call expression', name: name, condition: '', value: value}];
}

function arrayOfOneMapToString(arrayOfOneMap) {
    const toStringHandlersMap = {identifier: identifierToString, literal: literalToString};
    if (arrayOfOneMap && arrayOfOneMap.length > 0 && toStringHandlersMap[arrayOfOneMap[0].type]!==undefined)
        return toStringHandlersMap[arrayOfOneMap[0].type](arrayOfOneMap[0]);
    return arrayOfOneMap;
}

function identifierToString(identifier) {
    return identifier.name;
}

function literalToString(literal) {
    return literal.value;
}