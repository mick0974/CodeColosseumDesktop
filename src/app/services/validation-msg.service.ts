export class ValidationMsgService{
    public getValidationMsg(validationId: string):string{
        return this.errorMessages[validationId];
    }
    private errorMessages= {
        'server-url-required-msg':"Please enter a server url",

        'username-required-msg':"Please enter a username"
    }
}