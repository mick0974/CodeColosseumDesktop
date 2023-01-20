export interface ChatMessage{
    sender:ChatSender;
    content:string;
}

export type ChatSender = "server" | "other" | "me" | "divider";