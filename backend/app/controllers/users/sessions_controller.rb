class Users::SessionsController < Devise::SessionsController
    respond_to :json
  
    before_action :skip_session_storage

    private

    def skip_session_storage
        request.session_options[:skip] = true
    end
  
    def respond_with(resource, _opts = {})
      render json: { message: 'Logged in successfully', user: resource }, status: :ok
    end
  
    def respond_to_on_destroy
      head :no_content
    end
  end
  