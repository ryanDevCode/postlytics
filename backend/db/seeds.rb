# Clear existing data
puts "Cleaning database..."
Comment.destroy_all
Post.destroy_all
User.destroy_all

puts "Creating users..."
users = []
user_avatars = [
  'alex@test.com', 'sam@test.com', 'jordan@test.com', 'casey@test.com', 
  'taylor@test.com', 'morgan@test.com', 'riley@test.com', 'jamie@test.com'
]

user_avatars.each do |email|
  users << User.create!(
    email: email,
    password: 'password',
    password_confirmation: 'password'
  )
end

# Create a demo user for the developer
demo_user = User.create!(
  email: 'demo@example.com',
  password: 'password',
  password_confirmation: 'password'
)
users << demo_user

puts "Creating posts..."
hashtags = ['#ruby', '#rails', '#react', '#javascript', '#coding', '#webdev', '#frontend', '#backend', '#fullstack', '#learning']
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

30.times do
  user = users.sample
  base_content = sentences.sample(rand(2..3)).join(" ")
  
  # Randomly append hashtags
  num_tags = rand(1..3)
  tags = hashtags.sample(num_tags)
  content = "#{base_content}\n\n#{tags.join(' ')}"

  Post.create!(
    user: user,
    content: content,
    created_at: Time.now - rand(1..10).days
  )
end

puts "Creating comments..."
posts = Post.all
comments_text = [
    "Great post!", "Totally agree.", "This happened to me yesterday.", 
    "Can you share more details?", "Awesome work!", "Nice!", "So true.",
    "Interesting perspective.", "Thanks for sharing."
]

50.times do
  post = posts.sample
  user = users.sample
  
  Comment.create!(
    post: post,
    user: user,
    content: comments_text.sample,
    created_at: post.created_at + rand(1..24).hours
  )
end

puts "Seeding done!"
puts "Demo User: demo@example.com / password"
