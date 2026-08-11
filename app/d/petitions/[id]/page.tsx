'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@libs/client/redux/hooks";
import { setNotification } from "@libs/client/redux/notification";
import Button, { SubButton } from "@components/button";
import { OpacityAnimation } from "@components/animation";
import Loading from "@components/loading";
import displayDate from "@libs/client/time-display";
import { AnimatePresence } from "framer-motion";
import Modal from "@components/modal";
import PetitionModal from "@components/info/petition";

export default function PetitionDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSupporting, setIsSupporting] = useState(false);

  const { data: petition } = useSWR(`/api/petitions/${params.id}`);
  const { data: supportData } = useSWR(`/api/petitions/${params.id}/support`);

  const targetCount = 126; // 목표 동의 수
  const percent = Math.round(((petition?.supportCount || 0) / targetCount) * 100);
  const closed = new Date(petition?.expiresAt) < new Date() || percent >= 100;

  const handleSupport = async () => {
    if (isSupporting) return;
    try {
      setIsSupporting(true);
      const res = await fetch(`/api/petitions/${params.id}/support`, {
        method: "POST",
      });
      const data = await res.json();
      
      if (data.success) {
        dispatch(setNotification({ text: data.message, type: 'success' }));
        mutate(`/api/petitions/${params.id}`);
        mutate(`/api/petitions/${params.id}/support`);
      } else {
        dispatch(setNotification({ text: data.message || "오류가 발생했습니다.", type: 'error' }));
      }
    } catch (error) {
      dispatch(setNotification({ text: "오류가 발생했습니다.", type: 'error' }));
    } finally {
      setIsSupporting(false);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      const res = await fetch("/api/petitions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: Number(params.id), status }),
      });
      const data = await res.json();
      
      if (data.success) {
        dispatch(setNotification({ text: "청원 상태가 변경되었습니다.", type: 'success' }));
        mutate(`/api/petitions/${params.id}`);
      } else {
        dispatch(setNotification({ text: data.message || "오류가 발생했습니다.", type: 'error' }));
      }
    } catch (error) {
      dispatch(setNotification({ text: "오류가 발생했습니다.", type: 'error' }));
    }
  };

  if (!petition) return <div className="fixed top-0 bottom-0 left-0 right-0">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-teal-500">
      <Loading size={35} />
    </div>
  </div>;

  return (
    <div>
      <div className="fixed top-0 bottom-0 left-0 right-0 overflow-auto px-5">
        <OpacityAnimation>
          <div className="max-w-3xl mx-auto z-30 py-10 md:py-20">
            {/* 헤더 영역 */}
            <div className="mb-8">
              <div className="flex md:flex-row flex-col md:items-center items-start md:space-y-0 space-y-2 justify-between mb-2">
                <h1 className="text-3xl font-bold break-words">{petition.title}</h1>
              </div>
              <div className="min-w-20 flex mb-4">
                <div className={`px-3 py-1 rounded-full text-sm ${
                  closed ? 'bg-gray-100 text-gray-700' : 'bg-teal-100 text-teal-700'
                }`}>
                  {closed ? '종료됨' : '진행중'}
                </div>
              </div>
              <div className="text-sm text-zinc-500">
                {/* <div>작성자: {petition.writer.name} ({petition.writer.grade}{petition.writer.class}{String(petition.writer.number).padStart(2, '0')})</div> */}
                <div>작성일: {displayDate(petition.createdAt, 'date')}</div>
                <div>마감일: {displayDate(petition.expiresAt, 'date')}</div>
              </div>
            </div>
            {(new Date(petition?.expiresAt) < new Date() && percent >= 100 && !petition?.response) && <div className="w-full px-4 py-2 bg-teal-100 rounded-lg mb-3 text-teal-500 font-semibold">청원 동의가 100%에 도달하여 담당자/담당부서의 답변을 기다리고 있습니다.</div>}
            {petition?.response && <div className="w-full px-4 py-3 bg-teal-50 rounded-lg mb-3 text-teal-500 font-semibold break-words">
              <div className="text-base font-bold">청원에 대한 답변</div>
              <div className="font-medium">{petition.response}</div>
            </div>}

            {/* 동의 현황 */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">청원 동의 현황</div>
                <div className="font-bold">{percent}%</div>
              </div>
              <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full transition-all ${closed ? 'bg-teal-500' : 'bg-teal-500'}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="text-sm text-zinc-600">
                {petition.supportCount.toLocaleString()} / {targetCount.toLocaleString()}명 동의
              </div>
            </div>

            <div className="mb-8">
              <div className="font-bold text-lg">청원 취지</div>
              <div className="prose max-w-none break-words whitespace-pre-wrap">
                {petition.reason}
              </div>
            </div>
            <div className="mb-8">
              <div className="font-bold text-lg">청원 내용</div>
              <div className="prose max-w-none break-words whitespace-pre-wrap">
                {petition.content}
              </div>
            </div>

            {/* 동의하기 버튼 */}
            <div className="flex justify-between items-center">
              <Link href="/d/petitions">
                <div className="px-10 py-3 bg-teal-100 hover:bg-teal-200/70 transition-colors text-teal-500 rounded-xl">목록으로</div>
              </Link>
              
              <div className="flex space-x-3">
                {!closed && (
                  <div onClick={handleSupport} className={ isSupporting ? "px-10 py-3 bg-teal-500 opacity-50 transition-colors text-white rounded-xl font-semibold" : "px-10 py-3 bg-teal-500 cursor-pointer transition-colors text-white rounded-xl font-semibold" }>
                    {supportData?.supported ? "동의 취소하기" : "동의하기"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </OpacityAnimation>
      </div>
    </div>
  );
}
