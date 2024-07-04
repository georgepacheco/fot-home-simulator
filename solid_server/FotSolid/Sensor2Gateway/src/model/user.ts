// Define a class representing a Car
export class User {
    // Properties
    public userid: string  = '';
    public local_webid: string = '';
    public webid: string = '';
    public idp: string = '';
    public username: string = '';
    public password: string = '';
    public podname: string = '';

    // Constructor
    constructor() {
                
    }


    // Method to display information about the User
    displayInfo() {
        console.log(`UserId: ${this.userid}, Local WebId: ${this.local_webid}, WebId: ${this.webid}`);
    }
}

