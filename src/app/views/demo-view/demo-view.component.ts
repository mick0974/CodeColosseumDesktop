import { Component, NgZone, OnInit } from '@angular/core';
import { Child, Command, open as ShellOpen } from '@tauri-apps/api/shell'
import { open as DialogOpen } from '@tauri-apps/api/dialog';
import { ApiService, LobbyEventType, MatchInfo } from 'src/app/services/api-service/api.service';
import { Packets } from 'src/app/services/api-service/api.packets';
import { ReplaySubject } from 'rxjs';
import { Commands } from 'src/app/services/api-service/api.commands';
@Component({
  selector: 'app-demo-view',
  templateUrl: './demo-view.component.html',
  styleUrls: ['./demo-view.component.scss']
})
export class DemoViewComponent implements OnInit {
  public child: Child | undefined;
  public filename: string = "";
  public output = "";
  public lobbyID?:string;
  public displayName = "AgentSmith"+Math.floor(Math.random()*1000000);
  public password?:string;
  public cmdConnect?:Commands.Connect;
  public cmdSpectate?:Commands.Spectate;

  constructor(
    private zone: NgZone,
    private api: ApiService
    ) { }

  ngOnInit(): void {
  }

  //API Test
  
  async onApiError(message: string){
    alert("Error: "+message)
  }


  async apiGameList() {
    let onSuccess = (gameList:string[])=>{ 
      let text = JSON.stringify(gameList)
      this.output = text
      console.log("gameList: "+text);
      this.refreshOutput();
    }
    let req = this.api.gameList( onSuccess );
    req.onError = this.onApiError;
  }

  async apiNewGame() {
    let onSuccess = (newGame:string)=>{
      let text = newGame
      this.output = text
      console.log("newGame: "+text);
      this.lobbyID = newGame;
      this.refreshOutput();
    }
    let req = this.api.createNewLobby(onSuccess, "new_lobby","roshambo", 2, 0 );
    req.onError = this.onApiError;
  }

  async apiLobbyList() {
    let onSuccess = (lobbyList:MatchInfo[])=>{
      if ( lobbyList.length > 0 ) { 
        this.lobbyID = lobbyList[0].id; 
        this.output = "SELECTED LOBBY: " + this.lobbyID + "\n"
      }

      let text = JSON.stringify(lobbyList, null, 2);
      this.output +=  text
      
      console.log("lobbyList: "+text);
      this.refreshOutput();

    }
    let req = this.api.lobbyList( onSuccess );
    req.onError = this.onApiError;
  }

  async apiConnect() {
    let onEvent = ( event:LobbyEventType )=>{ console.log("onEvent: "+event.toString() ) };
    let onMatchUpdate = (gameInfo: MatchInfo )=>{ 
      this.output = JSON.stringify(gameInfo, null, 2);
    };
    let onData = (data: string)=>{
      this.output += ''+data
      console.log("apiConnect:onMessage: "+data);
      this.refreshOutput();
    };

    let lobbyID = this.lobbyID ?? "1234"
    let req = this.api.connectToPlay(lobbyID, this.displayName, this.password, onEvent, onMatchUpdate, onData );
    req.onError = this.onApiError;

    this.cmdConnect = req;
  }

  async apiPlay() {
    this.cmdConnect?.sendBinary("ROCK\n");
    this.refreshOutput();
  }


  async apiSpectate() {
    
    let onEvent = ( event:LobbyEventType )=>{ alert("onEvent: "+event.toString() ) };
    let onMatchUpdate = (gameInfo: MatchInfo )=>{ 
      this.output = JSON.stringify(gameInfo, null, 2);
    };
    let onData = (data: string)=>{
      this.output += ''+data
      console.log("apiConnect:onMessage: "+data);
      this.refreshOutput();
    };

    let lobbyID = this.lobbyID ?? "1234"
    let req = this.api.connectToSpectate(lobbyID, onEvent, onMatchUpdate, onData );
    req.onError = this.onApiError;
  }



