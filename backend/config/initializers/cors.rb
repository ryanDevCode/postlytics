# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # In production, set ALLOWED_ORIGINS env var to your frontend URL(s)
    # e.g., "https://your-frontend.vercel.app" or comma-separated for multiple
    allowed = ENV.fetch('ALLOWED_ORIGINS', '*')
    origins_list = allowed == '*' ? '*' : allowed.split(',').map(&:strip)
    
    origins origins_list
    resource '*',
             headers: :any,
             expose: ['Authorization'],
             methods: %i[get post put patch delete options head]
  end
end

