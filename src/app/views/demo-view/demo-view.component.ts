import { Component, NgZone, OnInit } from '@angular/core';
import { Child, Command, open as ShellOpen } from '@tauri-apps/api/shell'
import { open as DialogOpen } from '@tauri-apps/api/dialog';
import { ApiService } from 'src/app/services/api-service/api.service';
@Component({
  selector: 'app-demo-view',
  templateUrl: './demo-view.component.html',
  styleUrls: ['./demo-view.component.scss']
})
export class DemoViewComponent implements OnInit {
  public child: Child | undefined;
  public filename: String = "";
  public output = "";

  constructor(
    public zone: NgZone,
    private api: ApiService
    ) { }

  ngOnInit(): void {
  }


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
