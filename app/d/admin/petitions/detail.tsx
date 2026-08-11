'use client';

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import Loading from "@components/loading";
import { Textarea } from "@components/input";
import Modal from "@components/modal";
import { AnimatePresence } from "framer-motion";
import { useAppDispatch } from "@libs/client/redux/hooks";
import { setNotification } from "@libs/client/redux/notification";

export default function AdminPetitionDetail({ id }: { id: string }) {
  const { data, isLoading, mutate } = useSWR(`/api/petitions/admin/${id}`);
  const [isEditing, setIsEditing] = useState(false);
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPublicToggle, setShowPublicToggle] = useState(false);
  const [confirmType, setConfirmType] = useState<'approve' | 'reject' | null>(null);

  const dispatch = useAppDispatch();

  const petition = data?.petition;

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/petitions/admin/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'open', isPublic: true })
      });

      if (res.ok) {
        dispatch(setNotification({ type: 'success', text: '청원이 공개되었습니다.' }));
        mutate();
      } else {
        dispatch(setNotification({ type: 'error', text: '오류가 발생했습니다.' }));
      }
    } finally {
      setIsSubmitting(false);
      setConfirmType(null);
    }
  };

  const handleReject = async () => {
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/petitions/admin/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', isPublic: false })
      });

      if (res.ok) {
        dispatch(setNotification({ type: 'success', text: '청원이 반려되었습니다.' }));
        mutate();
      } else {
        dispatch(setNotification({ type: 'error', text: '오류가 발생했습니다.' }));
      }
    } finally {
      setIsSubmitting(false);
      setConfirmType(null);
    }
  };

  const handleTogglePublic = async (isPublic: boolean) => {
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/petitions/admin/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: isPublic ? 'open' : 'closed', isPublic })
      });

      if (res.ok) {
        dispatch(setNotification({ type: 'success', text: isPublic ? '청원이 공개되었습니다.' : '청원이 비공개되었습니다.' }));
        setShowPublicToggle(false);
        mutate();
      } else {
        dispatch(setNotification({ type: 'error', text: '오류가 발생했습니다.' }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitResponse = async () => {
    if (!response.trim()) {
      dispatch(setNotification({ type: 'warning', text: '답변을 입력해주세요.' }));
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/petitions/admin/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response: response.trim()
        })
      });

      if (res.ok) {
        dispatch(setNotification({ type: 'success', text: '답변이 등록되었습니다.' }));
        setResponse('');
        setIsEditing(false);
        mutate();
      } else {
        dispatch(setNotification({ type: 'error', text: '오류가 발생했습니다.' }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      'pending': { label: '심사중', color: 'bg-yellow-100 text-yellow-800' },
      'open': { label: '공개', color: 'bg-green-100 text-green-800' },
      'closed': { label: '비공개', color: 'bg-gray-100 text-gray-800' },
      'rejected': { label: '반려', color: 'bg-red-100 text-red-800' }
    };
    return badges[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex justify-center my-52 text-teal-500">
          <Loading size={35} />
        </div>
      </div>
    );
  }

  if (!petition) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">청원을 찾을 수 없습니다.</div>
      </div>
    );
  }

  const isOpen = petition.status === 'open';
  const isClosed = petition.status === 'closed';
  const isPending = petition.status === 'pending';

  return (
    <div className="w-full">
      <AnimatePresence initial={false} mode="wait">
        { confirmType && <Modal handleClose={() => !isSubmitting && setConfirmType(null)}>
          <div className="md:w-[320px] h-auto">
            <div className="font-bold text-xl text-zinc-800">
              {confirmType === 'approve' ? '이 청원을 공개하시겠습니까?' : '이 청원을 반려하시겠습니까?'}
            </div>
            <div className="flex items-center space-x-2 mt-5">
              <div
                onClick={() => !isSubmitting && setConfirmType(null)}
                className="bg-gray-100 hover:bg-gray-200 text-base transition-all font-medium text-zinc-800 justify-center w-full py-3 flex items-center cursor-pointer rounded-xl"
              >
                취소
              </div>
              { !isSubmitting ? (
                <div
                  onClick={() => confirmType === 'approve' ? handleApprove() : handleReject()}
                  className={`${confirmType === 'approve' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-base transition-all font-medium text-white justify-center w-full py-3 flex items-center cursor-pointer rounded-xl`}
                >
                  {confirmType === 'approve' ? '공개하기' : '반려하기'}
                </div>
              ) : (
                <div className={`${confirmType === 'approve' ? 'bg-green-500/50' : 'bg-red-500/50'} text-base transition-all font-medium text-white justify-center w-full py-3 flex items-center rounded-xl h-[48px]`}>
                  <Loading size={20} />
                </div>
              )}
            </div>
          </div>
        </Modal> }
      </AnimatePresence>

      {/* 헤더 */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-zinc-800">{petition.title}</h1>
          </div>
          <span className={`px-4 py-1 rounded-full text-sm font-bold ${getStatusBadge(petition.status).color}`}>
            {getStatusBadge(petition.status).label}
          </span>
          <div className="flex items-center gap-6 mt-4 text-gray-600">
            {/* <div>
              <span className="tossface">👤</span> <strong>{petition.writer.name}</strong> ({petition.writer.grade}학년 {petition.writer.class}반)
            </div> */}
            <div><span className="tossface">🔗</span> 동의 {petition.supportCount}명</div>
            <div><span className="tossface">📅</span> {new Date(petition.createdAt).toLocaleDateString('ko-KR')}</div>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-gray-100 text-gray-500 text-base p-5 mb-4">
        <strong>청원 관리 가이드라인</strong>
        <ul className="list-disc list-inside">
          <li>청원 상태를 신중히 관리해주세요.(특히 공개 및 반려는 반드시 작성 규칙에 따라 객관적으로 판단)</li>
          <li>심사를 번복하지 마세요.(번복할 경우 반드시 번복 일시와 사유를 담당자에게 알리기)</li>
          <li>심사는 혼자 있는 공간에서 진행하세요.(공개되지 않은 청원은 심사자를 제외하고 누구도 볼 수 없습니다.<br/>심사하는 과정에서 다른 사람이 관여하지 않도록 반드시 혼자 있는 공간에서 진행하세요)</li>
          <li>청원 관련 관리자의 권한, 심사 내용, 결과는 철저히 비공개로 유지해야 합니다.</li>
          <li>기타 문의사항은 담당자에게 연락하세요.(2025년 - 학생회 청원부 최지환)</li>
          <li><a className="underline" target="_blank" href="/d/petitions/terms">청원 게시판 이용수칙 바로가기</a></li>
        </ul>
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-3 mb-8">
        {isPending && (
          <>
            <button
              onClick={() => setConfirmType('approve')}
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? '처리중...' : '공개하기'}
            </button>
            <button
              onClick={() => setConfirmType('reject')}
              disabled={isSubmitting}
              className="px-6 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? '처리중...' : '반려하기'}
            </button>
          </>
        )}

        {(isOpen || isClosed) && (
          <button
            onClick={() => setShowPublicToggle(!showPublicToggle)}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          >
            공개/비공개 전환
          </button>
        )}
      </div>

      {/* 공개/비공개 토글 */}
      {showPublicToggle && (
        <div className="bg-blue-50 rounded-lg p-4 mb-8 flex justify-between items-center">
          <div>
            <p className="font-semibold text-blue-900">공개/비공개 전환</p>
            <p className="text-sm text-blue-700">현재 상태: {isOpen ? '공개' : '비공개'}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleTogglePublic(true)}
              disabled={isSubmitting || isOpen}
              className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              공개
            </button>
            <button
              onClick={() => handleTogglePublic(false)}
              disabled={isSubmitting || isClosed}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              비공개
            </button>
            <button
              onClick={() => setShowPublicToggle(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 청원 내용 */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-zinc-800 mb-3">청원 이유</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{petition.reason}</p>
        </div>

        <hr className="my-6" />

        <div>
          <h2 className="text-lg font-bold text-zinc-800 mb-3">청원 내용</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{petition.content}</p>
        </div>
      </div>

      {/* 만료 날짜 */}
      <div className="bg-amber-50 rounded-lg p-4 mb-8">
        <p className="text-amber-900">
          <strong>만료일:</strong> {new Date(petition.expiresAt).toLocaleDateString('ko-KR')}
          {new Date(petition.expiresAt) < new Date() && (
            <span className="text-red-600 font-bold ml-2">(만료됨)</span>
          )}
        </p>
      </div>

      {/* 답변 섹션 */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-lg font-bold text-zinc-800 mb-4">답변</h2>

        {petition.response ? (
          <div className="bg-teal-50 rounded-lg p-5 mb-4">
            <p className="text-sm text-gray-600 mb-2">
              <strong>답변자:</strong> {petition.responder || '알 수 없음'}
            </p>
            <p className="text-gray-700 whitespace-pre-wrap">{petition.response}</p>
          </div>
        ) : (
          <div className="text-gray-500 mb-4">아직 답변이 없습니다.</div>
        )}

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-colors"
          >
            {petition.response ? '답변 수정' : '답변 작성'}
          </button>
        ) : (
          <div className="space-y-3">
            <Textarea
              value={response}
              placeholder="답변을 입력해주세요..."
              fn={(s:string) => setResponse(s)}
              full
              color="teal"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSubmitResponse}
                disabled={isSubmitting}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? '저장중...' : '답변 저장'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setResponse('');
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
