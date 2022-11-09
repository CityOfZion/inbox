
export async function _get(url) {
    var options = {
        method: "GET",
    }
    const response = await fetch(url, options);

    let status = response.status;

    if (status !== 200) {
        let text = await response.text()
        throw new Error(text);
    }

    let data = await response.json()
    return data;
}

export async function _request(method, url, postBody) {
    return makerequest(method, url, postBody, false)
}

async function makerequest(method, url, postBody, authorizedRequest) {
    
    let headers = {
        'Content-Type': 'application/json'
    }

    var options = {
        method: method,
        headers: headers,
        body: postBody !== null && postBody !== undefined ? JSON.stringify(postBody) : null
    }

    const response = await fetch(url, options);
    let status = response.status;

    if (status !== 200) {
        let error = new Error();
        let isParseError = false
        try {
            let e = await response.json()
            error = { ...error, statusCode: status, data: e };
        } catch (e) {
            isParseError = true
        }

        if (isParseError) {
            error = { ...error, statusCode: status, data: { message: response.statusText } };
            throw error;
        }

        throw error;

    }

    let data = await response.json()
    return data;
}
