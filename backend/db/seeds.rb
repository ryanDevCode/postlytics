# Clear existing data
puts "Cleaning database..."
Comment.destroy_all
Bookmark.destroy_all
Like.destroy_all
Post.destroy_all
User.destroy_all

puts "Creating users..."

# 1. Admin User
admin = User.create!(
  email: 'admin@example.com',
  password: 'password',
  password_confirmation: 'password',
  role: 'admin'
)
puts "  - Created Admin: admin@example.com"

# 2. Demo User (for testing RBAC)
demo_user = User.create!(
  email: 'demo@example.com',
  password: 'password',
  password_confirmation: 'password',
  role: 'user'
)
puts "  - Created Demo User: demo@example.com"

# 3. Other Users
other_users = []
user_avatars = [
  'alex@test.com', 'sam@test.com', 'jordan@test.com', 'casey@test.com', 
  'taylor@test.com', 'morgan@test.com', 'riley@test.com', 'jamie@test.com'
]

user_avatars.each do |email|
  other_users << User.create!(
    email: email,
    password: 'password',
    password_confirmation: 'password',
    role: 'user'
  )
end

puts "Creating posts..."
hashtags = ['#ruby', '#rails', '#react', '#javascript', '#coding', '#webdev', '#frontend', '#backend', '#fullstack', '#learning', '#docker', '#deployment', '#testing', '#advice', '#career']
sentences = [
  "Just started learning a new framework today! It's amazing.",
  "Debugging is like being the detective in a crime movie where you are also the murderer.",
  "Ruby on Rails is still so productive in 2024. Love it.",
  "React hooks are powerful but can be tricky.",
  "Anyone used the new features in the latest release?",
  "Refactoring code is my therapy.",
  "Deploying to production on a Friday... wish me luck!",
  "CSS Grid makes layouts so much easier.",
  "Just shipped a new feature! user feedback is great so far.",
  "Why does this code work? I have no idea."
]

# Helper to create posts for a user with specific volume
def create_posts_for(user, count, sentences, hashtags)
  count.times do
    base_content = sentences.sample(rand(2..3)).join(" ")
    num_tags = rand(1..4)
    tags = hashtags.sample(num_tags)
    content = "#{base_content}\n\n#{tags.join(' ')}"

    Post.create!(
      user: user,
      content: content,
      created_at: Time.now - rand(1..30).days
    )
  end
end

# Give Admin a moderate amount of posts
create_posts_for(admin, 15, sentences, hashtags)

# Give Demo User A LOT of posts so their dashboard looks full
create_posts_for(demo_user, 40, sentences, hashtags)

# Give Others random amount
other_users.each do |u|
  create_posts_for(u, rand(5..15), sentences, hashtags)
end

puts "Creating comments..."
all_posts = Post.all
comments_text = [
    "Great post!", "Totally agree.", "This happened to me yesterday.", 
    "Can you share more details?", "Awesome work!", "Nice!", "So true.",
    "Interesting perspective.", "Thanks for sharing."
]

# Random comments across the platform
150.times do
  post = all_posts.sample
  user = ([admin, demo_user] + other_users).sample
  
  Comment.create!(
    post: post,
    user: user,
    content: comments_text.sample,
    created_at: post.created_at + rand(1..24).hours
  )
end

# Ensure Demo User has received some comments
demo_posts = demo_user.posts
30.times do
  post = demo_posts.sample
  user = other_users.sample
  Comment.create!(
    post: post,
    user: user,
    content: "Replying to your demo post: #{comments_text.sample}",
    created_at: post.created_at + rand(1..5).hours
  )
end

puts "Seeding done!"
puts "Admin: admin@example.com / password"
puts "Demo:  demo@example.com / password"
