export interface Game{
    id?:string;
    name:string
    verified:boolean;
    game:string;
    players:number;
    maxplayers:number;
    spectators:number;
    timeout:number;
    password:boolean;
    current:boolean; // true=running, false=waiting
    time:number //  expiration information for waiting to start matches and running time for running matches.
}