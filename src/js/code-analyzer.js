import * as esprima from 'esprima';

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse ,{loc:true} );
};

function extract(element) {
    const typesHandlersMap = {Program: extractProgramHandler, FunctionDeclaration: extractFunctionDeclarationHandler,
        Identifier: extractIdentifierHandler, BlockStatement: extractBlockStatementHandler,
        ReturnStatement: extractReturnStatementHandler, BinaryExpression: extractBinaryExpressionHandler,
        Literal: extractLiteralHandler, IfStatement: extractIfStatementHandler,
        WhileStatement:extractWhileStatementHandler, ExpressionStatement: extractExpressionStatementHandler,
        VariableDeclaration: extractVariableDeclarationHandler, VariableDeclarator: extractVariableDeclaratorHandler,
        AssignmentExpression: extractAssignmentExpressionHandler, CallExpression: extractCallExpressionHandler,
        UnaryExpression: extractUnaryExpressionHandler, MemberExpression: extractMemberExpressionHandler};
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
    let condition = arrayOfOneMapToString(extract(ifStatement.test));
    let tuples = [{line : ifStatement.loc.start.line , type :'if statement' , name :'', condition:condition, value: ''}];
    tuples = tuples.concat(extract(ifStatement.consequent)); // ifStatement.consequent it's a map , not array
    tuples = tuples.concat(extract(ifStatement.alternate)); // ifStatement.alternate it's a map , not array
    return tuples;
}

function extractWhileStatementHandler(whileStatement) {
    let cond = arrayOfOneMapToString(extract(whileStatement.test));
    let tuples = [{line : whileStatement.loc.start.line , type :'while statement' , name :'', condition:cond, value: ''}];
    tuples = tuples.concat(extract(whileStatement.body)); // whileStatement.body it's a map , not array
    return tuples;
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
    return [{line : callExpression.loc.start.line , type :'call expression', name: '', condition: '', value: value}];
}

function extractUnaryExpressionHandler(unaryExpression) {
    let value = unaryExpression.operator + arrayOfOneMapToString(extract(unaryExpression.argument));
    return [{line : unaryExpression.loc.start.line , type :'unary expression', name: '', condition: '', value: value}];
}

function extractMemberExpressionHandler(memberExpression) {
    let value = arrayOfOneMapToString(extract(memberExpression.object)) + '[' + arrayOfOneMapToString(extract(memberExpression.property)) +']';
    return [{line : memberExpression.loc.start.line , type :'member expression', name: '', condition: '', value: value}];
}

function arrayOfOneMapToString(arrayOfOneMap) {
    const toStringHandlersMap = {identifier: identifierToString, literal: literalToString, 'unary expression': unaryExpressionToString,
        'member expression': memberExpressionToString};
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

function unaryExpressionToString(unaryExpression) {
    return unaryExpression.value;
}

function memberExpressionToString(memberExpression) {
    return memberExpression.value;

}

export {parseCode, extract};