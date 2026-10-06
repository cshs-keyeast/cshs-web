'use client';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { FieldChangeHandlerContext } from '@mui/x-date-pickers/internals';

export default function Input({ type = 'text', value, disabled = false, fn, autoFocus = false, placeholder }:{ type?:'text' | 'number' | 'password', value?:string | number, disabled?:boolean, fn?(value:string | number):void, autoFocus?:boolean, placeholder?:string }) {
  return (
    <input type={type} autoFocus={autoFocus} value={value} disabled={disabled} placeholder={placeholder} className="w-full max-w-[400px] h-[55px] rounded-2xl hover:border-gray-300 focus:border-blue-500 transition-all px-4 outline-none border-2 border-lightgray-100" onChange={(e) => {
      if(type === 'number' && !isNaN(+e.target.value)) {
        fn && fn(+e.target.value);
      } else fn && fn(e.target.value);
    }} />
  );
};

export function InputButton({ value, disabled = false, fn }:{ value?:string | number, disabled?:boolean, fn?():void }) {
  return (
    <div onClick={() => fn && fn()} className="w-full max-w-[400px] h-[55px] cursor-pointer rounded-2xl hover:border-gray-300 focus:border-blue-500 transition-all px-4 outline-none border-2 border-lightgray-100 flex items-center">
      <div>{value}</div>
    </div>
  );
};

export function Textarea({ type = 'text', value, disabled = false, fn, placeholder, full = false, color = 'blue', height = 'h-[105px]' }:{ type?:'text' | 'number', value?:string | number, disabled?:boolean, fn?(value:string | number):void, placeholder?:string, full?:boolean, color?:'blue' | 'teal', height?:string }) {
  return (
    <textarea placeholder={placeholder} value={value} disabled={disabled} className={`w-full resize-none ${height} rounded-2xl hover:border-gray-300 focus:border-${color}-500 transition-all py-3 p-4 outline-none border-2 border-lightgray-100 ${full ? '' : 'max-w-[400px]'}'}`} onChange={(e) => {
      if(type === 'number' && !isNaN(+e.target.value)) {
        fn && fn(+e.target.value);
      } else fn && fn(e.target.value);
    }} />
  );
};

export function DateInput({ value, disabled = false, disablePast = false, fn }:{ value?:Date, disabled?:boolean, disablePast?:boolean, fn?(value:Date):void }) {
  // disablePast가 true일 때만 오늘 날짜를 최소 날짜로 설정
  const today = dayjs().startOf('day');
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
      <StaticDatePicker 
        minDate={disablePast ? today : undefined}
        slots={{
          actionBar: undefined,
          toolbar: undefined
        }} slotProps={{
          actionBar: {
            actions: [],
          },
          day: {
            sx: {
              "&.MuiPickersDay-root.Mui-selected": {
                backgroundColor: "#3b82f6",
              }
            }
          },
          yearButton: {
            sx: {
              "&.MuiPickersYear-root.Mui-selected": {
                backgroundColor: "#3b82f6",
              },
              "&.MuiPickersYear-yearButton.Mui-selected": {
                backgroundColor: "#3b82f6",
              }
            }
          }
        }} onChange={(value:any) => fn && fn(new Date(value))} defaultValue={dayjs(value)}  />
    </LocalizationProvider>
  );
}