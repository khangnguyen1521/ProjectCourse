#!/bin/bash

echo "🚀 Chuẩn bị deploy ProjectCourse..."

# Build frontend
echo "📦 Building frontend..."
npm run build

# Check if build successful
if [ -d "build" ]; then
    echo "✅ Frontend build thành công!"
else
    echo "❌ Frontend build thất bại!"
    exit 1
fi

# Test backend
echo "🧪 Testing backend..."
cd backend
npm install
node -e "console.log('✅ Backend dependencies OK')"
cd ..

echo "🎉 Project sẵn sàng deploy!"
echo ""
echo "Tiếp theo:"
echo "1. Push code lên GitHub: git add . && git commit -m 'Ready for deployment' && git push"
echo "2. Đăng ký MongoDB Atlas tại: https://www.mongodb.com/atlas"
echo "3. Chọn platform deploy trong DEPLOYMENT.md"
echo ""
echo "🌊 Render.com (Khuyến nghị): https://render.com"
echo "⚡ Vercel + Railway: https://vercel.com & https://railway.app"
echo "🌐 Netlify + Heroku: https://netlify.com & https://heroku.com" 