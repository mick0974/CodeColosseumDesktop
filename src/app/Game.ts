export interface Game{
    id?:string;
    verified:boolean;
    game:string;
    players:number;
    maxplayers:number;
    spectators:number;
    timeout:number;
    password:boolean;
    current:boolean;
}