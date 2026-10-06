'use client'

import Loading from "@components/loading";
import Announcement from "./announcement";
import { useState } from "react";
import useSWR from 'swr';

export default function Announcements(input) {
  const {data, mutate, isLoading} = useSWR('/api/announcement');

  return (
    <div className="w-full max-h-[calc(100vh-250px)] px-2 bg-white space-y-5 overflow-y-auto custm-scroll">
      {data?.success === true ? data?.data.map(announcement => (
        <Announcement announcementData={JSON.stringify(announcement)} />
      )) : <div className="flex justify-center w-full my-32 text-blue-500">
        <Loading size={40}/>
      </div>}
      {data?.data.length === 0 && <div className="flex justify-center flex-col items-center w-full my-32 text-lightgray-200">
        <svg className="w-10 h-10 mb-3" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
        </svg>
        공지사항이 없습니다.
      </div>}
    </div>
  )
}