  // from original API test branch
  async actionSimulate(){

    this.api.gameList((gameList)=>{
      console.log(gameList);
    });

    let sendMove = (action:string,connect:Commands.Connect, timeout:number, count:number)=>{
      //(new Promise(resolve => setTimeout(resolve, timeout))).then(() => connect?.sendBinary("ROCK\n"));
      for(var i=0; i < count; i++){
        (new Promise(resolve => setTimeout(resolve, timeout*(i+1)))).then(() => connect.sendBinary(action+"\n"));
      }
      
    }

    let player1: Commands.Connect
    let player2: Commands.Connect
    let numRounds = 3;

    let onNewLobby = (newGame:string) => {
      console.log('New game created: ' + newGame);

      player1 = this.api.connectToPlay( newGame, "A", this.password,
        (onEvent) => {
          console.log('A: onEvent: '+onEvent)
        },
        (onMatchUpdate) => console.log('A: onMatchUpdate:\n'+JSON.stringify(onMatchUpdate)),
        (onData) => { 
          console.log('A: onData:\n'+onData);
        },
      );
      player1.onError = (error) => console.log('A: error: '+error);
      
      player2 = this.api.connectToPlay(
        newGame, 
        "B", 
        this.password,
        (onEvent) => {
          console.log('B: onEvent: '+onEvent)
        },
        (onMatchUpdate) => console.log('B: onMatchUpdate:\n'+JSON.stringify(onMatchUpdate)),
        (onData) => { 
          console.log('B: onData: \n'+onData)
        } ,
      );
      
      player2.onError = (error) => console.log('B: error: '+error);
      
      sendMove("ROCK",player1,500,11);
      sendMove("PAPER",player2,500,11);
    }

    let newLobby = this.api.createNewLobby(onNewLobby, "Lobby", "roshambo", 2, 0, 15);
    newLobby.onError = (error) => console.log('createNewLobby: error: '+error);
  }











  // exec test
  async actionRock() {
    await this.child?.write("ROCK\n");
    this.output += `IN: ROCK\n`;
    console.log(`IN: ROCK\n`);
    this.refreshOutput();
  }
  async actionPaper() {
    await this.child?.write("PAPER\n");
    this.output += `IN: PAPER\n`;
    console.log(`IN: PAPER\n`);
    this.refreshOutput();
  }
  async actionScissor() {
    await this.child?.write("SCISSOR\n");
    this.output += `IN: SCISSOR\n`;
    console.log(`IN: SCISSOR\n`);
    this.refreshOutput();
  }

  public refreshOutput() {
    this.zone.run(() => this.output += "")
  }



  async actionExec() {
    console.log("EXEC!")
    this.output = "";
    const command = new Command("sh", ["-c", `${this.filename} 3 1`]);
    command.stdout.on("data", (line: any) => {
      this.output += `OUT: ${line}\n`;
      console.log(`OUT: ${line}`);
      this.refreshOutput();
    });
    command.stderr.on("data", (line: any) => {
      this.output += `ERR: ${line}\n`;
      console.log(`ERR: ${line}`);
      this.refreshOutput();
    });
    this.child = await command.spawn();
  }

  async actionCompile() {
    console.log("COMPILE!")
    this.output = "";
    const command = new Command("sh", ["-c", `${this.filename} 3 1`])
    command.stdout.on("data", (line: any) => {
      this.output += `OUT: ${line}\n`;
      console.log(`OUT: ${line}`);
      this.refreshOutput();
    });
    command.stderr.on("data", (line: any) => {
      this.output += `ERR: ${line}\n`;
      console.log(`ERR: ${line}`);
      this.refreshOutput();
    });
    this.child = await command.spawn();
  }

  async actionSearch() {
    console.log("SEARCH!")
    this.filename = <string>await DialogOpen({
      multiple: false,
    });
    console.log(this.filename);
  }
}
