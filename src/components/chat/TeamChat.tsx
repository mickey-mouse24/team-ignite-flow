import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Paperclip, Smile, MoreVertical, Hash, Users, Bell } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Message {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
  channel: string;
  reactions?: { emoji: string; count: number }[];
}

interface Channel {
  id: string;
  name: string;
  type: "public" | "private" | "direct";
  unread?: number;
  lastMessage?: string;
  members?: number;
}

const mockChannels: Channel[] = [
  { id: "1", name: "général", type: "public", unread: 3, lastMessage: "Nouveau projet lancé!", members: 142 },
  { id: "2", name: "tech", type: "public", unread: 0, lastMessage: "Code review terminée", members: 45 },
  { id: "3", name: "marketing", type: "public", unread: 1, lastMessage: "Campagne Q4 validée", members: 23 },
  { id: "4", name: "projet-cloud", type: "private", unread: 5, lastMessage: "Migration en cours...", members: 8 },
  { id: "5", name: "daouda", type: "direct", unread: 2, lastMessage: "Peux-tu regarder le doc?" },
  { id: "6", name: "bintou", type: "direct", unread: 0, lastMessage: "Merci pour ton aide!" }
];

const mockMessages: Message[] = [
  {
    id: "1",
    author: "daouda",
    content: "Bonjour l'équipe ! J'ai une mise à jour importante concernant le projet de migration cloud.",
    timestamp: "9:00",
    channel: "général",
    reactions: [{ emoji: "👍", count: 3 }, { emoji: "🚀", count: 2 }]
  },
  {
    id: "2",
    author: "daouda",
    content: "Super nouvelle ! Où en sommes-nous avec les tests de performance ?",
    timestamp: "9:05",
    channel: "général"
  },
  {
    id: "3",
    author: "daouda",
    content: "Les tests sont terminés et les résultats sont excellents. Je partage le rapport dans 5 minutes.",
    timestamp: "9:08",
    channel: "général",
    reactions: [{ emoji: "🎉", count: 5 }]
  },
  {
    id: "4",
    author: "daouda",
    content: "J'ai aussi terminé la configuration des environnements de staging. Tout est prêt pour la prochaine phase.",
    timestamp: "9:12",
    channel: "général"
  }
];

export function TeamChat() {
  const [selectedChannel, setSelectedChannel] = useState("général");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        author: "Vous",
        content: message,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        channel: selectedChannel
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-lg">{selectedChannel}</CardTitle>
            <Badge variant="outline" className="text-xs">
              {mockChannels.find(c => c.name === selectedChannel)?.members || 0} membres
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Users className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 flex">
        {/* Channels Sidebar */}
        <div className="w-64 border-r bg-muted/10">
          <div className="p-4">
            <h3 className="font-semibold text-sm mb-3">Canaux</h3>
            <ScrollArea className="h-[450px]">
              <div className="space-y-1">
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-2">Publics</p>
                  {mockChannels.filter(c => c.type === "public").map(channel => (
                    <button
                      key={channel.id}
                      onClick={() => setSelectedChannel(channel.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors flex items-center justify-between ${
                        selectedChannel === channel.name ? "bg-muted" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <Hash className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{channel.name}</span>
                      </div>
                      {channel.unread && channel.unread > 0 && (
                        <Badge className="h-5 px-1.5 text-xs">{channel.unread}</Badge>
                      )}
                    </button>
                  ))}
                </div>
                
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-2">Privés</p>
                  {mockChannels.filter(c => c.type === "private").map(channel => (
                    <button
                      key={channel.id}
                      onClick={() => setSelectedChannel(channel.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors flex items-center justify-between ${
                        selectedChannel === channel.name ? "bg-muted" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <Hash className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{channel.name}</span>
                      </div>
                      {channel.unread && channel.unread > 0 && (
                        <Badge className="h-5 px-1.5 text-xs">{channel.unread}</Badge>
                      )}
                    </button>
                  ))}
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Messages directs</p>
                  {mockChannels.filter(c => c.type === "direct").map(channel => (
                    <button
                      key={channel.id}
                      onClick={() => setSelectedChannel(channel.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors flex items-center justify-between ${
                        selectedChannel === channel.name ? "bg-muted" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-[10px]">
                            {channel.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{channel.name}</span>
                      </div>
                      {channel.unread && channel.unread > 0 && (
                        <Badge className="h-5 px-1.5 text-xs">{channel.unread}</Badge>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages
                .filter(m => m.channel === selectedChannel || selectedChannel === "général")
                .map(msg => (
                  <div key={msg.id} className="flex gap-3 group">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.avatar} />
                      <AvatarFallback>
                        {msg.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-sm">{msg.author}</span>
                        <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                      </div>
                      <p className="text-sm mt-1">{msg.content}</p>
                      {msg.reactions && (
                        <div className="flex gap-1 mt-2">
                          {msg.reactions.map((reaction, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-xs"
                            >
                              {reaction.emoji} {reaction.count}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>
          
          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                placeholder={`Message #${selectedChannel}`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Smile className="h-4 w-4" />
              </Button>
              <Button onClick={sendMessage} size="icon" className="h-9 w-9" variant="gradient">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}