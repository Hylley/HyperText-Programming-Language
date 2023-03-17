// ---------------------------------------------------------------------------------

globalVariables = {}
globalFunctions = {}

document.addEventListener('DOMContentLoaded', () => {
	const blocks = document.querySelectorAll('code');
	blocks.forEach(block => execute(block))
})

// ---------------------------------------------------------------------------------

function execute(block)
{
	Array.from(block.children).forEach(element => {
		instruction = element.tagName.toLowerCase();

		compile(instruction, element);
	})
}

// Direct compile instructions
function compile(instruction, element)
{
	switch(instruction)
	{
		case 'variable':
			implementVariable(element);

			break;
		
		case 'if':
			implementIf(element);

			break;

		case 'print':
			implementPrint(element);

			break;

		case 'function':
			// let arguments = {};
			// for (attribute in element.attributes)
			// {
			// 	const att = element.attributes[attribute];
				
			// 	if(!att.value || att.nodeName == 'name') continue;

			// 	arguments[att.nodeName] = att.ArraynodeValue;
			// }

			implementFunction(element)//, arguments);

			break;
	}
}

// ---------------------------------------------------------------------------------

function implementVariable(element)
{
	// Variable load
	if(!element.childNodes[0] & element.hasAttributes())
	{
		if(!element.attributes.name.nodeValue in globalVariables)
		{
			throw new Error(`Variable ${element.attributes.name.nodeValue} does not exists.`);
		}

		return globalVariables[element.attributes.name.nodeValue];
	}

	if(!element.hasAttributes() & !element.childNodes[0]) throw new Error('Cannot asign an empty value at ' + `${element.tagName}`);

	// Variable definition
	let value = undefined;

	if('type' in element.attributes)
	{
		switch(element.attributes.type.nodeValue)
		{
			case 'string':
				value = element.childNodes[0].nodeValue;
				break;

			case 'number':
				value = +element.childNodes[0].nodeValue;
				break;

			case 'int':
				value = parseInt(element.childNodes[0].nodeValue);
				break;
			
			case 'float':
				value = parseFloat(element.childNodes[0].nodeValue);
				break;
			
			default:
				throw new Error('Invalid variable type in ' + `${element.tagName}`);
		}
	}
	else
	{
		if(isNaN(element.childNodes[0].nodeValue))
		{
			value = element.childNodes[0].nodeValue;
		}
		else
		{
			value = +element.childNodes[0].nodeValue;
		}
	}

	// console.log(globalVariables);

	if('name' in element.attributes) globalVariables[element.attributes.name.nodeValue] = value;
	
	return value;
}

function implementIf(element)
{
	if(!element.hasAttributes() || !'condition' in element.attributes) throw new Error(`Empty condition at ${element.tagName}`);

	let condition = element.attributes.condition.nodeValue.replace('=', '==');

	condition.split(' ').forEach((word) => {
		if(word in globalVariables)
		{
			condition = condition.replace(word, globalVariables[word]);
		}
	});

	if(eval(condition))
	{
		execute(element);
	}
	else
	{
		for(const index in element.children)
		{
			const child = element.children[index];
			if(!child.tagName) continue;

			if(child.tagName.toLowerCase() == 'else-if')
			{
				implementIf(child);

				break;
			}
			else if(child.tagName.toLowerCase() == 'else') 
			{
				execute(child);

				break;
			}
		}
	}
}

function implementPrint(element)
{
	if(!element.childNodes) throw new Error(`Cannot print empty at ${element.tagName}`);

	result = '';

	element.childNodes.forEach((element) =>
	{
		if(element.nodeName == '#text')
		{
			result += element.textContent;
		}
		else if(element.nodeName == 'VARIABLE')
		{
			result += implementVariable(element);
		}
	})

	console.log(result);
}

function implementFunction(element, arguments)
{
	// Function call
	if(!element.childNodes[0])
	{

		if(!element.attributes.name.nodeValue in globalFunctions)
		{
			throw new Error(`Function ${element.attributes.name.nodeValue} does not exists in this context.`);
			return;
		}

		for(variable in arguments)
		{
			if(variable in globalVariables) throw new Error(`"${variable}" already exists in the global scope.`);

			globalVariables[variable] = arguments[variable];
		}

		execute(globalFunctions[element.attributes.name.nodeValue]);

		for(variable in arguments)
		{
			globalVariables.delete(variable);
		}

		return;
	}

	// Function definition
	if(!element.hasAttributes() & !element.childNodes[0]) throw new Error('Cannot asign an empty function at ' + `${element.tagName}`);

	globalFunctions[element.attributes.name.nodeValue] = element;
}