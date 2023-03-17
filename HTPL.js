// ---------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
	const blocks = document.querySelectorAll('code');
	blocks.forEach(block => execute(block))
})

// ---------------------------------------------------------------------------------

directCompileInstructions = ['variable', 'if', 'print']
indirectCompileInstructions = ['function']
variables = {}
functions = {
	'print': (content) => {console.log(content);}
}

function execute(block)
{
	Array.from(block.children).forEach(element => {
		instruction = element.tagName.toLowerCase();

		if(!directCompileInstructions.includes(instruction))
		{
			return;
		}

		compile(instruction, element);
	})
}

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
	}
}

// ---------------------------------------------------------------------------------

function implementVariable(element)
{
	if(!element.childNodes[0] & element.hasAttributes())
	{
		if(!element.attributes.name.nodeValue in variables)
		{
			throw new Error(`Variable ${element.attributes.name.nodeValue} does not exists.`);
			return;
		}

		return variables[element.attributes.name.nodeValue];
	}

	if(!element.hasAttributes() & !element.childNodes[0]) throw new Error('Cannot asign an empty value at ' + `${element.tagName}`);

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

	// console.log(variables);

	if('name' in element.attributes) variables[element.attributes.name.nodeValue] = value;
	
	return value;
}

function implementIf(element)
{
	if(!element.hasAttributes() || !'condition' in element.attributes) throw new Error(`Empty condition at ${element.tagName}`);

	let condition = element.attributes.condition.nodeValue.replace('=', '==');

	condition.split(' ').forEach((word) => {
		if(word in variables)
		{
			condition = condition.replace(word, variables[word]);
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

	console.log(element.childNodes[0].nodeValue);
}