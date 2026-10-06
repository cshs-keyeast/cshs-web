'use client'

import Image from "next/image";
import Link from "next/link";
import Announcements from "./announcements";
import AddAnnouncementButton from "./add-announcement";
import MobileBottomMenu from "@components/menu/mobile";
import { useState } from "react";
import useSWR from "swr";

export default function AnnouncementPage() {
  const [grade, setGrade] = useState(1);
  const { data } = useSWR('/api/user');

  return (
    <div className="h-[100vh] bg-white z-10 w-full md:border-l-[1px] border-lightgray-100 p-5 md:p-10 overflow-auto">
      <div className="w-full mb-8 md:flex hidden justify-between">
        <div className="md:flex space-x-3 md:space-x-7 h-[46px] items-center">
          <div className="font-bold text-3xl text-zinc-800 cursor-pointer">공지사항</div>
        </div>
        {(data?.user.type === 1 || (Number(data?.user.admin) & 15) === 15) && <div className="flex">
          <div className="md:block flex md:h-[44px]">
            <AddAnnouncementButton grade={grade}/>
          </div>
        </div>}
        <MobileBottomMenu/>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex space-x-4 md:space-x-6">
          <div onClick={() => setGrade(1)} className={ grade === 1 ? "border-b-2 border-zinc-800 pb-3 cursor-pointer" : "border-b-0 border-zinc-800 pb-3 cursor-pointer" }>
            <div className={ grade === 1 ? "font-bold" : "font-bold text-lightgray-200" }>패치노트</div>
          </div>
          {/* <div onClick={() => setGrade(1)} className={ grade === 1 ? "border-b-2 border-zinc-800 pb-3 cursor-pointer" : "border-b-0 border-zinc-800 pb-3 cursor-pointer" }>
            <div className={ grade === 1 ? "font-bold" : "font-bold text-lightgray-200" }>1학년</div>
          </div>
          <div onClick={() => setGrade(2)} className={ grade === 2 ? "border-b-2 border-zinc-800 pb-3 cursor-pointer" : "border-b-0 border-zinc-800 pb-3 cursor-pointer" }>
            <div className={ grade === 2 ? "font-bold" : "font-bold text-lightgray-200" }>2학년</div>
          </div>
          <div onClick={() => setGrade(3)} className={ grade === 3 ? "border-b-2 border-zinc-800 pb-3 cursor-pointer" : "border-b-0 border-zinc-800 pb-3 cursor-pointer" }>
            <div className={ grade === 3 ? "font-bold" : "font-bold text-lightgray-200" }>3학년</div>
          </div> */}
          {/* 본래 1,2,3 학년으로 공지사항 탭이 구분되어있었습니다. 하지만 선생님들께서 구글 클래스룸을 주로 사용하시기 때문에 학년 구분을 없애고 패치노트를 중심으로 운영합니다. 다시 학년 구분이 필요하다면 위 주석을 풀고 announcements.tsx에 'const grade = input.grade;'를 추가하세요. */}
        </div>
      </div>
      <div className="w-full h-[1px] relative -top-5 my-5 bg-lightgray-100"></div>
      <Announcements grade={grade}/>
    </div>
  )
}