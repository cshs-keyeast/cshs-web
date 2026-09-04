'use client';

import Input, { DateInput, InputButton, Textarea } from "@components/input";
import { setNotification } from "@libs/client/redux/notification";
import { useEffect, useState } from "react";
import errorMessage from "@libs/client/error-message";
import { useAppDispatch, useAppSelector } from "@libs/client/redux/hooks";
import useSWR from "swr";
import { OpacityAnimation } from "@components/animation";
import Button from "@components/button";
import { AnimatePresence } from "framer-motion";
import Modal from "@components/modal";
import displayPerio, { isWeekend } from "@libs/client/perio-display";

export default function ActivityDetail({ data, fn }:{ data:any, fn():void }) {

  const dispatch = useAppDispatch();
  const { data:user } = useSWR('/api/user');

  const [loading, setLoading] = useState(false);
  async function deleteActivity() {
    if(loading) return;
    setLoading(true);

    await fetch(`/api/activity`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: data.id
      })
    })
    .then((response) => response.json())
    .then((response) => {
      setLoading(false);
      if(response.success === true) {
        fn();
        dispatch(setNotification({ type: 'success', text: '해당 내역을 삭제했어요' }));
        if(data?.mutateActivity) data?.mutateActivity();
        else location.reload();
      } else {
        dispatch(setNotification({ type: 'error', text: errorMessage.unknown }));
      }
    });
  }
  
  const [fullMemberModal, setFullMemberModal] = useState(false);

  const userInfo = useAppSelector(state => state.userInfo);

  // 승인하기 버튼 로직 추가
  const [approveLoading, setApproveLoading] = useState(false);
  async function approveActivity() {
    if (approveLoading) return;
    setApproveLoading(true);
    await fetch(`/api/activity/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: data.id })
    })
    .then(res => res.json())
    .then(res => {
      setApproveLoading(false);
      if (res.success) {
        dispatch(setNotification({ type: 'success', text: '해당 활동을 승인했습니다' }));
        if(data?.mutateActivity) data?.mutateActivity();
        fn();
      } else {
        dispatch(setNotification({ type: 'error', text: res.message || '승인에 실패했습니다.' }));
      }
    });
  }

  // 승인 취소 버튼 로직 추가
  const [cancelApproveLoading, setCancelApproveLoading] = useState(false);
  async function cancelApproveActivity() {
    if (cancelApproveLoading) return;
    setCancelApproveLoading(true);
    await fetch(`/api/activity/cancel-approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: data.id })
    })
    .then(res => res.json())
    .then(res => {
      setCancelApproveLoading(false);
      if (res.success) {
        dispatch(setNotification({ type: 'success', text: '승인이 취소되었습니다' }));
        if(data?.mutateActivity) data?.mutateActivity();
        fn();
      } else {
        dispatch(setNotification({ type: 'error', text: res.message || '승인 취소에 실패했습니다' }));
      }
    });
  }
  
  const [adminModal, setAdminModal] = useState(false);
  
  const [adminApproveLoading, setAdminApproveLoading] = useState(false);
  async function adminApproveActivity() {
    if (adminApproveLoading) return;
    setAdminApproveLoading(true);
    await fetch(`/api/activity/admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: data.id })
    })
    .then(res => res.json())
    .then(res => {
      setAdminApproveLoading(false);
      if (res.success) {
        dispatch(setNotification({ type: 'success', text: '해당 활동을 승인했습니다' }));
        if(data?.mutateActivity) data?.mutateActivity();
        fn();
      } else {
        dispatch(setNotification({ type: 'error', text: res.message || '승인에 실패했습니다.' }));
      }
    });
  }

  const [adminCancelApproveLoading, setAdminCancelApproveLoading] = useState(false);
  async function adminCancelApproveActivity() {
    if (adminCancelApproveLoading) return;
    setAdminCancelApproveLoading(true);
    await fetch(`/api/activity/admin/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: data.id })
    })
    .then(res => res.json())
    .then(res => {
      setAdminCancelApproveLoading(false);
      if (res.success) {
        dispatch(setNotification({ type: 'success', text: '승인이 취소되었습니다' }));
        if(data?.mutateActivity) data?.mutateActivity();
        fn();
      } else {
        dispatch(setNotification({ type: 'error', text: res.message || '승인 취소에 실패했습니다' }));
      }
    });
  }
  
  useEffect(() => {
    setTimeout(() => {
      if(user?.user.type === 1 && data?.relation.length > 0) {
        setFullMemberModal(true);
      }
    }, 200);
  }, [user]);

  return (
    <div>
      <AnimatePresence initial={false} mode="wait">
        { fullMemberModal && <Modal modalType="left" backdropType="transparent" handleClose={() => setFullMemberModal(false)}>
          <div className="w-full md:w-[320px] h-[340px] -m-4">
            <div className="flex flex-col h-full p-5 pr-3">
              <div className="font-bold text-sm text-gray-400 mb-3">구성원 모두 보기</div>
              <div className="custom-scroll overflow-auto">
                {
                  // 작성자 먼저 표시
                  <div key={data.writer.id} className="flex items-center space-x-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                      {data.writer.profile && <img src={data.writer.profile} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <div className="text-zinc-800 font-bold flex items-center">
                        {data.writer.name}
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-500 rounded-full text-xs">작성자</span>
                      </div>
                      <div className="text-gray-400 text-sm">{data.writer.grade}학년 {data.writer.class}반 {data.writer.number}번</div>
                    </div>
                  </div>
                }
                {
                  // 나머지 구성원 표시 (작성자 제외)
                  data.relation
                    .filter((relation: { user: { id: number } }) => relation.user.id !== data.writer.id)
                    .map((relation: { user: { id: number; profile: string; name: string, grade: number, class: number, number: number } }) => (
                      <div key={relation.user.id} className="flex items-center space-x-2 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                          {relation.user.profile && <img src={relation.user.profile} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <div className="text-zinc-800 font-bold">{relation.user.name}</div>
                          <div className="text-gray-400 text-sm">{relation.user.grade}학년 {relation.user.class}반 {relation.user.number}번</div>
                        </div>
                      </div>
                    ))
                }
              </div>
            </div>
          </div>
        </Modal> }
        { adminModal && <Modal modalType="left" backdropType="transparent" handleClose={() => setAdminModal(false)}>
          <div className="w-full md:w-[320px] h-[340px] -m-4">
            <div className="flex flex-col h-full p-5 pr-3">
              <div className="font-bold text-sm text-gray-400 mb-3">어드민 패널</div>
              <div className="custom-scroll overflow-auto">
                { data.status === 1 ? <div className="mt-4 absolute bottom-0 flex items-center flex-col right-7 left-5">
                  <div className="w-full relative z-10">
                    <Button color="red" loading={adminCancelApproveLoading} fn={adminCancelApproveActivity}>
                      <div className="w-full">승인 취소하기</div>
                    </Button>
                  </div>
                  <div className="h-7 w-full bg-white relative bottom-2"></div>
                </div> : <div className="mt-4 absolute bottom-0 flex items-center flex-col right-7 left-5">
                  <div className="w-full relative z-10">
                    <Button color="blue" loading={approveLoading} fn={adminApproveActivity}>
                      <div className="w-full">승인하기</div>
                    </Button>
                  </div>
                  <div className="h-7 w-full bg-white relative bottom-2"></div>
                </div> }
                {/* 구성원 변경 기능 추가 예정 */}
              </div>
            </div>
          </div>
        </Modal> }
      </AnimatePresence>
      { (location.href.includes("seat") && userInfo.type === 1) && <div onClick={() => data?.addTeacherActivity && data?.addTeacherActivity()} className="absolute -top-14 left-0 bg-blue-100 px-3 pl-4 p-3 rounded-xl transition-colors hover:bg-blue-200 flex items-center justify-between w-full space-x-2 text-blue-500 cursor-pointer">
        <div className="text-sm">해당 학생 결석, 지각, 외출 등 기록하기</div>
        <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </div> }
      <div className="w-full md:w-[380px] h-[520px]">
        <div className="flex justify-end">
          <div onClick={() => fn()} className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer">
            <svg className="w-6 h-6 p-1 rounded-full stroke-gray-400" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className="pb-0">
            <div className="flex justify-between items-end">
              <div>
                <div className="font-bold text-zinc-800 text-2xl mt-5">활동 승인 내역</div>
                <div className="flex mt-1">
                  { data.status === 2 && <div className="px-2 text-sm bg-yellow-500/10 text-yellow-500 rounded-lg">교사 기록</div> }
                  { data.status === 0 && <div className="px-2 text-sm bg-orange-500/10 text-orange-500 rounded-lg">승인 대기중</div> }
                  { data.status === 1 && <div className="px-2 text-sm bg-green-500/10 text-green-500 rounded-lg">승인됨</div> }
                </div>
              </div>
              <div className="flex space-x-1">
                { (user?.success === true && ((data.writer.id === user.user.id && data.status !== 2) || (data.teacher.id === user.user.id && data.status === 2))) && <OpacityAnimation>
                  <div onClick={() => deleteActivity()} className="w-7 h-7 bg-blue-500/20 hover:bg-blue-600/20 transition-colors cursor-pointer flex items-center justify-center rounded-lg">
                    <svg className="w-5 h-5 stroke-blue-500" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </div>
                </OpacityAnimation> }
              </div>
            </div>
            { data.status === 2 && <div className="text-yellow-500 bg-yellow-100 text-sm p-2 rounded-xl mt-5">
              해당 활동은 담당 교사가 기록한 것으로, 학생이 해당 기록을 임의로 삭제할 수 없습니다.
            </div> }
            <div>
              <div className="text-zinc-800 mb-1 mt-5">활동 내용</div>
              <Input value={data.content} disabled />
            </div>
            { data.status !== 2 && <div>
              <div className="text-zinc-800 mb-1 mt-5">활동 장소</div>
              <InputButton value={data.place.place}/>
            </div> }
            <div>
              <div className="text-zinc-800 mb-1 mt-5">활동 날짜</div>
              <InputButton value={data.date
                          ? data.date.replace(
                            /^(\d{4})(\d{2})(\d{2})$/,
                            "$1년 $2월 $3일"
                            )
                          : ""}/>
            </div>
            <div>
              <div className="text-zinc-800 mb-1 mt-5">활동 시간</div>
              <div className="flex rounded-full px-1 py-1 bg-gray-100">
                <div className={ data.perio.split(',').indexOf('1') === -1 ? "rounded-full w-[100px] py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-all text-sm" : `${data.perio.split(',').indexOf('2') === -1 ? 'rounded-full' : 'rounded-l-full'} w-[100px] py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer transition-all text-sm` }>{displayPerio(1, undefined, data.date)}</div>
                <div className={ data.perio.split(',').indexOf('2') === -1 ? "rounded-full w-[100px] py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-all text-sm" : `${data.perio.split(',').indexOf('1') === -1 && 'rounded-l-full'} ${data.perio.split(',').indexOf('3') === -1 && 'rounded-r-full'} w-[100px] py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer text-sm` }>{displayPerio(2, undefined, data.date)}</div>
                <div className={ data.perio.split(',').indexOf('3') === -1 ? "rounded-full w-[100px] py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-all text-sm" : `${data.perio.split(',').indexOf('2') === -1 && 'rounded-l-full'} ${data.perio.split(',').indexOf('4') === -1 && 'rounded-r-full'} w-[100px] py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer text-sm` }>{displayPerio(3, 2, data.date)}</div>
                <div className={ data.perio.split(',').indexOf('4') === -1 ? "rounded-full w-[100px] py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-all text-sm" : `${data.perio.split(',').indexOf('3') === -1 && 'rounded-l-full'} ${data.perio.split(',').indexOf('5') === -1 && 'rounded-r-full'} w-[100px] py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer text-sm` }>{displayPerio(4, 2, data.date)}</div>
                { !isWeekend(data.date) &&  <div className={ data.perio.split(',').indexOf('5') === -1 ? "rounded-full w-[100px] py-2 text-lightgray-200 text-center cursor-pointer hover:bg-gray-200 transition-all text-sm" : `${data.perio.split(',').indexOf('4') === -1 ? 'rounded-full' : 'rounded-r-full'} w-[100px] py-2 bg-white font-bold text-zinc-800 text-center cursor-pointer transition-all text-sm` }>야자 3</div> }
              </div>
            </div>
            <div className="mb-3">
              <div className="text-zinc-800 mb-1 mt-5">구성원</div>
              <InputButton
                fn={() => data.relation.length > 0 && setFullMemberModal(true)}
                value={
                  (() => {
                    const writerName = data.writer?.name || '';
                    const memberNames = data.relation.map((r: any) => r.user.name);
                    if (memberNames.length === 0) return writerName;
                    if (memberNames.length === 1) return `${writerName}, ${memberNames[0]}`;
                    if (memberNames.length === 2) return `${writerName}, ${memberNames[0]}, ${memberNames[1]}`;
                    return `${writerName}, ${memberNames[0]}, ${memberNames[1]} 외 ${memberNames.length - 2}명`;
                  })()
                }
              />
            </div>
            <div className="mb-3">
              <div className="text-zinc-800 mb-1 mt-5">담당 교사</div>
              <InputButton value={ data.teacher.name }/>
            </div>
            {/* 승인하기 버튼 추가 */}
            {user?.success === true && data.status === 0 && user.user.name === data.teacher.name && <div className="w-full h-20"></div> }
            {user?.success === true && data.status === 0 && user.user.name === data.teacher.name && (
              <div className="mt-4 absolute bottom-0 flex items-center flex-col right-7 left-5">
                <div className="w-full relative z-10">
                  <Button color="blue" loading={approveLoading} fn={approveActivity}>
                    <div className="w-full">승인하기</div>
                  </Button>
                </div>
                <div className="h-7 w-full bg-white relative bottom-2"></div>
              </div>
            )}
            {user?.success === true && data.status === 1 && user.user.name === data.teacher.name && <div className="w-full h-20"></div> }
            {user?.success === true && data.status === 1 && user.user.name === data.teacher.name && (
              <div className="mt-4 absolute bottom-0 flex items-center flex-col right-7 left-5">
                <div className="w-full relative z-10">
                  <Button color="red" loading={cancelApproveLoading} fn={cancelApproveActivity}>
                    <div className="w-full">승인 취소하기</div>
                  </Button>
                </div>
                <div className="h-7 w-full bg-white relative bottom-2"></div>
              </div>
            )}
            { (Number(user.user.admin) & 2) === 2 && <div className="w-full h-20"></div> }
            { (Number(user.user.admin) & 2) === 2 && (
              <div className="mt-4 absolute bottom-0 flex items-center flex-col right-7 left-5">
                <div className="w-full relative z-10">
                  {/* <Button color="lightblue" fn={() => setAdminModal(true)}>
                    <div className="w-full">어드민 패널</div>
                  </Button> */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}