class MessagesController < ApplicationController
  before_action :authenticate_user, :set_user

  def create
    room = Room.find(params[:room_id])
    message = room.messages.new(message_params.merge(:user_id => @user[:user][:id]))

    if message.save!
      serialized_message = ActiveModelSerializers::Adapter::Json.new(
      MessageSerializer.new(message)
      ).serializable_hash
      ActionCable.server.broadcast 'messages_channel', serialized_message
      head :ok
    end

    #handle / commands, call other method with a new giphy key in broadcast w img src to conditionally check on front end
  end

  private

  def set_user
    @user = ActiveModelSerializers::Adapter::Json.new(
      UserSerializer.new(current_user)
    ).serializable_hash
  end

  def message_params
    params.require(:message).permit(:text, :room_id)
  end
end
