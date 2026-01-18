class BookmarksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_post, only: [:create, :destroy]

  # GET /posts?filter=bookmarked handles the index view logic in PostsController
  
  def create
    @bookmark = @post.bookmarks.new(user: current_user)
    if @bookmark.save
      render json: { message: 'Bookmarked' }, status: :created
    else
      render json: { errors: @bookmark.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @bookmark = @post.bookmarks.find_by(user: current_user)
    if @bookmark&.destroy
      render json: { message: 'Bookmark removed' }, status: :ok
    else
      render json: { error: 'Bookmark not found' }, status: :not_found
    end
  end

  private

  def set_post
    @post = Post.find(params[:post_id])
  end
end
