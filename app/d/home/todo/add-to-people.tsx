'use client';

import Button, { CircleButton, SubButton } from "@components/button";
import Input, { DateInput, InputButton, Textarea } from "@components/input";
import Modal from "@components/modal";
import { setNotification } from "@libs/client/redux/notification";
import displayDate from "@libs/client/time-display";
import dayjs from "dayjs";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { mutate } from "swr";
import SelectMember from "@components/member";
import Switch from "@components/switch";

export default function AddToMeButton() {
  const [modal, setModal] = useState(false);
  const [dateModal, setDateModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  async function postTodo() {
    if(loading) return;

    if(title.length <= 0 || title.length > 20) {
      return dispatch(setNotification({ type: "error", text: "제목은 비어있거나 20자 이상일 수 없어요" }));
    }
    if(selected.length <= 0) {
      return dispatch(setNotification({ type: "error", text: "한 명 이상의 구성원을 선택하세요" }));
    }
    if(description.length <= 0 || description.length > 300) {
      return dispatch(setNotification({ type: "error", text: "설명은 비어있거나 300자 이상일 수 없어요" }));
    }

    setLoading(true);
    await fetch(`/api/user/todo/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        deadline: date,
        title,
        description,
        to: selected.map((member) => member.id),
        toMe
      })
    })
    .then((response) => response.json())
    .then((response) => {
      setLoading(false);
      if(response.success === true) {
        dispatch(setNotification({ type: "success", text: '할 일을 보냈어요' }));
        mutate('/api/user/todo/send?')
        setModal(false);
        setDateModal(false);
      } else {
        dispatch(setNotification({ type: "error", text: response.message }));
      }
    });
  }

  const [memberModal, setMemberModal] = useState(false);
  const [selected, setSelected] = useState<{ id: number; class: number; grade: number; number: number; profile: string; name: string; }[]>([]);
  const [toMe, setToMe] = useState(false);

  return (
    <div>
      <AnimatePresence initial={false} mode="wait">
        { memberModal && <Modal handleClose={() => {
          setMemberModal(false);
          setTimeout(() => {
            setModal(true);
          }, 150);
        }}>
          <SelectMember selected={selected} fn={(selected) => {
            setSelected(selected);
            setMemberModal(false);
            setTimeout(() => {
              setModal(true);
            }, 150);
          }} />
        </Modal> }
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait">
        { modal && <Modal scroll handleClose={() => setModal(false)}>
          <div className="w-full md:w-[380px] h-[520px]">
            <AnimatePresence initial={false} mode="wait">
              { dateModal && <Modal modalType="left" backdropType="transparent" handleClose={() => setDateModal(false)}>
                <div className="w-full md:w-[320px] h-[340px] -m-4">
                  <div className="flex flex-col justify-center md:justify-between h-full">
                    <div>
                      <DateInput value={date} fn={setDate} />
                    </div>
                  </div>
                </div>
              </Modal> }
            </AnimatePresence>
            <div className="flex justify-end">
              <div onClick={() => setModal(false)} className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer">
                <svg className="w-6 h-6 p-1 rounded-full stroke-gray-400" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col justify-between h-full">
              <div className="pb-20">
                <div className="font-bold text-zinc-800 text-2xl mt-5">할 일 보내기</div>
                <div className="text-lightgray-200 text-base mt-1">다른 구성원이 해야 할 일을 추가하세요.<br/>잊지 않도록 알려드릴게요.</div>
                <div>
                  <div className="text-zinc-800 mb-1 mt-5">제목</div>
                  <Input value={title} placeholder="지구과학 수행평가 제출하기" autoFocus fn={(value:string) => setTitle(value)} />
                </div>
                <div>
                  <div className="text-zinc-800 mb-1 mt-5">구성원</div>
                  <InputButton value={ selected.length <= 0 ? '이곳을 눌러 선택하세요' : selected.length === 1 ? selected[0].name : selected.length === 2 ? `${selected[0].name}, ${selected[1].name}` : `${selected[0].name}, ${selected[1].name} 외 ${selected.length - 2}명` } fn={() => {
                    setModal(false);
                    setTimeout(() => {
                      setMemberModal(true);
                    }, 150);
                  }}/>
                  <div onClick={() => setToMe(!toMe)} className="flex space-x-2 items-center mt-2 cursor-pointer">
                    <Switch size="sm" active={toMe} />
                    <div className="text-sm text-gray-400">나에게도 추가하기</div>
                  </div>
                </div>
                <div>
                  <div className="text-zinc-800 mb-1 mt-5">마감일</div>
                  <InputButton value={displayDate(date, 'date')} fn={() => setDateModal(true)}/>
                </div>
                <div>
                  <div className="text-zinc-800 mb-1 mt-5">설명</div>
                  <Textarea value={description} placeholder="지구과학 학습지 12쪽까지 선생님께 제출" fn={(value:string) => setDescription(value)} />
                </div>
              </div>
            </div>
            <div className="absolute bottom-5 w-full right-0 left-0 pl-5 pr-5 md:pr-7">
              <div className="w-full md:w-[380px] h-8 bg-white -bottom-5 absolute"></div>
              <Button color="blue" loading={loading} fn={() => postTodo()}>
                보내기
              </Button>
            </div>
          </div>
        </Modal> }
      </AnimatePresence>
      <div className="md:block hidden">
        <SubButton color="blue" fn={() => {
          setDateModal(false);
          setDate(dayjs(new Date()).toDate());
          setTitle('');
          setDescription('');
          setSelected([]);
          setToMe(false);
          setModal(true);
        }}>
          <svg className="w-5 h-5 mr-2" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
          할 일 보내기
        </SubButton>
      </div>
      <div className="md:hidden block fixed bottom-20 right-4 z-30">
        <CircleButton color="blue" fn={() => {
          setDateModal(false);
          setDate(dayjs(new Date()).toDate());
          setTitle('');
          setDescription('');
          setSelected([]);
          setToMe(false);
          setModal(true);
        }}>
          <div className="mx-3">
            <svg className="w-6 h-6 m-[5px]" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </div>
        </CircleButton>
      </div>
    </div>
  )
}