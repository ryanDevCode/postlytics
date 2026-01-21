FactoryBot.define do
  factory :post do
    content { Faker::Lorem.paragraph }
    association :user
  end
end
