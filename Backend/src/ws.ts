// Import WebSocket types from ws package
import { WebSocketServer , WebSocket} from "ws";

// Initialize WebSocket server on port 8080
const wss = new WebSocketServer({ port: 8080 });

// Define User interface to track connected users and their room assignments
interface User {
  socket: WebSocket;
  room: string;
}
// Array to store all connected users
let allSockets: User[] = [];

// Handle new WebSocket connections
wss.on("connection", (socket) => {
  // Listen for messages from connected clients
  socket.on("message", (message) => {
    //@ts-ignore
    const parsedMessage = JSON.parse(message);

    // Handle room join requests
    if (parsedMessage.type === "join") {
      console.log("User joined room" + parsedMessage.payload.roomId);
      // Add new user to the allSockets array with their room assignment
      allSockets.push({
        socket,
        room: parsedMessage.payload.roomId,
      });
    }

    // Handle chat messages
    if (parsedMessage.type === "chat") {
      console.log("user wants to chat");
      // Find the sender's socket information
      const socketUser = allSockets.find((x) => x.socket == socket);
      if (!socketUser) return;
      
      // Broadcast the message to all users in the same room
      for (let i = 0; i < allSockets.length; i++) {
            if(allSockets[i].room === socketUser.room){
                allSockets[i].socket.send(parsedMessage.payload.message);
            }
        }
    }
  });
});
