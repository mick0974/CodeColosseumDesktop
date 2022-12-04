import { Injectable } from '@angular/core';
import { Game } from '../Game';
import { GAMES } from 'mock-games';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  game! : Game | null;
  gameId:string="";

  constructor() { }

  setGame(token:string|null):string|null{
      // TODO: This check has to be substituted with getting the game from the API

    if (token){

      this.gameId=token;


      //Check: does the game exist? If so, save it
      GAMES.find( (g) => (this.game = g.id === this.gameId ? g : null) )

      if(this.game){
        console.log("[Service] Game set to "+ this.gameId)
        console.log(this.game)
      }
      else{
        console.log("[Service] Attempted to edit game that doesn't exist!")
      }


      return this.gameId
    }
    else {
      // No ID was given: redirect
      console.log("[Service] No ID found; gotta redirect...")
      return (null)
    }
  }

  getGameId(){
    return this.gameId
  }

  isGameSet(){
    return this.game !== null
  }
  
  
  reset(){
    this.game=null;
    this.gameId=""
    console.log("[Service] Gameplay was reset.")
  }
}
