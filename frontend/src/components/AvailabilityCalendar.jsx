import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AvailabilityCalendar({ bookedDates = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Normalize booked dates to midnight for easy comparison
  const blockedRanges = bookedDates.map(b => ({
    start: new Date(new Date(b.start_date).setHours(0, 0, 0, 0)),
    end: new Date(new Date(b.end_date).setHours(0, 0, 0, 0))
  }));

  const isBooked = (day) => {
    const date = new Date(year, month, day);
    return blockedRanges.some(r => date >= r.start && date <= r.end);
  };

  const isPast = (day) => {
    const date = new Date(year, month, day);
    const today = new Date();
    today.setHours(0,0,0,0);
    return date < today;
  };

  return (
    <div className="glass p-8 rounded-2xl max-w-lg w-full">
      <div className="flex justify-between items-center mb-8">
        <h4 className="font-serif text-2xl text-white">{monthNames[month]} {year}</h4>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ChevronLeft className="w-5 h-5 text-white/70" /></button>
          <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ChevronRight className="w-5 h-5 text-white/70" /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayNames.map(d => (
          <div key={d} className="text-center text-[10px] uppercase tracking-widest text-white/40 font-bold py-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="h-12"></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const past = isPast(day);
          const booked = isBooked(day);
          const disabled = past || booked;

          return (
            <div 
              key={day} 
              className={`h-12 flex items-center justify-center text-sm rounded-xl transition-all font-medium
                ${disabled ? 'text-white/20' : 'text-white hover:bg-white/10 cursor-pointer'}
                ${booked ? 'bg-white/5 border border-white/5' : ''}
              `}
            >
              {day}
            </div>
          );
        })}
      </div>
      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-xs text-white/40 font-medium tracking-wide">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-white/5 border border-white/10"></div>
          <span className="uppercase tracking-widest text-[10px]">Booked</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full border border-white/20"></div>
          <span className="uppercase tracking-widest text-[10px]">Available</span>
        </div>
      </div>
    </div>
  );
}
