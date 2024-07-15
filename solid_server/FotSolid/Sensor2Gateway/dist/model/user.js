"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// Define a class representing a Car
class User {
    // Constructor
    constructor() {
        // Properties
        this.userid = '';
        this.local_webid = '';
        this.webId = '';
        this.idp = '';
        this.username = '';
        this.password = '';
        this.podname = '';
    }
    // Method to display information about the User
    displayInfo() {
        console.log(`UserId: ${this.userid}, Local WebId: ${this.local_webid}, WebId: ${this.webId}`);
    }
}
exports.User = User;
//# sourceMappingURL=user.js.map