import { Component, NgZone, OnInit } from '@angular/core';
import { Child, Command, open as ShellOpen } from '@tauri-apps/api/shell'
import { open as DialogOpen } from '@tauri-apps/api/dialog';
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
    public zone: NgZone
    ) { }

  ngOnInit(): void {
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
