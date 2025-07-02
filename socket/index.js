let io;

export const initSocket = (serverInstance) => {
  import("socket.io").then(({ Server }) => {
    io = new Server(serverInstance, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    io.on("connection", (socket) => {
      console.log("🔌 Client connected:", socket.id);

      // Listen for join event to join a room by email
      socket.on("join", (email) => {
        if (email) {
          socket.join(email);
          console.log(`Socket ${socket.id} joined room: ${email}`);
        }
      });

      socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
      });
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
