const Ajv = require("ajv")
const betterAjvErrors = require('better-ajv-errors').default;
const schema = require('state_repo_update_image_schema.json');

class ValidateInputs {

    static checkValidInput(rawInput) {
        const ajv = new Ajv({allErrors: true})
        const validate = ajv.compile(schema)
        const valid = validate(rawInput)
        if (!valid) {
            const prettyErr = betterAjvErrors(schema, rawInput, validate.errors, {indent: 2})
            throw new Error(prettyErr)
        }
    }
}

module.exports = ValidateInputs;
