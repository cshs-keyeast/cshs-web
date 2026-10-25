'use client'

import Modal from "@components/modal";
import useSWR, { mutate } from "swr";
import { setNotification } from "@libs/client/redux/notification";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CircleButton, SubButton } from "@components/button";
import Button from "@components/button";
import Input from "@components/input";
import {Textarea} from "@components/input";

export default function AddAnnouncementButton(data) {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const dispatch = useDispatch();
  
  const grade = data.grade;
  
  function resetForm() {
    setTitle('');
    setContent('');
  }

  async function postAnnounce() {
    if(loading) return;

    if(title.length <= 0) {
      return dispatch(setNotification({ type: "error", text: "제목은 비어있을 수 없어요." }));
    }

    if(content.length <= 0) {
      return dispatch(setNotification({ type: "error", text: "내용은 비어있을 수 없어요."}));
    }

    setLoading(true);
    await fetch("/api/announcement", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        content,
        grade
      })
    })
    .then((response) => response.json())
    .then((response) => {
      setLoading(false);
      if(response.success === true) {
        dispatch(setNotification({ type: "success", text: "" }));
        setModal(false);
      }
    })
  }

  return (
    <div>
      <AnimatePresence initial={false} mode="wait">
        { modal && <Modal handleClose={() => setModal(false)}>
          <div className="w-full md:w-[380px] h-[520px]">
            <div className="flex justify-between items-center">
              <div onClick={resetForm} className="text-sm text-lightgray-200 hover:text-zinc-800 transition-colors cursor-pointer">
                입력 내용 초기화
              </div>
              <div onClick={() => setModal(false)} className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer">
                <svg className="w-6 h-6 p-1 rounded-full stroke-gray-400" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col justify-between h-full">
              <div className="pb-20">
                <div className="font-bold text-zinc-800 text-2xl mt-5">공지사항 작성하기</div>
                <div>
                  <div className="text-zinc-800 mb-1 mt-5">제목</div>
                  <Input value={title} placeholder="제목을 입력하세요" autoFocus fn={(value:string) => setTitle(value)} />
                </div>
                <div>
                  <div className="text-zinc-800 mb-1 mt-5">내용</div>
                  <Textarea height="h-[200px]" value={content} placeholder="내용을 입력하세요" fn={(value:string) => setContent(value)} />
                </div>
              </div>
            </div>
            <div className="absolute bottom-5 w-full right-0 left-0 pl-5 pr-5 md:pr-7">
              <div className="w-full md:w-[380px] h-8 bg-white -bottom-5 absolute"></div>
              <Button color="blue" loading={loading} fn={() => postAnnounce()}>
                공지하기
              </Button>
            </div>
          </div>
        </Modal>}
      </AnimatePresence>
      <div>
        <SubButton color="blue" fn={() => {
          setModal(true);
        }}>
          <div className="flex items-center ml-4 mr-5 space-x-1">
            <svg className="stroke-white w-6 h-6" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" />
            </svg>
            <div>
              공지사항 작성하기
            </div>
          </div>
        </SubButton>
      </div>
    </div>
  )
}