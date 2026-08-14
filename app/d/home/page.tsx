import Menu from "@components/menu";
import Image from "next/image";
import Link from "next/link";
import Todo from "./todo-this-week";
import MainText from "./text";
import SideBar from "./sidebar";
import type { Metadata } from 'next'
import MobileBottomMenu from "@components/menu/mobile";
import NotificationMenu from "@components/menu/notification";
 
export const metadata:Metadata = {
  title: '홈 피드',
}

export default function Home() {
  return (
    <main className="md:flex w-full min-h-screen relative overflow-hidden">
      <div className="w-full z-20 fixed top-0 border-b border-lightgray-100 py-2 px-5 md:hidden flex items-center justify-between backdrop-blur-lg bg-white/70">
        <div>
          <Image
            src={ '/images/logo.png' }
            width={40}
            height={40}
            alt=""
          />
        </div>
        <div>
          <NotificationMenu/>
        </div>
      </div>
      <Menu/>
      <div className="w-full absolute left-[320px] drop-shadow-2xl z-10 h-[100vh] bg-white md:block hidden"></div>
      <div className="h-[100vh] bg-white z-10 w-full md:border-l-[1px] border-lightgray-100 p-5 md:p-10 overflow-auto">
        <div className="justify-between w-full mb-8 md:flex hidden">
          <div className="flex space-x-7 h-[46px] items-center">
            <Link href='/d/home'>
              <div className="font-bold text-3xl text-zinc-800 cursor-pointer">피드</div>
            </Link>
            {/* <Link href='/d/home/notice'>
              <div className="font-bold text-3xl text-lightgray-100 cursor-pointer">학교 소식</div>
            </Link> */}
            <Link href='/d/home/todo'>
              <div className="font-bold text-3xl text-lightgray-100 cursor-pointer">할 일</div>
            </Link>
          </div>
        </div>
        <div className="w-full h-[1px] my-5 bg-lightgray-100 xl:block hidden"></div>
        <MobileBottomMenu/>
        <div className="md:mt-8 mt-16 flex justify-between space-x-5">
          <div className="w-full">
            <div className="md:block hidden">
              <MainText/>
            </div>
            <div className="space-y-0 mt-0 md:mt-0 mt-0- md:min-h-[100vh]">
              <Todo/>
            </div>
            <div className="md:hidden block">
              <SideBar/>
            </div>
          </div>
          <div className="w-[350px] space-y-3 md:block hidden">
            {/* <div className="border border-lightgray-100 rounded-2xl w-[350px] px-5 py-5">
              <div className="font-bold text-zinc-800">시간표</div>
              <div className="flex justify-between px-2 text-sm mb-2 text-center">
                <div className="text-lightgray-200 mt-2">1교시<div className="text-base font-bold">통과</div></div>
                <div className="text-blue-500 font-bold mt-2">2교시<div className="text-base font-bold">통과</div></div>
                <div className="text-lightgray-200 mt-2">3교시<div className="text-base font-bold">영어</div></div>
                <div className="text-lightgray-200 mt-2">4교시<div className="text-base font-bold">영어</div></div>
                <div className="text-lightgray-200 mt-2">5교시<div className="text-base font-bold">진로</div></div>
                <div className="text-lightgray-200 mt-2">6교시<div className="text-base font-bold">운동</div></div>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full">
                <div className="w-[25%] h-2 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <div className="border border-lightgray-100 rounded-2xl w-[350px] px-5 py-5">
              <div className="font-bold text-zinc-800">학사일정</div>
              <div className="text-lightgray-200 mt-2">없음</div>
            </div>
            <div className="border border-lightgray-100 rounded-2xl w-[350px] px-5 py-5">
              <div className="font-bold text-zinc-800">급식</div>
              <div className="text-lightgray-200 mt-2">없음</div>
            </div> */}
            <SideBar/>
          </div>
        </div>
        <div className="mt-20 text-lightgray-200 text-sm md:mb-0 mb-20">
          <div>
            <div className="flex items-start space-x-1">
              <div>
                개발: 
              </div>
              <div>
                14기 - 최지환
              </div>
            </div>
            <div className="flex items-start space-x-1">
              <div>
                운영: 
              </div>
              <div>
                13기 - 김준희, 박찬경, 이재준<br/>
                14기 - 성인혁, 지민겸<br/>
                15기 - 권승찬<br/>
                16기 - 안준표, 양서연, 유지호
              </div>
            </div><br/><br/>
            창원과학고등학교 전자 활동 승인서
          </div>
        </div>
      </div>
    </main>
  );
}
