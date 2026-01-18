module ApplicationCable
  class Connection < ActionCable::Connection::Base
    def connect
      # For now, allow all connections to facilitate real-time updates without 
      # complex JWT decoding in the WebSocket handshake.
      # In production, verify the token query param here.
    end
  end
end
