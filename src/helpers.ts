/**
 * 
 * @param params Request params obtained from req.params.
 * @param idParamName The name of the id parameter in the request.
 * @param treatIdAsString If true, the id will be returned as a string. Otherwise, it will be returned as a number.
 * @returns Id param value from the request.
 */
export function getId<ID>(
    params: { [key: string]: string },
    idParamName: string,
    treatIdAsString: boolean = false
): [null, ID] | [[string], null] {
    const idString = params[idParamName];

    if (treatIdAsString) {
        return [null, idString as unknown as ID];
    } else {
        const id = Number(params[idParamName]);
        if (Number.isNaN(id)) {
            return [[`id is not recognized.`], null];
        } else {
            return [null, id as unknown as ID];
        }
    }
}
