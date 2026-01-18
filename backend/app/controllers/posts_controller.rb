class PostsController < ApplicationController
    before_action :authenticate_user!, except: [:index, :show]

    def index
      page = (params[:page] || 1).to_i
      per_page = (params[:per_page] || 15).to_i
      offset = (page - 1) * per_page

      posts = Post.includes(:user, :hashtags, :comments, :likes, :bookmarks).order(created_at: :desc)

      # Filtering
      if params[:hashtag].present?
        posts = posts.joins(:hashtags).where(hashtags: { name: params[:hashtag].downcase })
      end

      if params[:filter] == 'liked' && current_user
        posts = posts.joins(:likes).where(likes: { user_id: current_user.id })
      elsif params[:filter] == 'bookmarked' && current_user
        posts = posts.joins(:bookmarks).where(bookmarks: { user_id: current_user.id })
      end

      # Pagination
      posts = posts.offset(offset).limit(per_page)

      # Transformation for JSON
      posts_data = posts.map do |post|
        {
          id: post.id,
          content: post.content,
          created_at: post.created_at,
          user: {
            id: post.user.id,
            email: post.user.email
          },
          likes_count: post.likes.count,
          liked_by_current_user: current_user ? post.likes.exists?(user_id: current_user.id) : false,
          bookmarked_by_current_user: current_user ? post.bookmarks.exists?(user_id: current_user.id) : false,
          hashtags: post.hashtags.map { |h| { id: h.id, name: h.name } },
          comments: post.comments.map { |comment|
            {
              id: comment.id,
              content: comment.content,
              created_at: comment.created_at,
              user: {
                id: comment.user.id,
                email: comment.user.email
              }
            }
          }
        }
      end

      render json: posts_data
    end
  
    def show
      post = Post.find(params[:id])
      # Ideally DRY this up with a serializer in future
      render json: post.as_json(include: [:user, :hashtags, comments: { include: :user }])
    end
  
    def create
      post = current_user.posts.build(post_params)
      if post.save
        render json: post.as_json(include: { user: { only: :email }, hashtags: {}, comments: {} }), status: :created
      else
        render json: { errors: post.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    private
  
    def post_params
      params.require(:post).permit(:content)
    end
end
