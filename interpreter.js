directCompileInstructions = ['variable']
indirectCompileInstructions = ['function']

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
			variable(element)

			break;
	}
}