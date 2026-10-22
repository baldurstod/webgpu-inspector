import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import fs from 'fs';
import { rollup } from 'rollup';
import copy from 'rollup-plugin-copy';
import ts from 'typescript';

const isProduction = process.env.BUILD === 'production';
const isFirefox = process.env.BROWSER === 'firefox';

/**
 * Get the actual path of lib.dom.d.ts
 */
let libDomPath = '';
const inputOptions = {
	input: './src/client/ts/content/content.ts',
	plugins: [
		typescript({
			transformers: {
				before: [
					{
						type: 'program',
						factory: (program, getProgram) => {
							const get = getProgram ?? (() => program);
							return (context) => (source) => {
								const latest = get();
								const l = latest.resolvedLibReferences.get('lib.dom.d.ts');
								if (l && l.actual) {
									libDomPath = l.actual;
								}
								return ts.visitEachChild(source, (n) => n, context);
							};
						}
					},
				],
			}
		}
		),
	],
};
const bundle = await rollup(inputOptions);
const { output } = await bundle.generate({});
//console.info(output);

if (bundle) {
	// closes the bundle
	await bundle.close();
}

if (libDomPath !== '') {
	const sourceCode = fs.readFileSync(libDomPath, { encoding: 'utf-8' });
	//console.info(sourceCode)

	// Parse the source code into an AST
	const sourceFile = ts.createSourceFile(
		'example.ts',
		sourceCode,
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TS,
	);

	function getChildrenOfKind(node, kind) {
		const children = [];

		ts.forEachChild(node, child => {
			if (child.kind === kind) {
				children.push(child);
			}
		});

		return children;
	}

	function getDescendantsOfKind(node, kind) {
		const children = [];

		const stack = [node];
		const seen = new WeakSet([node]);

		while (true) {
			const current = stack.pop();
			if (!current) {
				break;
			}
			seen.add(current);

			ts.forEachChild(current, child => {
				if (child.kind === kind) {
					children.push(child);
				}
				if (!seen.has(child)) {
					stack.push(child);
				}
			});
		}

		return children;
	}

	function getInterface(name, node = sourceFile) {
		const interfaces = getDescendantsOfKind(node, ts.SyntaxKind.InterfaceDeclaration);
		for (const inte of interfaces) {
			const interfaceName = (inte.name).text;
			if (interfaceName === name) {
				return inte;
			}
		}
	}

	/**
	 * Return the list of heritage clause of a node
	 * @param {*} node
	 * @returns
	 */
	function visitHeritageClause(node) {
		const result = [];
		ts.forEachChild(node, node => {
			//console.log('isHeritageClause', node.name?.text);
			if (ts.isHeritageClause(node)) {

				ts.forEachChild(node, node => {
					const text = node.getText();
					console.log('Sub child', node.kind, text, node.getChildCount());

					ts.forEachChild(node, node => {
						console.log('Sub sub child', node.kind, text, node.getChildCount(), node.getText());
						result.push(node.getText());
					});
				});
			}
		});
		return result;
	}

	function visitNode(node) {
		/*
		if (ts.isVariableDeclaration(node)) {
			const variableName = (node.name).text;
			console.log(`Variable name: ${variableName}`);
		}
		*/
		/*
		if (ts.is(node)) {
		}
		*/
		if (ts.isInterfaceDeclaration(node)) {
			const variableName = (node.name).text;
			if (variableName === 'WebGL2RenderingContext') {
				console.log(`Variable name: ${variableName}`, node.getChildCount());

				ts.forEachChild(node, childNode => {
					const text = childNode.getText();

					console.log('child', childNode.kind, text);
					if (childNode.kind == ts.SyntaxKind.HeritageClause) {
						visitHeritageClause(childNode)
					}

					return false;
				});
			}
		}
		ts.forEachChild(node, visitNode);
	}

	const methods = [];
	const knowMethods = new Set();
	function generateMethod(methodName, parameters, returnType) {

		// Deal with duplicate signatures
		if (knowMethods.has(methodName)) {
			return;
		}
		knowMethods.add(methodName);

		// Main string

		let s = `\tconst original${methodName} = window.WebGL2RenderingContext.prototype.${methodName};\n`;
		s += `\twindow.WebGL2RenderingContext.prototype.${methodName} = function (`;

		// Original function call parameters
		let s2 = '';
		for (const parameter of parameters) {
			s += `${parameter.name}: ${parameter.type}, `;
			s2 += `${parameter.name}, `;
		}
		s += `): ${returnType} {\n`;


		//s += `\t\tconsole.info('MyWebGL2RenderingContext ${methodName}', ${s2});\n`;
		s += `\t\treturn original${methodName}.call(this, ${s2});\n`;

		s += `\t}\n\n`
		//console.info(s);

		methods.push(s);

		/*

window.WebGL2RenderingContext.prototype.shaderSource = function (shader: WebGLShader, source: string): void {
	console.debug('WebGL2RenderingContext shaderSource', shader, source);
	return originalShaderSource.call(this, shader, source);
}
*/

	}

	const webGL2RenderingContextNode = getInterface('WebGL2RenderingContext');
	if (webGL2RenderingContextNode) {
		const result = visitHeritageClause(webGL2RenderingContextNode);
		console.info('visitHeritageClause result', result);
		for (const h of result) {
			const i2 = getInterface(h);
			if (i2) {
				const inheritedInterfaceName = i2.name?.text;

				ts.forEachChild(i2, node => {
					switch (node.kind) {
						case ts.SyntaxKind.PropertySignature:
							break;
						case ts.SyntaxKind.MethodSignature:

							//if (node.name?.text === 'createTexture')
							if (node.getChildCount() > 2) {
								//console.info('inheritedInterfaceName', inheritedInterfaceName, node.name?.text, ts.SyntaxKind[node.kind], node.getText());

								let methodName, returnType;
								const parameters = [];
								// Iterate through the child to get the method signature
								ts.forEachChild(node, node => {
									// The first node is the method name, the last the return type
									if (!methodName) {
										methodName = node;
									}
									returnType = node;

									if (node.kind === ts.SyntaxKind.Parameter) {
										const param = {};
										// Get the parameter name and type
										ts.forEachChild(node, node => {
											//if (node.kind === ts.SyntaxKind.TypeReference || node.kind === ts.SyntaxKind.UnionType) {
											if (node.kind === ts.SyntaxKind.Identifier) {
												param.name = node.getText();
											} else {
												param.type = node.getText();
											}

											if (methodName.getText() === 'drawBuffers') {
												console.info('Method param', node.getText(), ts.SyntaxKind[node.kind]);

											}
										});
										parameters.push(param);
									}
									//console.info('inheritedInterfaceName child', inheritedInterfaceName, node.name?.text, ts.SyntaxKind[node.kind], node.getText(), node.modifiers);
								});
								//console.info('test', node.name?.text, methodName.getText(), returnType.getText());

								/*
								for (const param of parameters) {
									console.info('parameter', param.name, param.type);
								}
								*/

								generateMethod(methodName.getText(), parameters, returnType.getText());
							}

							break;
						default:
						//console.info('inheritedInterfaceName', inheritedInterfaceName, node.name?.text, ts.SyntaxKind[node.kind], node.getText());
					}
				});
			}
		}
	}

	/*
	const a = [];
	ts.forEachChild(sourceFile, node => {
		if (node.name) {
			const variableName = (node.name).text;
			if (variableName === 'WebGL2RenderingContext') {
				//console.info(node);
				console.info(variableName, node.kind);
				a.push(variableName);
			}
		}
	});
	*/

	//console.log(sourceFile.identifiers['WebGL2RenderingContextBase']);
	//console.log(methods.join(''));

	/*
	fs.writeFile(`./test.json`, Buffer.from(JSON.stringify(sourceFile, function (key, value) {
		if (key == 'parent') { return null; }
		else { return value; }
	})), async (err) => { if (err) throw err });
	*/
	fs.writeFile(`./WebGL2RenderingContext.txt`, Buffer.from(methods.join('')), async (err) => { if (err) throw err });
}
