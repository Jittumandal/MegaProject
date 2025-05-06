class ApiClient {
    constructor() {
        this.baseUrl = 'http://localhost:8080/api/v1'; // update with your backend ULT
        this.headers = {
            'Content-Type': 'application/json', // Corrected spelling
            'Accept': 'application/json'
        };
    }

    async customFetch(endpoint, optioms = {}) {
        try {
            const url = `${this.baseUrl}${endpoint}`; // base url and endpoint 
            const headers = { ...this.headers, ...optioms.headers }; // get header from options and base url

            const config = {
                ...optioms, // get option from options
                headers, // get header from options
                credentials: 'include', //include cookie in request
            }
            console.log('Fetching Url:', url)

            const response = await fetch(url, config); // fetch data from url and config
            // validate resposne
            // if (!response) {
            //     const error = new Error('Network response was not ok')
            //     error.response = response;
            //     throw error; // throw error if response is not ok 
            // }

            const data = await response.json(); // get data from response json  from respose  object 
            return data; // return data 

        } catch (error) {
            console.log('API Error:', error); // long error if error is not ok
            throw error;// throw error if error is not ok

        }
    }
    //  authentication  endpoint

    // register endpoindt
    async register(name, email, password) {
        return this.customFetch('/users/register', {
            method: 'POST',
            body: JSON.stringify({
                name,
                email,
                password
            })
        })
    }
    // login endpont
    async login(email, password) {
        return this.customFetch("/users/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
    }
    // get profile endpoint
    async getProfile() {
        return this.customFetch('/users/profile', {
            method: 'GET',
        })
    }
}

const apiClient = new ApiClient(); // create instance of apiclient class 

export default apiClient; // export instance of apiclient class







