import { GameParams } from "src/app/services/api-service/api.service";
import { RoshamboArgs, RoyalurArgs } from "src/app/services/api-service/api.service";
export const CREATE_GAMES:any[] = [
    {
        game_description:{
            name: "Royalur",
            description: "The Royal Game of Ur is one the oldest board games, dating back to at least 5000 years ago. This excellent video gives a thorough introduction to this game, explaining its rules from 3:41 to 5:10.\nThe Royal Game of Ur is a race game. Each player has 7 tokens, and it wants to send all tokens to the end of the track before the opponent does. Each player has a track of 14 cells (not counting start and end), with the cells from the fifth to the twelfth (included) shared between players. The game is played in turns alternating between the two players until one of them make all of their tokens exit the track, winning the game.\nAt the start of its turn, the player flips 4 two-sided coins, which will give a number \( n \) of heads. The player must then choose a token to move n  cells forward. For a token, to exit the track, the exact number of cells remaining is needed (e.g. if a token is on the fourteenth cell, only a \( 1 \) can make it exit the track). If no moves are possible for the player (such as when getting a \( 0 \), but it's not the only such case) then it skips the turn, giving it to the other player.\nThe player cannot move a token in a cell already occupied by one of its token, however it can move it in a cell occupied by an opponent's token. In this case, the opponent's token gets instantly sent back to the opponent's track start, and the cell becomes occupied by the player token.\nIf a token lands on the fourth, eighth or fourteenth cell, the player gets to play also for the next turn, otherwise the opponent's turn begins. A token cannot land on one of these 3 cells if it's already occupied (even by an opponent's token).",
        },
        game_params:{
            players:2,
            bots:1,
            timeout:10.0
        },
        args:[
            {
                name:"pace",
                value:1.5
            }
            
        ]
        
    },
    {
        game_description:{
            name:"Roshambo",
            description: "Rock Paper Scissors (also called roshambo) is one of the most basic hand games.\nIt is played by two players, which in each round choose one of the gestures paper, rock or scissors and show them at the same time. If the two gestures chosen are different, the winner is computed as follows:\npaper wins over rock\nrock wins over scissors\nscissors win over paper\nFor each round a point is awarded to the winner (if any). The player with most points at the end wins.",
        },
        game_params:{
            players:2,
            bots:0,
            timeout:100.0
        },
        args:[
            {
                name:"pace",
                value:1.5
            }
            ,
            {
                name:"rounds",
                value: 10
            }
        ]

    },
]
