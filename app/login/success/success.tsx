'use client';

import useSWR from 'swr';
import type { NextPage } from 'next'
import { signOut } from 'next-auth/react';
import Head from 'next/head'
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import Loading from '@components/loading';

function SuccessContainer() {
  return (
    <Suspense>
      <Success/>
    </Suspense>
  )
}

const Success: NextPage = () => {
  const { data } = useSWR('/api/user');

  const router = useSearchParams();
  const callbackUrl = router.get('callbackUrl');

  useEffect(() => {
    if(data?.success === true) {
      if(callbackUrl && callbackUrl !== "undefined" && callbackUrl !== "null") location.href = callbackUrl;
      else location.href = "/d/home";
    } else {
      if(data?.message === '사용자 정보를 찾을 수 없어요' || data?.message === 'Unauthorized') {
        location.href = "/login/error";
      }
    }
  }, [data]);

  return (
    <div className='overflow-hidden'>
      <Head>
        <title>로그인</title>
      </Head>
      <div className="w-[100vw] h-[100vh] min-h-[800px]">
        <div style={{
          backgroundImage: 'linear-gradient(to top, #ffffff 0%, #bfdbfe 99%, #bfdbfe 100%)'
        }} className="w-full h-[100vh] bg-cover opacity-70 bg-opacity-0 overflow-hidden min-h-[800px]"></div>
        <div className='absolute z-20 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[93vw] md:w-[400px] px-5 py-5 bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden'>
          <div className={'h-[210px] w-full transition-all ease-[cubic-bezier(0.22, 1, 0.36, 1)] duration-300'}></div>
          <div className={"flex left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex-col absolute justify-center items-center overflow-hidden h-[210px] w-[80vw] md:w-[360px] mx-auto transition-all ease-[cubic-bezier(0.22, 1, 0.36, 1)] duration-500"}>
            <div className='font-bold text-center text-lg md:text-xl'>로그인을 완료하는 중</div>
            <div className='text-center text-sm md:text-base text-gray-500'>잠시 기다리면 로그인이 완료됩니다</div>
            <div className='text-center text-sm md:text-base text-gray-500'>이 창을 닫지 마세요</div>
            <div className='text-gray-500 mt-5'>
              <Loading size={25} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuccessContainer
