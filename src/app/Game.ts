export interface Game{
    id?:number;
    verified:boolean;
    game:string;
    players:number;
    maxplayers:number;
    spectators:number;
    timeout:number;
    password:string;
    current:boolean;
}