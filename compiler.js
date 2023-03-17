variables = {}
function variable(element)
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

	console.log(variables);

	if('name' in element.attributes) variables[element.attributes.name.nodeValue] = value;
	
	return value;
}