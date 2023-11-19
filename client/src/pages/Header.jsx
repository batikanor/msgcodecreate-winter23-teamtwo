export default function Header() {
  return (
      <header className="p-4 flex justify-between items-center h-full"> {/* Ensure full height */}
          <a href="" className="flex items-center justify-center gap-1 h-full"> {/* Center items vertically and horizontally */}
              <img src={"https://i.imgur.com/oNc6ARX.png"} alt="Logo" className="w-32 h-32" />
              <span className="font-bold text-3xl p-2">Money Monitor</span>
          </a>
          <div className="flex gap-2 border border-gray-300 rounded-full py-2 px-4 shadow-md shadow-gray-300">
              {/* SVG and other elements remain unchanged */}
          </div>
      </header>
  )
}
