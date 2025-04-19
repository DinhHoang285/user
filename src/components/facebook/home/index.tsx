import React from 'react';
import style from './style.home.scss';

export default function FacebookInterface() {
  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      {/* Header/Navigation Bar */}
      <div className="flex items-center justify-between bg-white shadow-sm px-4 py-2 sticky top-0 z-50">
        {/* Left section - Logo and Search */}
        <div className="flex items-center">
          <div className="text-blue-600 mr-2">
            <svg viewBox="0 0 36 36" className="w-10 h-10" fill="currentColor">
              <path d="M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z" />
              <path className="fill-white" d="M25 23l.8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z" />
            </svg>
          </div>
          <div className="relative ml-2">
            <input
              type="text"
              className="bg-gray-100 rounded-full py-2 px-10 w-60 focus:outline-none"
              placeholder="Tìm kiếm trên Facebook"
            />
            <div className="absolute top-2.5 left-3 text-gray-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Middle section - Main Navigation */}
        <div className="flex flex-1 justify-center">
          <div className="flex items-center space-x-2">
            <div className="px-10 py-2 text-blue-500 border-b-4 border-blue-500">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <div className="px-10 py-2 text-gray-500">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z" />
              </svg>
            </div>
            <div className="px-10 py-2 text-gray-500">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12 0a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
              </svg>
            </div>
            <div className="px-10 py-2 text-gray-500">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zm5 2a2 2 0 11-4 0 2 2 0 014 0zm-8 8a3 3 0 100-6 3 3 0 000 6zm-2 3a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right section - User Controls */}
        <div className="flex items-center space-x-2">
          <div className="bg-gray-200 rounded-full p-2.5">
            <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <div className="bg-gray-200 rounded-full p-2.5">
            <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" />
            </svg>
          </div>
          <div className="bg-gray-200 rounded-full p-2.5">
            <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img src="/api/placeholder/40/40" alt="User profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Sidebar */}
        <div className="w-1/4 p-4 overflow-y-auto hidden md:block">
          <div className="space-y-1">
            <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 cursor-pointer">
              <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                <img src="/api/placeholder/32/32" alt="User" className="w-full h-full object-cover" />
              </div>
              <span className="font-medium">Nguyễn Duy</span>
            </div>

            <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <span>Bạn bè</span>
            </div>

            <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 7H7v6h6V7z" />
                  <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Kỷ niệm</span>
            </div>

            <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
              </div>
              <span>Đã lưu</span>
            </div>

            <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <span>Nhóm</span>
            </div>

            <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-6V5h1v2h-1zm2 0h1v6h-1V7zM5 7V5h1v2H5zm0 2h1v6H5V9z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Video</span>
            </div>

            <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
              </div>
              <span>Marketplace</span>
            </div>
          </div>
        </div>

        {/* Main Content/Feed */}
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Stories */}
          <div className="flex space-x-2 overflow-x-auto pb-4">
            <div className="relative min-w-32 h-48 rounded-lg overflow-hidden bg-gray-300 cursor-pointer shadow">
              <img src="/api/placeholder/128/200" alt="Story" className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 w-9 h-9 rounded-full border-4 border-blue-500 overflow-hidden">
                <img src="/api/placeholder/36/36" alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-3 left-3 text-white font-semibold text-sm">
                Nguyễn Duy
              </div>
            </div>

            <div className="relative min-w-32 h-48 rounded-lg overflow-hidden bg-gray-300 cursor-pointer shadow">
              <img src="/api/placeholder/128/200" alt="Story" className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 w-9 h-9 rounded-full border-4 border-blue-500 overflow-hidden">
                <img src="/api/placeholder/36/36" alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-3 left-3 text-white font-semibold text-sm">
                Dung Thủy
              </div>
            </div>

            <div className="relative min-w-32 h-48 rounded-lg overflow-hidden bg-gray-300 cursor-pointer shadow">
              <img src="/api/placeholder/128/200" alt="Story" className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 w-9 h-9 rounded-full border-4 border-blue-500 overflow-hidden">
                <img src="/api/placeholder/36/36" alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-3 left-3 text-white font-semibold text-sm">
                Hồng Hoa
              </div>
            </div>

            <div className="relative min-w-32 h-48 rounded-lg overflow-hidden bg-gray-300 cursor-pointer shadow">
              <img src="/api/placeholder/128/200" alt="Story" className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 w-9 h-9 rounded-full border-4 border-blue-500 overflow-hidden">
                <img src="/api/placeholder/36/36" alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-3 left-3 text-white font-semibold text-sm">
                Nguyễn Duy Hoàng
              </div>
            </div>

            <div className="relative min-w-32 h-48 rounded-lg overflow-hidden bg-gray-300 cursor-pointer shadow">
              <img src="/api/placeholder/128/200" alt="Story" className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 w-9 h-9 rounded-full border-4 border-blue-500 overflow-hidden">
                <img src="/api/placeholder/36/36" alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-3 left-3 text-white font-semibold text-sm">
                Nguyễn Thị Doanh
              </div>
            </div>
          </div>

          {/* Create Post */}
          <div className="bg-white rounded-lg shadow mb-4 p-3">
            <div className="flex items-center pb-3 border-b border-gray-300">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-2">
                <img src="/api/placeholder/40/40" alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-gray-500">
                Duy ơi, bạn đang nghĩ gì thế?
              </div>
            </div>
            <div className="flex justify-between mt-3">
              <div className="flex items-center justify-center flex-1 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                <svg className="w-6 h-6 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.5 1.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm-9 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                </svg>
                <span className="text-gray-600">Video trực tiếp</span>
              </div>
              <div className="flex items-center justify-center flex-1 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                <svg className="w-6 h-6 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600">Ảnh/video</span>
              </div>
              <div className="flex items-center justify-center flex-1 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                <svg className="w-6 h-6 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600">Cảm xúc/hoạt động</span>
              </div>
            </div>
          </div>

          {/* Post */}
          <div className="bg-white rounded-lg shadow mb-4">
            <div className="p-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-2">
                    <img src="/api/placeholder/40/40" alt="Post author" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-semibold">Truc Vân</div>
                    <div className="text-xs text-gray-500">6 giờ</div>
                  </div>
                </div>
                <div className="flex text-gray-500">
                  <button className="p-1">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </button>
                  <button className="p-1">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <p>Một Chút Dang Yêu Mỗi Ngày</p>
                <p className="text-sm text-gray-500">Nhờ cộng đồng chỉnh ảnh và kết quả :</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <img src="/api/placeholder/300/300" alt="Post image" className="w-full h-full object-cover" />
              <img src="/api/placeholder/300/300" alt="Post image" className="w-full h-full object-cover" />
              <img src="/api/placeholder/300/300" alt="Post image" className="w-full h-full object-cover" />
              <img src="/api/placeholder/300/300" alt="Post image" className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <div className="flex justify-between text-gray-500 text-sm pb-2 border-b border-gray-300">
                <div className="flex items-center">
                  <span className="bg-blue-500 rounded-full p-1 mr-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span>368</span>
                </div>
                <div>42 bình luận · 12 lượt chia sẻ</div>
              </div>
              <div className="flex justify-between py-2">
                <div className="flex-1 flex items-center justify-center p-1 rounded-md hover:bg-gray-100 cursor-pointer">
                  <svg className="w-5 h-5 text-gray-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  <span className="text-gray-600">Thích</span>
                </div>
                <div className="flex-1 flex items-center justify-center p-1 rounded-md hover:bg-gray-100 cursor-pointer">
                  <svg className="w-5 h-5 text-gray-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">Bình luận</span>
                </div>
                <div className="flex-1 flex items-center justify-center p-1 rounded-md hover:bg-gray-100 cursor-pointer">
                  <svg className="w-5 h-5 text-gray-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  <span className="text-gray-600">Chia sẻ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-1/4 p-4 hidden lg:block">
          {/* Bạn có thể thêm nội dung Sidebar bên phải ở đây nếu cần */}
        </div>
      </div> {/* Đóng div.flex.flex-1 */}
    </div>     {/* Đóng div.flex.flex-col */ }
  );
}