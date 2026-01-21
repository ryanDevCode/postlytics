require 'rails_helper'

RSpec.describe Post, type: :model do
  describe 'callbacks' do
    describe '#extract_and_save_hashtags' do
      let(:user) { create(:user) }
      
      it 'extracts hashtags from content on save' do
        post = create(:post, user: user, content: 'Hello #world and #ruby')
        expect(post.hashtags.pluck(:name)).to contain_exactly('world', 'ruby')
      end

      it 'does not duplicate existing hashtags' do
        create(:hashtag, name: 'ruby')
        expect {
          create(:post, user: user, content: '#ruby is great')
        }.to change(Hashtag, :count).by(0)
      end

      it 'handles various casing' do
        post = create(:post, user: user, content: '#Ruby and #RUBY')
        expect(post.hashtags.pluck(:name)).to contain_exactly('ruby')
      end
    end

    describe '#analyze_sentiment' do
      let(:user) { create(:user) }

      it 'detects positive sentiment' do
        post = create(:post, user: user, content: 'Rails is amazing and I love it')
        expect(post.sentiment_label).to eq('positive')
        expect(post.sentiment_score).to be > 0
      end

      it 'detects negative sentiment' do
        post = create(:post, user: user, content: 'This error is terrible and awful')
        expect(post.sentiment_label).to eq('negative')
        expect(post.sentiment_score).to be < 0
      end

      it 'defaults to neutral' do
        post = create(:post, user: user, content: 'This is a post')
        expect(post.sentiment_label).to eq('neutral')
      end
    end
  end
end
