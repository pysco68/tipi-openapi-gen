import 'isomorphic-fetch'
import { resolveSpec, getOperations } from './spec'
import genJsCode from './gen/js'
import { removeOldFiles } from './gen/util'
import * as assert from 'assert'
import { OpenAPIObject, OperationObject } from 'openapi3-ts'

export function genCode(options: ClientOptions): Promise<any> {
  return verifyOptions(options)
    .then(options => {
      options.language = 'js';
      return resolveSpec(options.src, { ignoreRefType: '#/definitions/' })
        .then(spec => gen(spec, options))
    })
}

function verifyOptions(options: ClientOptions): Promise<any> {
  try {
    assert.ok(options.src, 'Open API src not specified')
    assert.ok(options.outDir, 'Output directory not specified')
    assert.ok(options.language, 'Generation language not specified')
    return Promise.resolve(options)
  } catch(e) {
    return Promise.reject(e)
  }
}

function gen(spec: OpenAPIObject, options: ClientOptions): OpenAPIObject {
  removeOldFiles(options)
  const operations = getOperations(spec)
  switch (options.language) {
    case 'js': return genJsCode(spec, operations, options)
    //case 'ts': return genJsCode(spec, operations, options)
    default:
      throw new Error(`Language '${options.language}' not supported`)
  }
}