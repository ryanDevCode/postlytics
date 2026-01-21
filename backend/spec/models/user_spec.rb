require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'roles' do
    context 'when user has user role' do
      let(:user) { create(:user, role: 'user') }

      it 'returns true for user?' do
        expect(user.user?).to be true
      end

      it 'returns false for admin?' do
        expect(user.admin?).to be false
      end
    end

    context 'when user has admin role' do
      let(:admin) { create(:user, :admin) }

      it 'returns true for admin?' do
        expect(admin.admin?).to be true
      end

      it 'returns false for user?' do
        expect(admin.user?).to be false
      end
    end
  end
end
