import { GameParams } from "src/app/services/api-service/api.service";
export const CREATE_GAMES:GameParams[] = [
    {
        players:2,
        bots:1,
        timeout:10.0,
       
    },
    {
        players:3,
        bots:0,
        timeout:100.0,
    },
]
