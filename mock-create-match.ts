import { GameDetails } from "src/app/services/api-service/api.service";
export const CREATE_GAMES:GameDetails[] = [
    {
        game_description:{
            game_name: "royalur",
            game_descr: ""
        },
        game_params:{
            players:2,
            bots:1,
            timeout:10.0
        },
        args:[
            {
                name:"pace",
                value:"1.5"
            }
            
        ]
    },
    {
        game_description:{
            game_name: "roshambo",
            game_descr: ""
        },
        game_params:{
            players:2,
            bots:0,
            timeout:100.0
        },
        args:[
            {
                name:"rounds",
                value:"10"
            },
            {
                name:"pace",
                value:"1.5"
            }
            
        ]

    },
]
