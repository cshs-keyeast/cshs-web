'use client';

import useSWR from "swr";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { OpacityAnimation } from "@components/animation";
import Loading from "@components/loading";
import { SubButton } from "@components/button";
import displayDate from "@libs/client/time-display";
import Modal from "@components/modal";
import PetitionModal from "@components/info/petition";

type Petition = {
  id: number;
  title: string;
  createdAt: string;
  expiresAt?: string | null;
  writer?: { id: number; name: string; grade?: number; class?: number; number?: number } | null;
  supportCount: number;   // 현재 동의 수
  status?: 'open' | 'closed' | 'approved' | 'rejected';
};

export default function ActivityList() {
  const [status, setStatus] = useState<'open' | 'closed'>('open');
  const { data } = useSWR<{ success: boolean; petitions: Petition[] }>(`/api/petitions?status=${status}`);

  const petitions = data?.petitions ?? [];

  const targetCount = 126;
  function percent(p: Petition) {
    if (!p) return 0;
    const v = Math.round((p.supportCount / targetCount) * 100);
    return Math.max(0, Math.min(100, v));
  }

  function dday(expiresAt?: string | null) {
    if (!expiresAt) return null;
    const end = new Date(expiresAt);
    const today = new Date();
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? `D-${diff}` : `마감`;
  }

  const [petitionModal, setPetitionModal] = useState(false);
  useEffect(() => {
    if(document?.cookie.indexOf('petition-info-modal=') === -1) {
      setTimeout(() => {
        setPetitionModal(true);
      }, 500);
    }
  }, []);

  const content = useMemo(() => {
    if (!data) return <div className="w-full flex items-center justify-center text-teal-500 h-[50vh]">
      <Loading size={40} />
    </div>;

    return (
      <div>
        <OpacityAnimation>
          <div className="flex mb-8">
            <div className="flex items-center p-1 bg-gray-100 rounded-full">
              <div 
                onClick={() => setStatus('open')} 
                className={`text-center w-40 py-2 rounded-full cursor-pointer transition ${
                  status === 'open' ? 'bg-white font-bold' : 'text-gray-500'
                }`}
              >
                진행 중
              </div>
              <div 
                onClick={() => setStatus('closed')} 
                className={`text-center w-40 py-2 rounded-full cursor-pointer transition ${
                  status === 'closed' ? 'bg-white font-bold' : 'text-gray-500'
                }`}
              >
                종료됨
              </div>
            </div>
          </div>
          { !petitions.length && <div className="w-full py-20 text-center text-teal-500">등록된 청원이 없습니다.</div> }
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {petitions.map((p:any) => {
              const per = percent(p);
              const closed = status === 'closed' || per >= 100;
              const chipColor = closed ? 'bg-gray-100 text-gray-700' : 'bg-teal-100 text-teal-700';
              const barColor = closed ? 'bg-teal-500' : 'bg-teal-500';

              return (
                <Link href={`/d/petitions/${p.id}`} key={p.id}>
                  <div key={p.id} className="rounded-2xl border border-white hover:border-teal-500 cursor-pointer bg-white p-5 transition h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-xl font-bold line-clamp-2">{p.title}</div>
                        <div className="min-w-20 flex justify-end">
                          <div className={`ml-2 px-2 py-1 rounded-full text-xs ${chipColor}`}>
                            {closed ? '종료됨' : '진행중'}
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-zinc-500 mb-10">
                        <div>작성일: {displayDate(new Date(p.createdAt), 'date')}</div>
                        {/* <div>
                          {p.writer?.name ? `작성자: ${p.writer.name}` : '작성자: 익명'}
                          {p.writer?.grade ? ` (${p.writer.grade}${p.writer.class}${p.writer.number?.toString().padStart(2, '0')})` : ''}
                        </div> */}
                        {p.expiresAt && <div>마감: {dday(p.expiresAt)}</div>}
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-sm font-medium">동의 현황</div>
                        <div className="text-sm font-bold">{per}%</div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden mb-2">
                        <div
                          className={`h-full ${barColor} transition-all`}
                          style={{ width: `${per}%` }}
                        />
                      </div>
                      <div className="text-xs text-zinc-500">
                        {p.supportCount.toLocaleString()} / {targetCount.toLocaleString()}명 동의
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </OpacityAnimation>
      </div>
    );
  }, [data, petitions]);

  return (
    <>
      <AnimatePresence initial={false} mode="wait">
        { petitionModal && <Modal handleClose={() => setPetitionModal(false)}>
          <PetitionModal fn={() => {
            setPetitionModal(false);

            document.cookie = `petition-info-modal=true; path=/`;
          }} />
        </Modal> }
      </AnimatePresence>
      {content}
    </>
  );
}
