class LikesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_post

  def create
    @like = @post.likes.new(user: current_user)
    if @like.save
      render json: { message: 'Liked' }, status: :created
    else
      render json: { errors: @like.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @like = @post.likes.find_by(user: current_user)
    if @like&.destroy
      render json: { message: 'Unliked' }, status: :ok
    else
      render json: { error: 'Like not found' }, status: :not_found
    end
  end

  private

  def set_post
    @post = Post.find(params[:post_id])
  end
end
