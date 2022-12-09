import { Component, OnInit } from '@angular/core';
import { MOCKMESSAGES } from 'mock-messages';
import { ChatMessage } from 'src/app/ChatMessage';

@Component({
  selector: 'cc-chat',
  templateUrl: './cc-chat.component.html',
  styleUrls: ['./cc-chat.component.scss']
})
export class CcChatComponent implements OnInit {

  messages:ChatMessage[]=MOCKMESSAGES
  constructor() { }

  ngOnInit(): void {
  }

}
