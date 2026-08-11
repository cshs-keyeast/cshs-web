'use client';

import { OpacityAnimation } from "@components/animation";
import Loading from "@components/loading";
import MobileBottomMenu from "@components/menu/mobile";
import ProfileMenu from "@components/menu/profile";
import Link from "next/link";

export default function Code() {
  return (
    <div>
      <MobileBottomMenu/>
      <OpacityAnimation>
        <ProfileMenu/>
        {/* <div className="flex items-center justify-center flex-col w-[100vw] h-[100vh]">
          <div className="text-center text-zinc-800 font-bold text-2xl md:text-3xl">전자 활동 승인서 모바일</div>
          <div className="text-center text-lightgray-200">ⓒ 2025. JiHwan Choi. all rights reserved.</div>
        </div> */}
        <div className="px-5">
          <Link href='/d/petitions'>
            <div className="bg-teal-100 text-teal-500 px-4 py-2 rounded-xl my-10 flex justify-between items-center cursor-pointer">
              학생 청원 게시판 바로가기
              <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </div>
          </Link>
        </div>
        <div className="fixed text-lightgray-200 text-sm bottom-20 px-5">
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
                16기 - 안준표, 양서연
    
              </div>
            </div><br/><br/>
            창원과학고등학교 전자 활동 승인서
          </div>
        </div>
      </OpacityAnimation>
    </div>
  );
}
