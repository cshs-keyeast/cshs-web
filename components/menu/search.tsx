'use client';

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Modal from "@components/modal";
import { useAppDispatch } from "@libs/client/redux/hooks";
import { setNotification } from "@libs/client/redux/notification";
import { Textarea } from "@components/input";
import { Tooltip } from "@node_modules/@mui/material";
import Button from "@components/button";
import Link from "next/link";

export default function SearchMenu() {
  const [searchModal, setSearchModal] = useState(false);
  const [search, setSearch] = useState("");

  const [feedbackModal, setFeedbackModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const dispatch = useAppDispatch();

  async function sendFeedback() {
    if(loading) return;

    if(feedback.length <= 0) {
      return dispatch(setNotification({ type: "error", text: "의견을 입력해주세요" }));
    }
    if(feedback.length > 500) {
      return dispatch(setNotification({ type: "error", text: "의견은 500자 이하여야 해요" }));
    }

    setLoading(true);
    await fetch(`/api/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: feedback
      })
    })
    .then((response) => response.json())
    .then((response) => {
      setLoading(false);
      if(response.success === true) {
        setFeedbackModal(false);
        dispatch(setNotification({ type: 'success', text: '의견이 전송되었습니다' }));
      }
    });
  }

  return (
    <>
      <AnimatePresence initial={false} mode="wait">
        { searchModal && <Modal handleClose={() => setSearchModal(false)}>
          <div className="w-[550px] h-[255px] relative">
            {/* <div className="flex items-center space-x-3">
              <svg className="stroke-lightgray-200 w-7 h-7" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input placeholder="빠른 검색하기" className="outline-none w-full h-[30px] text-xl" />
            </div>
            <div className="w-full h-[1px] mb-3 bg-lightgray-100 mt-4"></div>
            <div className="flex items-center justify-between px-2 py-3 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
              <div className="flex">
                전자현미경 예약 - 예약하기
              </div>
              <div className="text-lightgray-200">
                최근 검색
              </div>
            </div>
            <div className="flex items-center justify-between px-2 py-3 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
              <div className="flex">
                ESG 영상 인기투표 - 설문조사
              </div>
              <div className="text-lightgray-200">
                최근 검색
              </div>
            </div>
            <div className="flex items-center justify-between px-2 py-3 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
              <div className="flex">
                '창의체험전 준비' - 활동 승인
              </div>
              <div className="text-lightgray-200">
                최근 검색
              </div>
            </div>
            <div className="flex items-center justify-between px-2 py-3 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
              <div className="flex">
                'R&E' - 활동 승인
              </div>
              <div className="text-lightgray-200">
                최근 검색
              </div>
            </div> */}
            <div className="flex flex-col items-center justify-center w-full h-full absolute text-lightgray-200">
              <svg className="w-10 h-10" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <div className="font-bold text-base mt-1">기능을 준비하고 있습니다</div>
              <div className="mt-1 text-sm text-center">곧 해당 기능을 만나보실 수 있도록 준비중이에요<br/>해당 기능이 준비되면 알림으로 알려드릴게요</div>
            </div>
          </div>
        </Modal> }
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait">
        { feedbackModal && <Modal handleClose={() => setFeedbackModal(false)}>
          <div className="w-full md:w-[380px] h-[520px]">
            <div className="flex justify-end">
              <div onClick={() => setFeedbackModal(false)} className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer">
                <svg className="w-6 h-6 p-1 rounded-full stroke-gray-400" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col justify-between h-full pb-8">
              <div>
                <div className='w-full space-x-2 flex items-start py-2 px-3 rounded-xl bg-gray-100 transition-all mt-5 mb-5'>
                  <div className='text-2xl tossface'>🗂️</div>
                  <div>
                    <div className='text-lightgray-200 text-sm'>
                      '청원 보내기'는 학생회 청원부에서 관리하고 있습니다.<br/>학교를 변화시킬 좋은 의견을 기다립니다.<br/>
                    </div>
                  </div>
                </div>
                <div className="mb-1">어떤 의견이 있으신가요?</div>
                <Textarea placeholder="의견을 입력해주세요" fn={(value:string) => setFeedback(value)} />
              </div>
              <div>
                <div className="flex items-center w-full justify-center mb-5">
                  <Tooltip title="이 정보는 전송한 사용자를 식별할 수 없도록 별도의 저장소에 저장되므로 익명이 보장됩니다." placement="top" arrow>
                    <div className="bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors p-1 rounded-full flex items-center px-2 space-x-1">
                      <svg className="w-5 h-5 stroke-gray-400" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                      <div className="text-sm text-gray-400">이 정보는 익명으로 전송됩니다</div>
                    </div>
                  </Tooltip>
                </div>
                <Button color="blue" loading={loading} fn={() => sendFeedback()}>
                  의견 보내기
                </Button>
              </div>
            </div>
          </div>
        </Modal> }
      </AnimatePresence>
      <Link href="/d/petitions">
        <div onClick={() => {
        }} className="px-4 py-[10px] xl:flex hidden transition-all rounded-xl items-center justify-between cursor-pointer hover:bg-gray-100 active:bg-gray-200">
          <div className="flex items-center space-x-3">
            <svg className="stroke-lightgray-300 w-6 h-6" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
            </svg>
            <div className="text-[17.5px] font-bold text-lightgray-300">청원 게시판</div>
          </div>
        </div>
      </Link>
      <Link href="/d/petitions">
        <div onClick={() => {
        }} className="px-3 justify-center py-[10px] xl:hidden transition-all rounded-xl flex items-center cursor-pointer hover:bg-gray-100 active:bg-gray-200 w-[50px]">
          <div className="flex items-center space-x-3">
            <svg className="stroke-lightgray-300 w-6 h-6" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
            </svg>
          </div>
        </div>
      </Link>
      {/*<Link href="http://10.15.150.20:8888/68267cfd-7e11-448c-af27-c1c1bca759ad/-------------------39a74ba6-478a-4f41-ad54-3f19a0b5c6b6" target="_blank">
        <div onClick={() => {
        }} className="px-4 py-[10px] xl:flex hidden transition-all rounded-xl items-center justify-between cursor-pointer hover:bg-gray-100 active:bg-gray-200">
          <div className="flex items-center space-x-3">
            <svg className="stroke-lightgray-300 w-6 h-6" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
            <div className="text-[17.5px] font-bold text-lightgray-300">이용 가이드</div>
          </div>
        </div>
      </Link>
      <Link href="http://10.15.150.20:8888/68267cfd-7e11-448c-af27-c1c1bca759ad/-------------------39a74ba6-478a-4f41-ad54-3f19a0b5c6b6" target="_blank">
        <div onClick={() => {
        }} className="px-3 justify-center py-[10px] xl:hidden transition-all rounded-xl flex items-center cursor-pointer hover:bg-gray-100 active:bg-gray-200 w-[50px]">
          <div className="flex items-center space-x-3">
            <svg className="stroke-lightgray-300 w-6 h-6" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
        </div>
      </Link>*/}
    </>
  )
}
