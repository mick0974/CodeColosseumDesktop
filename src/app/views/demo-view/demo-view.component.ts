import { Component, NgZone, OnInit } from '@angular/core';
import { Child, Command, open as ShellOpen } from '@tauri-apps/api/shell'
import { open as DialogOpen } from '@tauri-apps/api/dialog';
import { ApiService } from 'src/app/services/api-service/api.service';
import { Packets } from 'src/app/services/api-service/api.packets';
import { ReplaySubject } from 'rxjs';
@Component({
  selector: 'app-demo-view',
  templateUrl: './demo-view.component.html',
  styleUrls: ['./demo-view.component.scss']
})
export class DemoViewComponent implements OnInit {
  public child: Child | undefined;
  public filename: String = "";
  public output = "";
  public lobbyID?:string;

  constructor(
    private zone: NgZone,
    private api: ApiService
    ) { }

  ngOnInit(): void {
  }

  //API Test

  async actionSpectate(){
    alert("API is available");
    let type = "spectate";

    this.api.gameList((gameList)=>{
      console.log(gameList);
    });

    if(type === "play") {
      this.api.createNewGame((gameNew) => {
        console.log('New game created: ' + gameNew);
        this.api.connectToPlay(
          (lobbyData) => console.log(lobbyData), 
          (lobbyUpdated) => console.log(lobbyUpdated),
          (matchStarted) => console.log(matchStarted),
          (binaryInfo) => console.log(binaryInfo),
          (matchEnded) => console.log(matchEnded),
          gameNew, "Lollo123", undefined, 
          (error) => alert(error));
      }, "Lobby", "roshambo", 2, 1, undefined, undefined, undefined, undefined, (error) => {
        alert("error 3");
      });
  
      (new Promise(resolve => setTimeout(resolve, 5000))).then(() => this.api.play("ROCK\n"));
      (new Promise(resolve => setTimeout(resolve, 6000))).then(() => this.api.play("ROCK\n"));
      (new Promise(resolve => setTimeout(resolve, 7000))).then(() => this.api.play("ROCK\n"));
      (new Promise(resolve => setTimeout(resolve, 8000))).then(() => this.api.play("ROCK\n"));
      (new Promise(resolve => setTimeout(resolve, 9000))).then(() => this.api.play("ROCK\n"));
      (new Promise(resolve => setTimeout(resolve, 10000))).then(() => this.api.play("ROCK\n"));
      (new Promise(resolve => setTimeout(resolve, 11000))).then(() => this.api.play("ROCK\n"));
      (new Promise(resolve => setTimeout(resolve, 12000))).then(() => this.api.play("ROCK\n"));
      (new Promise(resolve => setTimeout(resolve, 13000))).then(() => this.api.play("ROCK\n"));
      (new Promise(resolve => setTimeout(resolve, 14000))).then(() => this.api.play("ROCK\n"));
  
    } else {
      this.api.connectToSpectate(
        (spectateJoined) => console.log(spectateJoined), 
        (spectateStarted) => console.log(spectateStarted),
        (spectatSynced) => console.log(spectatSynced),
        (lobbyUpdated) => console.log(lobbyUpdated),
        (binaryMessage) => console.log(binaryMessage),
        (spectateEnded) => console.log(spectateEnded),
        "3m41h0rn9meb4"
      ); 
    }

  }






  async onApiError(message: string){
    alert("Error: "+message)
  }


  async apiGameList() {
    this.api.gameList( (gameList)=>{
      let text = JSON.stringify(gameList)
      this.output = text
      console.log("gameList: "+text);
      this.refreshOutput();
    });
  }

  async apiNewGame() {
    let onSuccess = (newGame:string)=>{
      let text = newGame
      this.output = text
      console.log("newGame: "+text);
      this.lobbyID = newGame;
      this.refreshOutput();
    }
    this.api.createNewLobby(onSuccess, "new_lobby","roshambo", 0, 2 );
  }

  async apiLobbyList() {
    this.api.lobbyList( (lobbyList)=>{
      let text = JSON.stringify(lobbyList)
      this.output = text
      console.log("lobbyList: "+text);
      this.refreshOutput();
    });
  }

  

  async apiConnect() {
    let onLobbyJoin = (data: Packets.Reply.LobbyJoinedMatch)=>{};
    let onLobbyUpdate = (data: Packets.Reply.LobbyUpdate)=>{};
    let onMatchStarted = (data: Packets.Reply.MatchStarted)=>{};
    let onMessage = (data: string)=>{};
    let onMatchEnded = (data: Packets.Reply.MatchEnded)=>{};
    
    let lobbyID = this.lobbyID ?? "1234"
    let display_name = "Mario Rossi";
    this.api.connectToPlay( onLobbyJoin, onLobbyUpdate, onMatchStarted, onMessage, onMatchEnded, lobbyID, display_name );
  }

  async apiPlay() {
    await this.child?.write("ROCK\n");
    this.output += `IN: ROCK\n`;
    console.log(`IN: ROCK\n`);
    this.refreshOutput();
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
