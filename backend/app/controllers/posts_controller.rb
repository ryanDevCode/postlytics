class PostsController < ApplicationController
    before_action :authenticate_user!, except: [:index, :show]

    def index
      posts = Post.includes(:user, :hashtags, :comments).all
      render json: posts.as_json(include: { user: { only: :email }, hashtags: {}, comments: {} })
    end
  
    def show
      post = Post.find(params[:id])
      render json: post.as_json(include: [:user, :hashtags, comments: { include: :user }])
    end
  
    def create
      post = current_user.posts.build(post_params)
      if post.save
        extract_and_assign_hashtags(post)
        render json: post, status: :created
      else
        render json: { errors: post.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    private
  
    def post_params
      params.require(:post).permit(:content)
    end
  
    def extract_and_assign_hashtags(post)
      hashtags = post.content.scan(/#\w+/).map { |tag| tag.delete('#').downcase }
      hashtags.each do |tag_name|
        tag = Hashtag.find_or_create_by(name: tag_name)
        post.hashtags << tag unless post.hashtags.include?(tag)
      end
    end    
end
